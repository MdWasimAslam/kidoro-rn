const { supabaseRest } = require('./api');

const shortsService = {
  getShorts: async (limit = 20) => {
    try {
      // Contract: shorts table status = active & deleted_at is null
      return await supabaseRest('shorts', {
        select: '*',
        status: 'eq.active',
        deleted_at: 'is.null',
        order: 'created_at.desc',
        limit: limit.toString(),
      });
    } catch (e) {
      return [];
    }
  },
};

module.exports = shortsService;
