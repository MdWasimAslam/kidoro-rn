const storage = require('../utils/storage');

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://uhqgqllpovhoesfvkgvv.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_TI4B6oSjRgF1epWR5WUyog_C32HkewG';

const TOKEN_KEY = '@kidoro_auth_token';
const CHILD_KEY = '@kidoro_child_session';

// In-memory cache for active child — survives even if AsyncStorage write fails
let _cachedChild = null;

async function getToken() {
  try {
    return await storage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

async function getActiveChild() {
  // Check in-memory cache first (fastest path)
  if (_cachedChild) return _cachedChild;
  try {
    const data = await storage.getItem(CHILD_KEY);
    if (data) {
      _cachedChild = JSON.parse(data);
      return _cachedChild;
    }
    return null;
  } catch (e) {
    return _cachedChild || null;
  }
}

function setActiveChild(child) {
  // Always cache in memory immediately
  _cachedChild = child;
  // Persist to storage asynchronously (non-blocking)
  if (child) {
    storage.setItem(CHILD_KEY, JSON.stringify(child)).catch(() => {});
  } else {
    storage.removeItem(CHILD_KEY).catch(() => {});
  }
}

async function request(endpoint, options = {}) {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired handler
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

// Direct Supabase REST API queries (matching contracts in API_DOCUMENTATION.md)
async function supabaseRest(table, queryParams = {}) {
  const token = await getToken();
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };

  const params = { ...queryParams };

  // Auto filter by access_key for tenant isolation
  if (table !== 'app_config' && table !== 'profiles') {
    const activeChild = await getActiveChild();
    if (activeChild?.access_key) {
      params['access_key'] = `eq.${activeChild.access_key}`;
    }
  }

  const parts = [];
  for (const key of Object.keys(params)) {
    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
  }
  const queryString = parts.join('&');
  const url = `${SUPABASE_URL}/rest/v1/${table}${queryString ? '?' + queryString : ''}`;
  // rest query prepared

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Supabase REST error: ${response.status}`);
  }
  return await response.json();
}

async function getAppConfig() {
  try {
    return await supabaseRest('app_config', {
      select: 'config',
      id: 'eq.1',
    }).then(res => res[0]?.config || null);
  } catch (e) {
    return null;
  }
}

module.exports = {
  request,
  supabaseRest,
  getAppConfig,
  getToken,
  getActiveChild,
  setActiveChild,
  TOKEN_KEY,
  CHILD_KEY,
  BASE_URL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
};
