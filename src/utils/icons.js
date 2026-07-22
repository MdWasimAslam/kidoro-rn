const ICON_MAP = {
  Smile: 'emoticon-happy-outline',
  Music: 'music',
  Rocket: 'rocket-launch-outline',
  Languages: 'translate',
  FlaskConical: 'flask',
  Calculator: 'calculator',
  Dog: 'dog',
  BookOpen: 'book-open-page-variant-outline',
};

function normalizeIcon(dbIcon) {
  if (!dbIcon) return 'folder-outline';
  if (ICON_MAP[dbIcon]) return ICON_MAP[dbIcon];
  const kebab = dbIcon.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
  return kebab || 'folder-outline';
}

module.exports = { normalizeIcon };
