const express = require('express');
const router = express.Router();

const sessionRoutes = require('./sessionRoutes');
const chatRoutes = require('./chatRoutes');

// 聚合所有路由
router.use('/sessions', sessionRoutes);
router.use('/chat', chatRoutes);

// 健康检查
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
