const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias['@shared'] = path.join(__dirname, 'shared');
    return config;
  },
};
