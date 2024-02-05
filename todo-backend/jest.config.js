module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "src/.*\\.spec\\.ts$",
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
};
