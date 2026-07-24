const { request, supabaseRest, SUPABASE_ANON_KEY, setActiveChild } = require('./api');
const storage = require('../utils/storage');
const { TOKEN_KEY } = require('./api');

const authService = {
  loginParent: async (email, password) => {
    try {
      // Authenticate via Supabase Auth endpoint or backend auth route
      const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://uhqgqllpovhoesfvkgvv.supabase.co'}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY,
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
      throw e;
    }
  },

  logout: async () => {
    try {
      await storage.clear();
      setActiveChild(null); // clear in-memory cache so getActiveChild() returns null
    } catch (e) {
      // storage error, non-blocking
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
