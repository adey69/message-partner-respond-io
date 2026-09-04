module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/jest/svgMock.tsx',
  },
  // React Navigation and the native modules under it ship untranspiled ESM, so
  // they must be transformed rather than ignored like the rest of node_modules.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-.*)/)',
  ],
};
