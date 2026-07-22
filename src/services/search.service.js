const { supabaseRest } = require('./api');

const searchService = {
  searchVideos: async (query) => {
    if (!query || !query.trim()) return [];
    try {
      const q = query.trim();
      return await supabaseRest('videos', {
        select: '*,categories(name)',
        status: 'eq.active',
        deleted_at: 'is.null',
        title: `ilike.%${q}%`,
      });
    } catch (e) {
      console.error('[searchService.searchVideos] Error:', e.message);
      return [];
    }
  },
};

module.exports = searchService;
