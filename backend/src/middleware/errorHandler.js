/**
 * 全局错误处理中间件
 * 必须放在所有路由之后，且参数数量必须为 4（err, req, res, next）
 */
function errorHandler(err, req, res, next) {
  console.error('未处理的错误:', err);

  // Supabase / Postgres 错误
  if (err.code) {
    // 常见 Postgres 错误码
    if (err.code === '23505') {
      return res.status(409).json({ error: '资源已存在', detail: err.message });
    }
    if (err.code === '23503') {
      return res.status(400).json({ error: '关联资源不存在', detail: err.message });
    }
    if (err.code === 'PGRST116' || err.code === '42P01') {
      return res.status(500).json({ error: '数据库表结构异常', detail: err.message });
    }
  }

  // OpenAI / DeepSeek API 错误
  if (err.status && err.error) {
    return res.status(err.status).json({
      error: 'AI 服务调用失败',
      detail: err.error.message || err.message,
    });
  }

  // 默认 500 错误
  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误',
  });
}

module.exports = errorHandler;
