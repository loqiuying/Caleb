# AI 聊天助手 - 分步部署指南

> 本指南按照教程顺序，一步步带你完成从代码部署到 PWA 安装的全流程。
> 技术栈：React + Vite (Vercel) / Node.js + Express (Render) / Supabase / DeepSeek
> UI 风格：Material Design

---

## 准备工作清单

在开始之前，请确认你已有以下账号：

| 平台 | 用途 | 你的账号 |
|------|------|---------|
| GitHub | 代码托管 | ✅ |
| Vercel | 前端部署 | ✅ |
| Render | 后端部署 | ✅ |
| Supabase | 数据库 | ✅ |

还需要：
- **DeepSeek API Key**：去 https://platform.deepseek.com 注册并创建 API Key
- **Node.js**：本地已安装（用于测试）

---

## 第 1 步：创建 GitHub 仓库并推送代码

### 1.1 在 GitHub 上创建仓库

1. 打开 https://github.com/new
2. Repository name 填 `ai-chat-assistant`
3. 选择 **Private**（私人仓库）
4. **不要**勾选 "Add a README file"
5. 点 **Create repository**

### 1.2 本地推送代码

将项目代码下载到本地，然后在项目根目录执行：

```bash
cd ai-chat-assistant

# 初始化 Git
git init
git add .
git commit -m "初始化 AI 聊天助手项目"

# 关联远程仓库（替换成你的地址）
git remote add origin https://github.com/你的用户名/ai-chat-assistant.git
git branch -M main
git push -u origin main
```

---

## 第 2 步：创建 Supabase 数据库

### 2.1 创建项目

1. 打开 https://supabase.com → 登录
2. 点 **New Project**
3. 填写项目名称（如 `ai-chat`）
4. 设置数据库密码（**记下来**）
5. 选择区域：Southeast Asia (Singapore) 或 US East
6. 点 **Create new project**，等待 1-2 分钟

### 2.2 执行建表 SQL

1. 进入项目后，点左侧 **SQL Editor**
2. 点 **New query**
3. 将 `database/schema.sql` 文件的**全部内容**粘贴进去
4. 点 **Run** 执行
5. 看到绿色 "Success" 说明建表成功

### 2.3 记录关键信息

进入 **Settings → API**，记下以下信息：

| 信息 | 说明 | 示例 |
|------|------|------|
| **Project URL** | Supabase 项目地址 | `https://xxx.supabase.co` |
| **service_role key** | 服务端密钥（绕过 RLS） | `eyJhbGciOi...`（很长的字符串） |

> ⚠️ **不要用 anon key，必须用 service_role key**，否则后端无法读写数据库。

---

## 第 3 步：部署后端到 Render

### 3.1 创建 Web Service

1. 打开 https://dashboard.render.com → 登录
2. 点 **New +** → **Web Service**
3. 连接你的 GitHub 仓库 `ai-chat-assistant`
4. 填写配置：

| 配置项 | 值 |
|--------|-----|
| Name | `ai-chat-backend` |
| Region | Singapore 或 Oregon |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `node src/server.js` |
| Instance Type | Free |

5. 点 **Create Web Service**

### 3.2 配置环境变量

在 Render 的 **Environment** 页面，添加以下环境变量：

| Key | Value |
|-----|-------|
| `DEEPSEEK_API_KEY` | 你的 DeepSeek API Key（`sk-xxx`） |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com/v1` |
| `DEEPSEEK_MODEL` | `deepseek-chat` |
| `SUPABASE_URL` | 你的 Supabase Project URL |
| `SUPABASE_SERVICE_KEY` | 你的 Supabase service_role key |
| `CORS_ORIGIN` | `https://你的前端域名.vercel.app`（第 4 步部署完前端后回来填） |
| `MEMORY_TOKEN_THRESHOLD` | `4000` |
| `MEMORY_MESSAGE_THRESHOLD` | `20` |
| `KEEP_RECENT_MESSAGES` | `6` |

> CORS_ORIGIN 先留空或填 `*`，等前端部署完再更新。

### 3.3 验证后端

部署完成后，Render 会给你一个地址，如 `https://ai-chat-backend.onrender.com`。

在浏览器中访问：
```
https://ai-chat-backend.onrender.com/api/health
```

如果返回 `{"status":"ok"}`，说明后端部署成功！

> ⚠️ Render 免费版首次启动可能需要 30-60 秒"冷启动"，耐心等待。

---

## 第 4 步：部署前端到 Vercel

### 4.1 导入项目

1. 打开 https://vercel.com → 登录
2. 点 **Add New** → **Project**
3. 导入你的 GitHub 仓库 `ai-chat-assistant`

### 4.2 配置部署

| 配置项 | 值 |
|--------|-----|
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 4.3 配置环境变量

在 **Environment Variables** 中添加：

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://你的后端地址.onrender.com/api` |

