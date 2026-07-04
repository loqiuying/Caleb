const rateLimit = require('express-rate-limit');

// 速率限制：每分钟最多 30 个请求
const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 分钟
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: '请求过于频繁，请稍后再试',
    retryAfter: 60,
  },
  handler: (req, res) => {
    res.status(429).json({
      error: '请求过于频繁，请稍后再试',
      retryAfter: 60,
    });
  },
});

module.exports = rateLimiter;
