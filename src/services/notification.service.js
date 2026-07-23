const { supabaseRest } = require('./api');

const notificationService = {
  getNotifications: async () => {
    try {
      const results = await supabaseRest('notifications', {
        select: '*',
        order: 'created_at.desc',
        limit: '10',
      });
      return Array.isArray(results) ? results : [];
    } catch (e) {
      // notifications table does not exist in this Supabase project
      return [];
    }
  },
};

module.exports = notificationService;
