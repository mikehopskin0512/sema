require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['sema/base'],
  overrides: [
    {
      files: ['**/*.test.js', 'test/**/*.js'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended']
    }
  ]
};
