# AI 聊天助手

> 基于 React + Express + Supabase + DeepSeek 的个人 AI 聊天助手，Material Design 风格，支持 PWA。

## 技术栈

| 组件 | 技术 | 部署平台 |
|------|------|---------|
| 前端 | React + Vite + MUI v5 + Zustand | Vercel |
| 后端 | Node.js + Express | Render |
| 数据库 | PostgreSQL | Supabase |
| AI 模型 | DeepSeek（对话 + 记忆压缩） | DeepSeek API |

## 核心功能

- 多会话管理（创建、切换、重命名、删除）
- 消息持久化（Supabase 存储）
- 流式回复（SSE 逐字显示）
- 记忆压缩（超阈值自动总结历史对话）
- Markdown 渲染 + 代码高亮
- PWA 支持（添加到手机主屏幕）
- Material Design 风格

## 项目结构

```
ai-chat-assistant/
├── frontend/          # 前端 React + Vite
├── backend/           # 后端 Node.js + Express
├── database/          # Supabase 建表 SQL
├── DEPLOYMENT.md      # 分步部署指南
└── README.md
```

## 快速开始

### 1. 数据库
在 Supabase SQL Editor 执行 `database/schema.sql`

### 2. 后端
```bash
cd backend
npm install
cp .env.example .env  # 填入环境变量
npm run dev
```

### 3. 前端
```bash
cd frontend
npm install
cp .env.example .env  # 填入后端 API 地址
npm run dev
```

## 部署

详见 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 环境变量

### 后端
| 变量 | 说明 |
|------|------|
| DEEPSEEK_API_KEY | DeepSeek API 密钥 |
| SUPABASE_URL | Supabase 项目 URL |
| SUPABASE_SERVICE_KEY | Supabase service_role key |
| CORS_ORIGIN | 前端域名 |

### 前端
| 变量 | 说明 |
|------|------|
| VITE_API_BASE_URL | 后端 API 地址 |
