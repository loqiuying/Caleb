const cors = require('cors');
const config = require('../config/index');

// CORS 配置，允许指定来源
const corsOptions = {
  origin: config.CORS_ORIGIN === '*' ? true : config.CORS_ORIGIN.split(',').map((s) => s.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false,
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
