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
      return [];
    }
  },
};

module.exports = categoryService;
