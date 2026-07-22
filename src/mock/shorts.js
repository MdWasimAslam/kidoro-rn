const SHORT_SEEDS = [
  { id: 'XqZsoesa55w', title: 'Baby Shark Dance Clip', ch: 'Pinkfong', cat: 'Nursery Rhymes', likes: 850000 },
  { id: 'e_04ZrNroTo', title: 'Wheels on the Bus Clip', ch: 'Cocomelon', cat: 'Nursery Rhymes', likes: 720000 },
  { id: '7t099KIWVVs', title: 'Planet Song Short', ch: 'Kids Learning Tube', cat: 'Science', likes: 340000 },
  { id: 'YA7bxAVIEr8', title: 'Draw a Zebra Quick', ch: 'Art for Kids Hub', cat: 'Drawing', likes: 180000 },
  { id: 'KATSNWWHEIU', title: 'Bear Hunt Yoga', ch: 'Cosmic Kids', cat: 'Exercise', likes: 250000 },
  { id: 'vD-ZwMjRDPU', title: 'Water Cycle Quick', ch: 'SciShow Kids', cat: 'Science', likes: 120000 },
  { id: 'DosnJpMoasM', title: 'Blippi Bus Ride', ch: 'Blippi', cat: 'Educational', likes: 310000 },
  { id: 'aqUefNVhsNM', title: 'ABC with Elmo', ch: 'Sesame Street', cat: 'Learning', likes: 420000 },
  { id: 'xIOzCOslJcM', title: 'Letter S Short', ch: 'Netflix Jr.', cat: 'Reading', likes: 98000 },
  { id: 'xMnRsuw4ZBk', title: 'Sink or Float', ch: 'Khan Academy', cat: 'Science', likes: 145000 },
  { id: '5WyB03nyCaI', title: 'Peppa Summer Clip', ch: 'Peppa Pig', cat: 'Stories', likes: 510000 },
  { id: 'wk4KHNJjpjQ', title: 'Twinkle Star Short', ch: 'Super Simple', cat: 'Nursery Rhymes', likes: 440000 },
];

const FALLBACK_TITLES = [
  'Animal Fun Facts', 'ABC Song', 'Counting Stars', 'Color Adventure',
  'Dino Roar', 'Space Dance', 'Ocean Dance', 'Fruit Party',
  'Shape Shifter', 'Number Jump', 'Letter Sounds', 'Solar System',
  'Baby Shark Remix', 'Wheels on the Bus', 'Old MacDonald',
  'Twinkle Star', 'Bubble Pop', 'Rainbow Magic', 'Toddler Dance',
  'Animal Parade', 'Funny Faces', 'Silly Songs', 'Learn to Draw',
  'Paint Party', 'Music Time', 'Dance Along', 'Yoga for Kids',
  'Exercise Fun', 'Bedtime Story', 'Morning Routine', 'Brush Your Teeth',
  'Wash Your Hands', 'Healthy Eating', 'Vegetable Song', 'Fruit Smoothie',
  'Playground Fun', 'Park Adventure', 'Rainy Day Fun', 'Puzzle Time',
  'Memory Game', 'Hide and Seek', 'Peekaboo Fun', 'Finger Family',
  'Itsy Bitsy Spider', 'Humpty Dumpty', 'London Bridge', 'Alphabet Soup',
  'Number Train', 'Shape Sorter', 'Color Hunt',
];

const FALLBACK_CATS = [
  'Animals','Learning','Math','Learning','Dinosaurs','Space','Animals','Learning',
  'Learning','Math','Learning','Space','Nursery Rhymes','Nursery Rhymes','Nursery Rhymes',
  'Stories','Learning','Learning','Animals','Animals','Nursery Rhymes','Nursery Rhymes',
  'Drawing','Learning','Learning','Exercise','Exercise','Exercise','Stories','Learning',
  'Learning','Learning','Educational','Educational','Exercise','Nature','Nature','Learning',
  'Learning','Learning','Nursery Rhymes','Nursery Rhymes','Nursery Rhymes','Nursery Rhymes',
  'Nursery Rhymes','Learning','Math','Learning','Animals',
];

const SHORT_VIDEOS = [
  'https://vjs.zencdn.net/v/oceans.mp4',
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
];

const COLORS = ['FF4D4D','4DA8FF','5CD65C','8B5CF6','FFD93D','FF6B6B','48D1CC','FF8C00'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildShorts() {
  const list = [];

  SHORT_SEEDS.forEach((s, i) => {
    list.push({
      id: `short_${i + 1}`,
      title: s.title,
      thumbnail: `https://i.ytimg.com/vi/${s.id}/hqdefault.jpg`,
      videoUrl: SHORT_VIDEOS[i % SHORT_VIDEOS.length],
      youtubeId: s.id,
      views: Math.floor(s.likes * (Math.random() * 2 + 1)),
      likes: s.likes,
      category: s.cat,
      channel: s.ch,
      channelAvatar: `https://i.ytimg.com/vi/${s.id}/default.jpg`,
      description: `${s.title} - fun short from ${s.ch}!`,
      liked: false,
      saved: false,
      music: 'Fun Beats - Kidoro',
    });
  });

  FALLBACK_TITLES.forEach((title, i) => {
    const idx = SHORT_SEEDS.length + i;
    const color = COLORS[idx % COLORS.length];
    list.push({
      id: `short_${idx + 1}`,
      title,
      thumbnail: `https://placehold.co/400x712/${color}/FFFFFF?text=${encodeURIComponent(title.substring(0, 12))}`,
      videoUrl: SHORT_VIDEOS[idx % SHORT_VIDEOS.length],
      youtubeId: null,
      views: Math.floor(Math.random() * 500000) + 1000,
      likes: Math.floor(Math.random() * 50000) + 100,
      category: FALLBACK_CATS[i % FALLBACK_CATS.length],
      channel: 'Kidoro Shorts',
      channelAvatar: 'https://placehold.co/100x100/FFD93D/121212?text=KS',
      description: `${title} - A fun short video for kids!`,
      liked: false,
      saved: false,
      music: 'Fun Beats - Kidoro',
    });
  });

  return shuffle(list);
}

const shorts = buildShorts();

export { shorts };

export const getShortsPage = (page, pageSize = 5) => {
  const start = page * pageSize;
  const end = start + pageSize;
  return shorts.slice(start, end);
};
