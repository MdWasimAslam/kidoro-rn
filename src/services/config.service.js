const { request, supabaseRest } = require('./api');

const DEFAULT_CONFIG = {
  theme: { primaryColor: '#EF4444', secondaryColor: '#F59E0B', accentColor: '#3B82F6', defaultTheme: 'system' },
  home: { showBanner: true, bannerTitle: 'Welcome to Kidoro', showFeatured: true, showContinueWatching: true, showCategories: true },
  features: { enableSearch: true, enableNotifications: true, enableDownloads: true, enableDarkMode: true },
  version: { currentVersion: '1.0.0', minSupportedVersion: '1.0.0', forceUpdate: false, forceUpdateMessage: 'Please update to the latest version' },
  maintenance: { enabled: false, message: "We're making things better. Check back soon." },
};

let cachedConfig = null;

function deepMerge(defaults, overrides) {
  const result = { ...defaults };
  if (!overrides) return result;
  for (const key of Object.keys(result)) {
    if (overrides[key] !== undefined && overrides[key] !== null) {
      if (typeof result[key] === 'object' && !Array.isArray(result[key]) && typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
        result[key] = deepMerge(result[key], overrides[key]);
      } else {
        result[key] = overrides[key];
      }
    }
  }
  return result;
}

const configService = {
  fetchConfig: async () => {
    try {
      const data = await request('/api/app-config');
      cachedConfig = deepMerge(DEFAULT_CONFIG, data);
      return cachedConfig;
    } catch (e) {
      // REST fetch failed, trying Supabase fallback
    }

    try {
      const res = await supabaseRest('app_config', { select: 'config', id: 'eq.1' });
      if (res && res[0] && res[0].config) {
        cachedConfig = deepMerge(DEFAULT_CONFIG, res[0].config);
        return cachedConfig;
      }
    } catch (e2) {
      // Supabase fallback failed, using defaults
    }

    cachedConfig = DEFAULT_CONFIG;
    return DEFAULT_CONFIG;
  },

  getConfig: () => cachedConfig || DEFAULT_CONFIG,
};

module.exports = configService;
