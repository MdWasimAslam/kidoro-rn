module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFiles: ['./src/__tests__/mockSetup.js'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js', '!**/node_modules/**', '!src/**/mockSetup.js'],
  coverageReporters: ['html', 'text', 'lcov'],
};
