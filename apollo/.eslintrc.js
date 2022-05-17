require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['sema/base'],
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'webpack.config.js',
          '.eslintrc.js',
          '**/*.test.js',
          'test/**/*.js',
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.js', 'test/**/*.js'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
    },
  ],
};
