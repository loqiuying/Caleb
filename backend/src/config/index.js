// 加载环境变量
require('dotenv').config();

// 导出所有配置项，提供默认值
module.exports = {
  // 服务端口
  PORT: process.env.PORT || 3000,

  // DeepSeek 配置（兼容 OpenAI SDK）
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
  DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL || 'deepseek-chat',

  // Supabase 配置
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

  // CORS 允许的来源
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

  // 记忆压缩相关阈值
  MEMORY_TOKEN_THRESHOLD: parseInt(process.env.MEMORY_TOKEN_THRESHOLD, 10) || 4000,
  MEMORY_MESSAGE_THRESHOLD: parseInt(process.env.MEMORY_MESSAGE_THRESHOLD, 10) || 20,
  KEEP_RECENT_MESSAGES: parseInt(process.env.KEEP_RECENT_MESSAGES, 10) || 6,
};
