const supabase = require('../config/supabase');

/**
 * 消息服务 - 封装消息表的 CRUD 操作
 * 表结构假设：
 * - id (uuid, 主键)
 * - session_id (uuid, 外键)
 * - role (text: user/assistant/system)
 * - content (text)
 * - token_count (int)
 * - seq (int, 会话内自增序号)
 * - created_at (timestamptz)
 */

/**
 * 创建一条消息
 * @param {string} sessionId - 会话 ID
 * @param {string} role - 角色 (user/assistant/system)
 * @param {string} content - 消息内容
 * @param {number} tokenCount - token 数
 * @param {number} seq - 序号
 * @returns {Promise<object>} 创建的消息记录
 */
async function create(sessionId, role, content, tokenCount, seq) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      session_id: sessionId,
      role,
      content,
      token_count: tokenCount,
      seq,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 获取会话的消息列表（支持分页）
 * @param {string} sessionId - 会话 ID
 * @param {number} limit - 限制条数，默认 50
 * @param {number} [beforeSeq] - 返回 seq 小于此值的消息（用于向上翻页）
 * @returns {Promise<Array>} 消息数组
 */
async function getBySession(sessionId, limit = 50, beforeSeq) {
  let query = supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('seq', { ascending: true })
    .limit(limit);

  if (beforeSeq) {
    query = query.lt('seq', beforeSeq);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * 获取下一条消息的 seq（当前最大 seq + 1）
 * @param {string} sessionId - 会话 ID
 * @returns {Promise<number>} 下一个 seq
 */
async function getNextSeq(sessionId) {
  const { data, error } = await supabase
    .from('messages')
    .select('seq')
    .eq('session_id', sessionId)
    .order('seq', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  // 如果没有消息，从 1 开始；否则最大 seq + 1
  return data ? data.seq + 1 : 1;
}

/**
 * 获取未压缩的消息（从指定 seq 开始）
 * @param {string} sessionId - 会话 ID
 * @param {number} fromSeq - 起始 seq（包含）
 * @returns {Promise<Array>} 消息数组
 */
async function getUnsummarizedMessages(sessionId, fromSeq) {
  let query = supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('seq', { ascending: true });

  // fromSeq 为 null/0 时获取所有消息
  if (fromSeq && fromSeq > 0) {
    query = query.gte('seq', fromSeq);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

module.exports = {
  create,
  getBySession,
  getNextSeq,
  getUnsummarizedMessages,
};
