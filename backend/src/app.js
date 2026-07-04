const express = require('express');
const corsMiddleware = require('./middleware/cors');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// 中间件注册顺序很重要
app.use(corsMiddleware);          // CORS 处理
app.use(express.json());          // JSON body 解析（限制大小防止过大请求）
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);             // 速率限制

// 健康检查根路由
app.get('/', (req, res) => {
  res.json({
    name: 'AI Chat Assistant API',
    version: '1.0.0',
    status: 'running',
  });
});

// API 路由
app.use('/api', routes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在', path: req.path });
});

// 全局错误处理（必须最后注册）
app.use(errorHandler);

module.exports = app;
