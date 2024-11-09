module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parserOptions: {
    sourceType: "module",
    parser: "babel-eslint",
    ecmaVersion: 13,
  },
  plugins: [],
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-props-no-spreading": "off",
    "no-undef": "error",
    "react-hooks/exhaustive-deps": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "no-unused-vars": "error",
  },
  parser: "@typescript-eslint/parser",
  settings: {
    react: {
      version: "detect",
    },
  },
};
