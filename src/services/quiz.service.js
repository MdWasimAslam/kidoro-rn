const { supabaseRest } = require('./api');

const quizService = {
  getQuizzes: async (limit = 20) => {
    try {
      const data = await supabaseRest('quizzes', {
        select: '*',
        status: 'eq.active',
        limit: limit.toString(),
      });
      return Array.isArray(data) ? data : [];
    } catch (e) {
      // quizzes table does not exist in this Supabase project
      return [];
    }
  },
};

module.exports = quizService;
