const { request } = require('./api');
const storage = require('../utils/storage');

const QUEUE_KEY = '@kidoro_analytics_queue';

const analyticsService = {
  trackEvent: async (eventPayload) => {
    try {
      // POST /api/analytics/track endpoint spec
      await request('/api/analytics/track', {
        method: 'POST',
        body: JSON.stringify(eventPayload),
      });
    } catch (e) {
      console.warn('[analyticsService.trackEvent] Offline/Failed, queuing event:', e.message);
      try {
        const queueRaw = await storage.getItem(QUEUE_KEY);
        const queue = queueRaw ? JSON.parse(queueRaw) : [];
        queue.push({ ...eventPayload, timestamp: new Date().toISOString() });
        await storage.setItem(QUEUE_KEY, JSON.stringify(queue));
      } catch (queueErr) {
        console.error('[analyticsService] Failed to queue event:', queueErr.message);
      }
    }
  },

  flushQueue: async () => {
    try {
      const queueRaw = await storage.getItem(QUEUE_KEY);
      if (!queueRaw) return;
      const queue = JSON.parse(queueRaw);
      if (!queue.length) return;

      await request('/api/analytics/track', {
        method: 'POST',
        body: JSON.stringify(queue),
      });
      await storage.removeItem(QUEUE_KEY);
      console.log(`[analyticsService] Flushed ${queue.length} events.`);
    } catch (e) {
      console.warn('[analyticsService.flushQueue] Flush pending:', e.message);
    }
  },
};

module.exports = analyticsService;
