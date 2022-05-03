require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['sema/react'],
  parserOptions: {
    babelOptions: { presets: [['react-app', false]] },
  },
  globals: {
    chrome: 'readonly',
  },
};
