import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_STORAGE_KEY = '@kidoro_analytics_event_queue_v1';
const BATCH_SIZE = 10;
const FLUSH_INTERVAL_MS = 15000; // 15 seconds

class AnalyticsService {
  constructor() {
    this.queue = [];
    this.isFlushing = false;
    this.timer = null;
    this.apiEndpoint = 'https://kidora-next.vercel.app/api/analytics/track'; // Configurable
    this.init();
  }

  async init() {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (err) {
      console.warn('Failed loading stored analytics queue:', err);
    }
    this.startAutoFlush();
  }

  setEndpoint(url) {
    if (url) this.apiEndpoint = url;
  }

  async track(eventName, payload = {}) {
    const event = {
      event_name: eventName,
      timestamp: new Date().toISOString(),
      platform: 'react-native',
      device_type: 'mobile',
      ...payload
    };

    this.queue.push(event);
    this.persistQueue();

    if (this.queue.length >= BATCH_SIZE) {
      this.flush();
    }
  }

  async persistQueue() {
    try {
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue.slice(-100)));
    } catch (e) {
      // Non-blocking catch
    }
  }

  startAutoFlush() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);
  }

  async flush() {
    if (this.isFlushing || this.queue.length === 0) return;
    this.isFlushing = true;

    const batch = [...this.queue];
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch),
      });

      if (response.ok) {
        // Remove successfully sent events from queue
        this.queue = this.queue.filter(evt => !batch.includes(evt));
        this.persistQueue();
      }
    } catch (err) {
      // Network error or offline — leave in queue for next retry
    } finally {
      this.isFlushing = false;
    }
  }
}

export const analytics = new AnalyticsService();
