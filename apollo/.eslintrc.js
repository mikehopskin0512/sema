require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['sema/base'],
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'prefer-arrow-callback': ['error', { allowUnboundThis: true }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'webpack.config.js',
          '.eslintrc.js',
          '**/*.test.js',
          'scripts/generate-test-seed',
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
