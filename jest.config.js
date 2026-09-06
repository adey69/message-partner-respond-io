module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/jest/svgMock.tsx',
    // Test-only helpers, kept out of the app's own alias table.
    '^@test/(.*)$': '<rootDir>/jest/$1',
  },
  // React Navigation and the native modules under it ship untranspiled ESM, so
  // they must be transformed rather than ignored like the rest of node_modules.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community|-async-storage)?|@react-navigation|react-native-.*)/)',
  ],
};
