const supabase = require('../config/supabase');
const messageService = require('./messageService');
const { SYSTEM_PROMPT } = require('../utils/prompts');
const { estimateTokens } = require('../utils/tokenCounter');

/**
 * 上下文服务 - 组装发送给 AI 的上下文消息
 * 表结构假设（memory_summaries）：
 * - id (uuid, 主键)
 * - session_id (uuid, 外键)
 * - summary (text, 摘要内容)
 * - from_message_seq (int)
 * - to_message_seq (int)
 * - created_at (timestamptz)
 */

/**
 * 获取会话最新的记忆摘要
 * @param {string} sessionId - 会话 ID
 * @returns {Promise<object|null>} 最新摘要记录
 */
async function getLatestSummary(sessionId) {
  const { data, error } = await supabase
    .from('memory_summaries')
    .select('*')
    .eq('session_id', sessionId)
    .order('to_message_seq', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * 组装发送给 AI 的上下文
 * 流程：
 *  a. 获取最新 memory_summary
 *  b. 获取 summary.to_message_seq 之后的近期消息
 *  c. 构建 messages 数组：[system prompt, summary (如有), recent messages]
 *  d. 返回 { messages, totalTokens }
 * @param {string} sessionId - 会话 ID
 * @returns {Promise<{messages: Array, totalTokens: number}>}
 */
async function assembleContext(sessionId) {
  // a. 获取最新记忆摘要
  const latestSummary = await getLatestSummary(sessionId);

  // b. 确定起始 seq：摘要之后的消息
  const fromSeq = latestSummary ? latestSummary.to_message_seq + 1 : 1;

  // 获取未压缩的近期消息
  const recentMessages = await messageService.getUnsummarizedMessages(sessionId, fromSeq);

  // c. 构建 messages 数组
  const messages = [];

  // 系统提示词
  messages.push({ role: 'system', content: SYSTEM_PROMPT });

  // 如果有摘要，作为系统上下文注入
  if (latestSummary && latestSummary.summary) {
    messages.push({
      role: 'system',
      content: `以下是之前对话的摘要，请参考这些上下文继续对话：\n\n${latestSummary.summary}`,
    });
  }

  // 近期消息（按 seq 升序）
  for (const msg of recentMessages) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  // d. 估算总 token 数
  let totalTokens = 0;
  for (const m of messages) {
    totalTokens += estimateTokens(m.content);
  }

  return { messages, totalTokens };
}

module.exports = {
  assembleContext,
  getLatestSummary,
};
