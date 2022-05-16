process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  extends: ['airbnb-base', 'prettier'],
  parser: '@babel/eslint-parser',
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-use-before-define': 'off',
    'no-return-await': 'off',
    'func-names': ['error', 'as-needed'],
    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['utils/**/*.js', 'webpack.config.js', '.eslintrc.js'],
      },
    ],
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'camelcase': [
      'error',
      {
        allow: ['repo_id', 'pull_number', 'clone_url'],
        ignoreDestructuring: true,
        properties: 'never',
      },
    ],
  },
};
