module.exports = {
  printWidth: 100,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "all",
  semi: false,
  overrides: [
    {
      files: ["*.yml", "*.yaml"],
      options: {
        singleQuote: false,
      },
    },
  ],
};
