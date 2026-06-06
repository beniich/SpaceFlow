module.exports = {
  root: true,
  env: { node: true, es2020: true },
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
  },
};
