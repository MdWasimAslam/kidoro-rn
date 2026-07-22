const notificationService = {
  getNotifications: async () => {
    try {
      const { supabaseRest } = require('./api');
      const results = await supabaseRest('notifications', {
        select: '*',
        order: 'created_at.desc',
        limit: '10',
      });
      return Array.isArray(results) ? results : [];
    } catch (e) {
      return [];
    }
  },
};

module.exports = notificationService;
