import { jest } from '@jest/globals';
import './mockSetup';
import { videos, getFavoriteVideos, getTrendingVideos, getContinueWatching, getSearchResults, getVideosByCategory } from '../mock/videos';
import { shorts } from '../mock/shorts';
import { categories, homeSections, trendingSearches } from '../mock/categories';
import { profile } from '../mock/profile';

describe('Mock Videos', () => {
  test('should have exactly 50 videos', () => {
    expect(videos.length).toBe(50);
  });

  test('each video should have required fields', () => {
    videos.forEach(v => {
      expect(v.id).toBeDefined();
      expect(v.title).toBeDefined();
      expect(v.thumbnail).toBeDefined();
      expect(v.youtubeId).toBeDefined();
      expect(v.duration).toBeDefined();
      expect(v.views).toBeDefined();
      expect(v.category).toBeDefined();
      expect(typeof v.favorite).toBe('boolean');
      expect(v.channel).toBeDefined();
      expect(v.description).toBeDefined();
    });
  });

  test('no duplicate video IDs', () => {
    const ids = videos.map(v => v.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('no duplicate youtubeIds', () => {
    const ids = videos.map(v => v.youtubeId);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('Mock Shorts', () => {
  test('should have exactly 50 shorts', () => {
    expect(shorts.length).toBe(50);
  });

  test('each short should have required fields', () => {
    shorts.forEach(s => {
      expect(s.id).toBeDefined();
      expect(s.title).toBeDefined();
      expect(s.thumbnail).toBeDefined();
      expect(s.videoUrl).toBeDefined();
      expect(s.views).toBeDefined();
      expect(s.likes).toBeDefined();
      expect(s.category).toBeDefined();
    });
  });

  test('no duplicate short IDs', () => {
    const ids = shorts.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('short IDs should not overlap with video IDs', () => {
    const videoIds = new Set(videos.map(v => v.id));
    const shortIds = shorts.map(s => s.id);
    const hasOverlap = shortIds.some(id => videoIds.has(id));
    expect(hasOverlap).toBe(false);
  });
});

describe('Categories', () => {
  test('should have 12 categories', () => {
    expect(categories.length).toBe(12);
  });

  test('each category should have id, name, icon, color', () => {
    categories.forEach(c => {
      expect(c.id).toBeDefined();
      expect(c.name).toBeDefined();
      expect(c.icon).toBeDefined();
      expect(c.color).toBeDefined();
    });
  });

  test('homeSections should have at least 8 sections', () => {
    expect(homeSections.length).toBeGreaterThanOrEqual(8);
  });

  test('trendingSearches should have items', () => {
    expect(trendingSearches.length).toBeGreaterThan(0);
  });
});

describe('Profile', () => {
  test('should have required fields', () => {
    expect(profile.name).toBeDefined();
    expect(profile.avatar).toBeDefined();
    expect(profile.xp).toBeDefined();
    expect(profile.level).toBeDefined();
    expect(profile.streak).toBeDefined();
    expect(profile.favoriteCategory).toBeDefined();
    expect(profile.badges).toBeDefined();
  });

  test('badges should have id, name, icon, color', () => {
    profile.badges.forEach(b => {
      expect(b.id).toBeDefined();
      expect(b.name).toBeDefined();
      expect(b.icon).toBeDefined();
      expect(b.color).toBeDefined();
    });
  });
});

describe('Video Helpers', () => {
  test('getFavoriteVideos should return favorited videos', () => {
    const favs = getFavoriteVideos();
    favs.forEach(v => expect(v.favorite).toBe(true));
  });

  test('getTrendingVideos should return top 10 by views', () => {
    const trending = getTrendingVideos();
    expect(trending.length).toBeLessThanOrEqual(10);
    trending.forEach(v => expect(v.views).toBeDefined());
  });

  test('getContinueWatching should return videos with progress', () => {
    const watching = getContinueWatching();
    watching.forEach(v => {
      expect(v.progress).toBeGreaterThan(0);
    });
  });

  test('getSearchResults should filter by title', () => {
    const results = getSearchResults('Sharks');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(v => {
      const match = v.title.toLowerCase().includes('sharks') ||
                    v.category.toLowerCase().includes('sharks') ||
                    v.description.toLowerCase().includes('sharks');
      expect(match).toBe(true);
    });
  });

  test('getSearchResults should return empty for no match', () => {
    const results = getSearchResults('xyznonexistent12345');
    expect(results.length).toBe(0);
  });

  test('getVideosByCategory should filter correctly', () => {
    const animalVids = getVideosByCategory('Animals');
    animalVids.forEach(v => expect(v.category).toBe('Animals'));
  });
});
