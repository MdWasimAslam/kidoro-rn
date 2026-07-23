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
        order: 'created_at.desc',
      });
    } catch (e) {
      return [];
    }
  },
};

module.exports = searchService;
