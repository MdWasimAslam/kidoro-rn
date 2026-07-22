const { supabaseRest } = require('./api');

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
      console.error('[videoService.getVideos] Error:', e.message);
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
      console.error('[videoService.getFeaturedVideos] Error:', e.message);
      return [];
    }
  },

  toggleFavorite: async (videoId, currentStatus) => {
    try {
      const token = await require('./api').getToken();
      const headers = {
        'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      };
      const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/videos?id=eq.${videoId}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ favorite: !currentStatus }),
      });
      return await res.json();
    } catch (e) {
      console.error('[videoService.toggleFavorite] Error:', e.message);
      return null;
    }
  },
};

module.exports = videoService;
