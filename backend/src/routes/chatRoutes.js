const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// 聊天路由 - SSE 流式响应
router.post('/', chatController.chat);  // POST /api/chat

module.exports = router;