例如：`https://ai-chat-backend.onrender.com/api`

### 4.4 部署

点 **Deploy**，等待 1-2 分钟。

部署完成后会得到一个地址，如 `https://ai-chat-assistant.vercel.app`。

### 4.5 回填 CORS_ORIGIN

**重要！** 拿到前端地址后，回到 Render 后端的环境变量：

1. 将 `CORS_ORIGIN` 更新为你的 Vercel 前端地址
2. 如 `https://ai-chat-assistant.vercel.app`
3. Render 会自动重新部署后端

---

## 第 5 步：连通测试

### 5.1 基础验证

1. 打开你的前端地址：`https://ai-chat-assistant.vercel.app`
2. 应该看到 Material Design 风格的欢迎界面
3. 点"开始新对话"创建一个会话

### 5.2 发送消息测试

1. 在输入框输入"你好"
2. 按 Enter 发送
3. 应该看到 AI 逐字流式回复
4. 回复支持 Markdown 格式和代码高亮

### 5.3 会话管理测试

1. 创建多个会话
2. 在会话之间切换
3. 刷新页面，历史消息应该保留
4. 尝试删除会话

### 5.4 记忆压缩测试

1. 在同一个会话中发送超过 20 条消息
2. 后端会自动触发记忆压缩
3. 在 Supabase 的 Table Editor 中查看 `memory_summaries` 表，应该有压缩记录

---

## 第 6 步：PWA 安装到手机

### 6.1 准备图标

在 `frontend/public/icons/` 目录下放入两个图标文件：

- `icon-192.png`（192×192 像素）
- `icon-512.png`（512×512 像素）

> 可以用 https://maskable.app/editor 或任何图标工具生成。

### 6.2 推送更新

```bash
git add .
git commit -m "添加 PWA 图标"
git push
```

Vercel 会自动重新部署。

### 6.3 安装到手机

1. 用手机浏览器打开你的前端地址
2. 在浏览器菜单中选择 **"添加到主屏幕"**
3. 确认安装
4. 桌面上会出现 AI 助手图标
5. 点击图标打开，是全屏 standalone 模式，像原生 App 一样

---

## 环境变量总览

### 后端（Render）

| 变量 | 说明 | 必填 |
|------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | ✅ |
| `DEEPSEEK_BASE_URL` | DeepSeek API 地址 | ✅ |
| `DEEPSEEK_MODEL` | 模型名称 | ✅ |
| `SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `SUPABASE_SERVICE_KEY` | Supabase service_role key | ✅ |
| `CORS_ORIGIN` | 前端域名（用于 CORS） | ✅ |
| `MEMORY_TOKEN_THRESHOLD` | 记忆压缩 token 阈值 | 可选（默认 4000） |
| `MEMORY_MESSAGE_THRESHOLD` | 记忆压缩消息数阈值 | 可选（默认 20） |
| `KEEP_RECENT_MESSAGES` | 压缩时保留近期消息数 | 可选（默认 6） |

### 前端（Vercel）

| 变量 | 说明 | 必填 |
|------|------|------|
| `VITE_API_BASE_URL` | 后端 API 地址 | ✅ |

---

## 常见问题

### Q1: 前端打开白屏
- 检查 Vercel 部署日志是否有构建错误
- 确认 `VITE_API_BASE_URL` 配置正确

### Q2: 发消息没有回复
- 检查后端 Render 日志
- 确认 `DEEPSEEK_API_KEY` 和 `SUPABASE_SERVICE_KEY` 配置正确
- 确认 `CORS_ORIGIN` 已更新为前端地址

### Q3: CORS 错误
- 后端 `CORS_ORIGIN` 必须与前端地址完全匹配（包括 https://）
- 暂时可以用 `*` 测试（不推荐生产环境）

### Q4: Render 免费版休眠
- Render 免费版 15 分钟无请求会休眠
- 首次请求需要 30-60 秒唤醒
- 如需常驻，升级到付费版

### Q5: Supabase 连接失败
- 确认使用的是 `service_role key` 而非 `anon key`
- 确认 `SUPABASE_URL` 格式为 `https://xxx.supabase.co`

---

## 项目架构图

```
┌─────────────────────────────────────────────┐
│  前端 (Vercel)                              │
│  React + MUI + Zustand                      │
│  ↓ SSE 流式接收                             │
├─────────────────────────────────────────────┤
│  后端 (Render)                              │
│  Express + DeepSeek API + 记忆压缩          │
│  ↓ SQL                                      │
├─────────────────────────────────────────────┤
│  Supabase (PostgreSQL)                      │
│  sessions / messages / memory_summaries     │
├─────────────────────────────────────────────┤
│  DeepSeek API                               │
│  主对话 (流式) + 记忆压缩 (非流式)           │
└─────────────────────────────────────────────┘
```
