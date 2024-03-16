module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  coverageReporters: ['lcov', 'html'],
  setupFilesAfterEnv: ['./src/test/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', './dist', './dist-post-ts'],
  // add other ES deps to exclude pattern if they cause trouble
  transformIgnorePatterns: ['/node_modules/(?!nanoid)'],
  testTimeout: 10000, // 10 seconds.
};
