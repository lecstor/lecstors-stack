module.exports = {
  moduleDirectories: ["node_modules", "test"],
  coveragePathIgnorePatterns: ["node_modules", "test"],
  setupFilesAfterEnv: ["./test/setup.ts"],
  testRegex: "(/(\\.|/)(test))\\.[jt]sx?$"
};
