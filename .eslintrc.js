module.exports = {
  root: true,
  parser: 'espree',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-console': 'warn',
    'no-undef': 'error',
    'no-duplicate-imports': 'warn',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'dist-ios/', '*.config.js', 'src/'],
};
