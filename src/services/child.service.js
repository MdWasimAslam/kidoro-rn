const { supabaseRest } = require('./api');
const storage = require('../utils/storage');
const { CHILD_KEY } = require('./api');

const childService = {
  getChildren: async () => {
    try {
      // Contract: GET /children table where status = active and deleted_at is null
      return await supabaseRest('children', {
        select: '*',
        status: 'eq.active',
        deleted_at: 'is.null',
        order: 'created_at.asc',
      });
    } catch (e) {
      console.error('[childService.getChildren] Error:', e.message);
      return [];
    }
  },

  verifyAccessCode: async (pin) => {
    try {
      const results = await supabaseRest('children', {
        select: '*',
        access_code: `eq.${pin}`,
      });

      console.log('[verifyAccessCode] pin:', pin, 'results:', JSON.stringify(results));

      if (Array.isArray(results) && results.length > 0) {
        const child = results[0];
        console.log('[verifyAccessCode] matched child:', JSON.stringify(child));
        try {
          await storage.setItem(CHILD_KEY, JSON.stringify(child));
        } catch (storageErr) {
          console.warn('[verifyAccessCode] storage.setItem failed:', storageErr.message);
        }
        return { success: true, child };
      }

      console.log('[verifyAccessCode] no match found');
      return { success: false, error: 'Invalid PIN code' };
    } catch (e) {
      console.error('[childService.verifyAccessCode] Error:', e.message);

      try {
        const storedChild = await storage.getItem(CHILD_KEY);
        if (storedChild) {
          const childObj = JSON.parse(storedChild);
          if (!childObj.access_code || childObj.access_code === pin) {
            return { success: true, child: childObj, offline: true };
          }
        }
      } catch (storageErr) { /* ignore */ }

      return { success: false, error: 'Network request failed. Please check backend connection.' };
    }
  },

  selectChild: async (childObj) => {
    try {
      await storage.setItem(CHILD_KEY, JSON.stringify(childObj));
      return true;
    } catch (e) {
      console.error('[childService.selectChild] Error:', e.message);
      return false;
    }
  },
};

module.exports = childService;
