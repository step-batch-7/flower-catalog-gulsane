const { env } = require('process');

const config = {
  DATA_STORE: env.DATA_STORE
};

module.exports = { config };
