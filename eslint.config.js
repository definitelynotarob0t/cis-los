module.exports = [
  {
    files: ["**/*.{js,ts,tsx}"],
    ignores: ["node_modules/", "dist/", "build/", "fonts/", "images/"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"), // Correct parser import
      ecmaVersion: 2020,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "indent": ["error", "tab"],
      "no-console": "error",

    },
  },
  {
    files: ["los-frontend/**/*.ts", "los-frontend/**/*.tsx"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly"
      }
    },
  },
  {
    files: ["los-backend/**/*.ts"],
    languageOptions: {
      globals: {
        require: "readonly",
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        exports: "readonly"
      }
    },
  },
];
