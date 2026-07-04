const { createClient } = require('@supabase/supabase-js');
const config = require('./index');

// 校验必需的环境变量
if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_KEY) {
  throw new Error('SUPABASE_URL 和 SUPABASE_SERVICE_KEY 必须在环境变量中配置');
}

// 创建 Supabase 客户端，使用 service_role key（绕过 RLS）
const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

module.exports = supabase;
