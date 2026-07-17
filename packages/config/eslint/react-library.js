const baseConfig = require('./index.js');

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};