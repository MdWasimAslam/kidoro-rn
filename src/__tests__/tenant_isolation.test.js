import { jest } from '@jest/globals';
import storage from '../utils/storage';
import authService from '../services/auth.service';
import { supabaseRest, getActiveChild, setActiveChild } from '../services/api';
import useFavorites from '../hooks/useFavorites';
import { renderHook, act } from '@testing-library/react-hooks';

// Mock getActiveChild and setActiveChild specifically for testing hook updates
let mockActiveChild = null;

jest.mock('../services/api', () => {
  const actual = jest.requireActual('../services/api');
  return {
    ...actual,
    getActiveChild: jest.fn(async () => mockActiveChild),
    setActiveChild: jest.fn((child) => {
      mockActiveChild = child;
    }),
  };
});

describe('Multi-Tenant Data Isolation Tests', () => {
  beforeEach(async () => {
    mockActiveChild = null;
    await storage.clear();
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );
  });

  test('1. Logging out clears all local caches completely', async () => {
    await storage.setItem('some_cache_key', 'some_value');
    expect(await storage.getItem('some_cache_key')).toBe('some_value');

    mockActiveChild = { id: 'child-123', name: 'Child A', access_key: 'KEY123' };
    await authService.logout();

    expect(await storage.getItem('some_cache_key')).toBeNull();
    expect(mockActiveChild).toBeNull();
  });

  test('2. Cache keys for favorites are isolated per parent access_key', async () => {
    // Parent A
    mockActiveChild = { id: 'child-A', name: 'Child A', access_key: 'KEY_A' };
    const { result: hookA, waitForNextUpdate: waitA } = renderHook(() => useFavorites());
    await act(async () => {
      // Let polling trigger update
      await new Promise((r) => setTimeout(r, 600));
    });
    
    await act(async () => {
      await hookA.current.toggleFavorite('video-123');
    });
    expect(hookA.current.isFavorite('video-123')).toBe(true);

    // Switch to Parent B
    mockActiveChild = { id: 'child-B', name: 'Child B', access_key: 'KEY_B' };
    const { result: hookB } = renderHook(() => useFavorites());
    await act(async () => {
      await new Promise((r) => setTimeout(r, 600));
    });

    expect(hookB.current.isFavorite('video-123')).toBe(false);

    // Switch back to Parent A to check persistence
    mockActiveChild = { id: 'child-A', name: 'Child A', access_key: 'KEY_A' };
    const { result: hookA2 } = renderHook(() => useFavorites());
    await act(async () => {
      await new Promise((r) => setTimeout(r, 600));
    });
    expect(hookA2.current.isFavorite('video-123')).toBe(true);
  });

  test('3. Direct Rest API calls automatically filter using the authenticated user\'s accessKey', async () => {
    mockActiveChild = { id: 'child-A', name: 'Child A', access_key: 'KEY_A' };

    await supabaseRest('videos', { status: 'eq.active' });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('access_key=eq.KEY_A'),
      expect.any(Object)
    );
  });
});
