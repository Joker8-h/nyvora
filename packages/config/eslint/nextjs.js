const baseConfig = require('./index.js');

module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    'plugin:@next/next/recommended',
  ],
  rules: {
    ...baseConfig.rules,
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-img-element': 'off',
  },
};