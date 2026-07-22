let seedData = [];
try { seedData = require('./videodata.json') || []; } catch (e) { seedData = []; }
if (!Array.isArray(seedData)) seedData = [];

const VIDEO_URLS = [
  'https://vjs.zencdn.net/v/oceans.mp4',
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
];

const FALLBACK_TITLES = [
  'Amazing Sharks', 'Solar System Fun', 'ABC Learning', 'Kids Math Magic',
  'Dinosaurs Discovery', 'Space Adventure', 'Wild Animals Safari', 'Ocean Life Wonders',
  'Science Experiments', 'Learn Colors Rainbow', 'Counting 1 to 100', 'Animal Sounds',
  'Planet Earth Adventure', 'Water Cycle', 'Human Body for Kids', 'Phonics Song',
  'Alphabet Adventure', 'Shapes Around Us', 'Fruit Names', 'Weather Wonders',
  'Sea Creatures', 'Jungle Exploration', 'Desert Animals', 'Arctic Animals',
  'Farm Animals', 'Butterfly Life Cycle', 'Moon Landing', 'Stars and Constellations',
  'Rocket Science', 'International Space Station', 'Mars Exploration', 'Ancient Egypt',
  'Medieval Knights', 'Pirate Adventure', 'Rainforest Discovery', 'Volcano Explosion',
  'Dinosaur Fossils', 'Ocean Giants',
];

const FALLBACK_CATS = [
  'Animals','Learning','Learning','Math','Dinosaurs','Space','Animals','Animals',
  'Science','Learning','Math','Animals','Nature','Science','Science','Learning',
  'Learning','Learning','Learning','Nature','Animals','Animals','Animals','Animals',
  'Animals','Nature','Space','Space','Science','Space','Space','Stories',
  'Stories','Stories','Nature','Science','Dinosaurs','Animals',
];

const COLORS_HEX = ['FF4D4D','4DA8FF','5CD65C','8B5CF6','FFD93D','FF6B6B','48D1CC','FF8C00'];

function parseISOtoDisplay(dur) {
  let total = 0;
  const m = dur.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (m) {
    if (m[1]) total += parseInt(m[1]) * 3600;
    if (m[2]) total += parseInt(m[2]) * 60;
    if (m[3]) total += parseInt(m[3]);
  }
  if (!total && dur.includes(':')) return dur;
  if (total >= 3600) return `${Math.floor(total / 3600)}:${String(Math.floor((total % 3600) / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildVideos() {
  const list = [];

  seedData.forEach((v, i) => {
    const cat = v.category || 'Learning';
    list.push({
      id: `vid_${i + 1}`,
      title: v.title || 'Untitled',
      thumbnail: v.thumbnail || '',
      videoUrl: v.url || VIDEO_URLS[i % VIDEO_URLS.length],
      youtubeId: v.id || `seed_${i}`,
      duration: v.duration ? parseISOtoDisplay(v.duration) : '3:00',
      views: v.views || [1200, 5400, 8200, 15000, 28000, 45000, 67000, 89000, 120000, 250000, 500000, 1000000][i % 12],
      category: cat,
      favorite: i < 3,
      channel: v.channel || 'Kidoro Kids',
      channelAvatar: v.id ? `https://i.ytimg.com/vi/${v.id}/default.jpg` : 'https://placehold.co/100x100/FF4D4D/FFFFFF?text=K',
      description: v.title ? `Watch "${v.title}" - a fun ${cat.toLowerCase()} video for kids from ${v.channel || 'Kidoro'}.` : 'A fun video for kids.',
      progress: i < 3 ? Math.floor(Math.random() * 80) + 10 : 0,
      liked: i < 2,
      date: v.publishedAt ? new Date(v.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '22 Jul 2026',
    });
  });

  FALLBACK_TITLES.forEach((title, i) => {
    const idx = seedData.length + i;
    list.push({
      id: `vid_${idx + 1}`,
      title,
      thumbnail: `https://placehold.co/400x225/${COLORS_HEX[i % COLORS_HEX.length]}/FFFFFF?text=${encodeURIComponent(title.substring(0, 12))}`,
      videoUrl: VIDEO_URLS[i % VIDEO_URLS.length],
      youtubeId: `fallback_${idx}`,
      duration: `${Math.floor(Math.random() * 12) + 3}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      views: [1200, 5400, 8200, 15000, 28000, 45000, 67000, 89000, 120000, 250000, 500000, 1000000][Math.floor(Math.random() * 12)],
      category: FALLBACK_CATS[i % FALLBACK_CATS.length],
      favorite: false,
      channel: 'Kidoro Kids',
      channelAvatar: `https://placehold.co/100x100/FF4D4D/FFFFFF?text=K`,
      description: `Join us on an exciting ${FALLBACK_CATS[i % FALLBACK_CATS.length].toLowerCase()} adventure! ${title} is a fun and educational video for kids.`,
      progress: 0,
      liked: false,
      date: `${Math.floor(Math.random() * 28) + 1} Jul 2026`,
    });
  });

  return shuffle(list);
}

const videos = buildVideos();

export { videos };

export const getVideosByCategory = (category) => {
  if (!category || category === 'All') return videos;
  return videos.filter(v => v.category === category);
};

export const getFavoriteVideos = () => videos.filter(v => v.favorite);

export const getContinueWatching = () => videos.filter(v => v.progress > 0 && v.progress < 100);

export const getTrendingVideos = () => [...videos].sort((a, b) => b.views - a.views).slice(0, 10);

export const getRecommendedVideos = () => [...videos].sort(() => Math.random() - 0.5).slice(0, 10);

export const getRecentlyAdded = () => [...videos].reverse().slice(0, 10);

export const getSearchResults = (query) => {
  if (!query) return [];
  const q = query.toLowerCase();
  return videos.filter(v =>
    v.title.toLowerCase().includes(q) ||
    v.category.toLowerCase().includes(q) ||
    v.description.toLowerCase().includes(q) ||
    v.channel.toLowerCase().includes(q)
  );
};
