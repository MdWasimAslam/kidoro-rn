const storage = require('../src/utils/storage');
const authService = require('../src/services/auth.service');
const { supabaseRest, getActiveChild, setActiveChild } = require('../src/services/api');

// Mock global fetch
let lastUrl = '';
let lastOptions = {};
global.fetch = async (url, options) => {
  lastUrl = url;
  lastOptions = options;
  return {
    ok: true,
    json: async () => []
  };
};

async function runTests() {
  console.log('Running Tenant Isolation Verification Tests...');

  // 1. Verify Storage Clear
  await storage.setItem('test_key', 'test_val');
  let val = await storage.getItem('test_key');
  if (val !== 'test_val') throw new Error('Storage set/get failed');

  setActiveChild({ id: 'child-123', name: 'Child A', access_key: 'KEY123' });
  let child = await getActiveChild();
  if (child?.access_key !== 'KEY123') throw new Error('Active child caching failed');

  await authService.logout();

  val = await storage.getItem('test_key');
  child = await getActiveChild();

  if (val !== null || child !== null) {
    throw new Error('Logout failed to completely clear storage or active child session');
  }
  console.log('✅ 1. Logging out clears all local caches completely: PASSED');

  // 2. Verify supabaseRest automatically filters queries using access_key
  setActiveChild({ id: 'child-123', name: 'Child A', access_key: 'KEY123' });
  await supabaseRest('videos', { status: 'eq.active' });

  if (!lastUrl.includes('access_key=eq.KEY123')) {
    throw new Error(`supabaseRest failed to automatically filter query by access_key. URL: ${lastUrl}`);
  }
  console.log('✅ 2. supabaseRest automatically appends access_key to queries: PASSED');

  console.log('\nAll Tenant Isolation Verification Tests PASSED successfully!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
