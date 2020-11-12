module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  env: {
    browser: true,
  },
  rules: {
    "no-console": "off",
  },
};
