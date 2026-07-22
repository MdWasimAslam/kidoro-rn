const { supabaseRest } = require('./api');

const categoryService = {
  getCategories: async () => {
    try {
      // Contract: categories table status = enabled & deleted_at is null
      return await supabaseRest('categories', {
        select: '*',
        status: 'eq.enabled',
        deleted_at: 'is.null',
        order: 'sort_order.asc',
      });
    } catch (e) {
      console.error('[categoryService.getCategories] Error:', e.message);
      return [];
    }
  },
};

module.exports = categoryService;
