const { getActiveChild } = require('./api');

const settingsService = {
  getSettings: async () => {
    const activeChild = await getActiveChild();
    return {
      dailyTimeLimit: activeChild?.daily_time_limit || 60,
      childName: activeChild?.name || 'Explorer',
      age: activeChild?.age || 0,
      avatarUrl: activeChild?.avatar_url || null,
      accessCode: activeChild?.access_code || '',
    };
  },
};

module.exports = settingsService;
