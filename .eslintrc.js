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
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-undef': 'error',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'dist-ios/', '*.config.js'],
};
