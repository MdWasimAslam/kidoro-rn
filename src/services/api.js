const storage = require('../utils/storage');

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000';
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://uhqgqllpovhoesfvkgvv.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_TI4B6oSjRgF1epWR5WUyog_C32HkewG';

const TOKEN_KEY = '@kidoro_auth_token';
const CHILD_KEY = '@kidoro_child_session';

async function getToken() {
  try {
    return await storage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

async function getActiveChild() {
  try {
    const data = await storage.getItem(CHILD_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
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
    console.error(`[API Error] ${endpoint}:`, error.message);
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

  const parts = [];
  for (const key of Object.keys(queryParams)) {
    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]));
  }
  const queryString = parts.join('&');
  const url = `${SUPABASE_URL}/rest/v1/${table}${queryString ? '?' + queryString : ''}`;
  console.log('[supabaseRest] GET', url);

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
    console.error('[getAppConfig] Error:', e.message);
    return null;
  }
}

module.exports = {
  request,
  supabaseRest,
  getAppConfig,
  getToken,
  getActiveChild,
  TOKEN_KEY,
  CHILD_KEY,
  BASE_URL,
  SUPABASE_URL,
};
