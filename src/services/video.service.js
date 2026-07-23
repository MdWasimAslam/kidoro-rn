const { supabaseRest, getToken, SUPABASE_ANON_KEY, SUPABASE_URL } = require('./api');

const videoService = {
  getVideos: async (limit = 50) => {
    try {
      // Contract: videos table status = active & deleted_at is null
      return await supabaseRest('videos', {
        select: '*,categories(name)',
        status: 'eq.active',
        deleted_at: 'is.null',
        order: 'created_at.desc',
        limit: limit.toString(),
      });
    } catch (e) {
      return [];
    }
  },

  getFeaturedVideos: async () => {
    try {
      return await supabaseRest('videos', {
        select: '*,categories(name)',
        status: 'eq.active',
        deleted_at: 'is.null',
        favorite: 'eq.true',
        limit: '5',
      });
    } catch (e) {
      return [];
    }
  },

  toggleFavorite: async (videoId, currentStatus) => {
    try {
      const token = await getToken();
      const headers = {
        'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      };
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || SUPABASE_URL;
      const url = `${supabaseUrl}/rest/v1/videos?id=eq.${videoId}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ favorite: !currentStatus }),
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },
};

module.exports = videoService;
