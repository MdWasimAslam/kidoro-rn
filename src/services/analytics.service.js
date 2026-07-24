const { request, getActiveChild, SUPABASE_URL, SUPABASE_ANON_KEY } = require('./api');
const storage = require('../utils/storage');

const QUEUE_KEY = '@kidoro_analytics_queue';

/**
 * Insert an analytics event directly into Supabase's analytics_events table.
 * Schema: id, parent_id, child_id, event_name, video_id, short_id, category_id,
 *         playlist_id, creator_id, session_id, duration_seconds, completion_pct,
 *         device_type, platform, network_type, metadata, created_at (auto)
 */
async function insertToSupabase(eventPayload) {
  const url = `${SUPABASE_URL}/rest/v1/analytics_events`;
  const activeChild = await getActiveChild();

  const payload = {
    parent_id: activeChild?.parent_id || null,
    access_key: activeChild?.access_key || null,
    child_id: eventPayload.child_id || activeChild?.id || null,
    event_name: eventPayload.event_name,
    video_id: eventPayload.video_id || null,
    short_id: eventPayload.short_id || null,
    category_id: eventPayload.category_id || null,
    playlist_id: eventPayload.playlist_id || null,
    duration_seconds: typeof eventPayload.duration_seconds === 'number' ? eventPayload.duration_seconds : null,
    completion_pct: typeof eventPayload.completion_pct === 'number' ? eventPayload.completion_pct : null,
    device_type: 'mobile',
    platform: 'react-native',
    metadata: eventPayload.metadata || {},
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Supabase insert error: ${response.status}`);
  }
}

const analyticsService = {
  trackEvent: async (eventPayload) => {
    let success = false;

    // Try 1: Supabase direct insert (no backend server needed, analytics_events table exists)
    if (!success) {
      try {
        await insertToSupabase(eventPayload);
        success = true;
      } catch (e) {
        // Supabase insert failed, try backend
      }
    }

    // Try 2: Custom backend API endpoint
    if (!success) {
      try {
        const activeChild = await getActiveChild();
        const payload = {
          ...eventPayload,
          parent_id: activeChild?.parent_id || null,
          child_id: eventPayload.child_id || activeChild?.id || null,
        };
        await request('/api/analytics/track', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        success = true;
      } catch (e) {
        // Backend failed too, queue locally
      }
    }

    // Fallback: Queue to local storage for later flush
    if (!success) {
      try {
        const activeChild = await getActiveChild();
        const queueRaw = await storage.getItem(QUEUE_KEY);
        const queue = queueRaw ? JSON.parse(queueRaw) : [];
        queue.push({
          ...eventPayload,
          parent_id: activeChild?.parent_id || null,
          child_id: eventPayload.child_id || activeChild?.id || null,
          timestamp: new Date().toISOString(),
        });
        await storage.setItem(QUEUE_KEY, JSON.stringify(queue));
      } catch (queueErr) { /* non-blocking */ }
    }
  },

  flushQueue: async () => {
    try {
      const queueRaw = await storage.getItem(QUEUE_KEY);
      if (!queueRaw) return;
      const queue = JSON.parse(queueRaw);
      if (!queue.length) return;

      // Try inserting batch into Supabase first (table exists)
      const url = `${SUPABASE_URL}/rest/v1/analytics_events`;
      const activeChild = await getActiveChild();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(queue.map(e => ({
          parent_id: activeChild?.parent_id || null,
          access_key: activeChild?.access_key || null,
          child_id: e.child_id || activeChild?.id || null,
          event_name: e.event_name,
          video_id: e.video_id || null,
          short_id: e.short_id || null,
          category_id: e.category_id || null,
          playlist_id: e.playlist_id || null,
          duration_seconds: typeof e.duration_seconds === 'number' ? e.duration_seconds : null,
          completion_pct: typeof e.completion_pct === 'number' ? e.completion_pct : null,
          device_type: 'mobile',
          platform: 'react-native',
          metadata: e.metadata || {},
        }))),
      });

      if (response.ok) {
        await storage.removeItem(QUEUE_KEY);
      } else {
        // Try backend API as fallback
        await request('/api/analytics/track', {
          method: 'POST',
          body: JSON.stringify(queue),
        });
        await storage.removeItem(QUEUE_KEY);
      }
    } catch (e) {
      // flush failed, events stay queued
    }
  },
};

module.exports = analyticsService;
