function resolveAsyncStorage() {
  try {
    const mod = require('@react-native-async-storage/async-storage');
    const instance = mod.default || mod;
    if (instance && typeof instance.getItem === 'function') return instance;
  } catch (e) { /* not available */ }
  return null;
}

function getWebStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return {
      getItem: async (key) => window.localStorage.getItem(key),
      setItem: async (key, value) => window.localStorage.setItem(key, value),
      removeItem: async (key) => window.localStorage.removeItem(key),
    };
  }
  return null;
}

let storageImpl = null;

function getImpl() {
  if (storageImpl) return storageImpl;

  const webStore = getWebStorage();
  if (webStore) {
    storageImpl = webStore;
    return storageImpl;
  }

  const asyncStore = resolveAsyncStorage();
  if (asyncStore) {
    storageImpl = {
      getItem: async (key) => asyncStore.getItem(key),
      setItem: async (key, value) => asyncStore.setItem(key, value),
      removeItem: async (key) => asyncStore.removeItem(key),
    };
    return storageImpl;
  }

  const mem = {};
  storageImpl = {
    getItem: async (key) => mem[key] || null,
    setItem: async (key, value) => { mem[key] = value; },
    removeItem: async (key) => { delete mem[key]; },
  };
  return storageImpl;
}

module.exports = {
  getItem: async (key) => {
    try { return await getImpl().getItem(key); } catch (e) { return null; }
  },
  setItem: async (key, value) => {
    try { await getImpl().setItem(key, value); } catch (e) { /* ignore */ }
  },
  removeItem: async (key) => {
    try { await getImpl().removeItem(key); } catch (e) { /* ignore */ }
  },
};
