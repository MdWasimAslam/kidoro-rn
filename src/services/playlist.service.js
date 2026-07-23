const { supabaseRest } = require('./api');

const playlistService = {
  getPlaylists: async () => {
    try {
      return await supabaseRest('playlists', {
        select: '*, playlist_videos(*, videos(*))',
        order: 'created_at.desc',
      });
    } catch (e) {
      return [];
    }
  },
};

module.exports = playlistService;
