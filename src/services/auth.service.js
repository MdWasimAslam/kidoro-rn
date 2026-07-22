const { request, supabaseRest } = require('./api');
const storage = require('../utils/storage');
const { TOKEN_KEY } = require('./api');

const authService = {
  loginParent: async (email, password) => {
    try {
      // Authenticate via Supabase Auth endpoint or backend auth route
      const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://lyvjygwygwlyygvw.supabase.co'}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || data.msg || 'Authentication failed');

      if (data.access_token) {
        await storage.setItem(TOKEN_KEY, data.access_token);
        if (data.refresh_token) {
          await storage.setItem('@kidoro_refresh_token', data.refresh_token);
        }
      }
      return data;
    } catch (e) {
      console.error('[authService.loginParent] Error:', e.message);
      throw e;
    }
  },

  logout: async () => {
    try {
      await storage.removeItem(TOKEN_KEY);
      await storage.removeItem('@kidoro_refresh_token');
      await storage.removeItem('@kidoro_child_session');
    } catch (e) {
      console.error('[authService.logout] Error:', e.message);
    }
  },

  verifySession: async () => {
    try {
      const token = await storage.getItem(TOKEN_KEY);
      return !!token;
    } catch (e) {
      return false;
    }
  },
};

module.exports = authService;
