const { request } = require('./api');

const reportsService = {
  getDashboardReport: async (timeframe = '7d', childId = null) => {
    try {
      const params = new URLSearchParams({ timeframe });
      if (childId) params.append('childId', childId);
      return await request(`/api/reports/dashboard?${params.toString()}`);
    } catch (e) {
      return null;
    }
  },
};

module.exports = reportsService;
