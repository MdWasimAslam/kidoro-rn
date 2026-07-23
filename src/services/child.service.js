const { supabaseRest, setActiveChild } = require('./api');
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
      return [];
    }
  },

  verifyAccessCode: async (pin) => {
    try {
      const results = await supabaseRest('children', {
        select: '*',
        access_code: `eq.${pin}`,
        status: 'eq.active',
        deleted_at: 'is.null',
      });

      if (Array.isArray(results) && results.length > 0) {
        const child = results[0];
        // Cache in memory AND persist to storage (belt-and-suspenders)
        setActiveChild(child);
        return { success: true, child };
      }

      return { success: false, error: 'Invalid PIN code' };
    } catch (e) {

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
      setActiveChild(childObj);
      return true;
    } catch (e) {
      return false;
    }
  },
};

module.exports = childService;
