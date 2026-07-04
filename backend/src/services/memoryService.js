const supabase = require('../config/supabase');
const config = require('../config/index');
const messageService = require('./messageService');
const sessionService = require('./sessionService');
const { getLatestSummary } = require('./contextService');
const deepseekService = require('./deepseekService');
const { COMPRESS_PROMPT } = require('../utils/prompts');
const { estimateTokens } = require('../utils/tokenCounter');

/**
 * 记忆服务 - 当对话历史过长时自动压缩为摘要
 * 阈值由环境变量配置：
 * - MEMORY_TOKEN_THRESHOLD: token 数阈值
 * - MEMORY_MESSAGE_THRESHOLD: 消息数阈值
 * - KEEP_RECENT_MESSAGES: 保留最近的消息条数
 */

/**
 * 检查并执行记忆压缩（如果需要）
 * 流程：
 *  a. 获取最后一条 summary 的 to_message_seq
 *  b. 统计未压缩消息的 token 和数量
 *  c. 超阈值则压缩：保留最近 N 条，其余调用 DeepSeek 生成摘要
 *  d. 保存到 memory_summaries 表
 *  e. 更新 session.last_summary_at
 * @param {string} sessionId - 会话 ID
 * @returns {Promise<boolean>} 是否执行了压缩
 */
async function compressIfNeeded(sessionId) {
  // a. 获取最后一条摘要
  const latestSummary = await getLatestSummary(sessionId);
  const fromSeq = latestSummary ? latestSummary.to_message_seq + 1 : 1;

  // b. 获取所有未压缩的消息
  const messages = await messageService.getUnsummarizedMessages(sessionId, fromSeq);

  if (messages.length === 0) return false;

  // 统计 token 和数量
  let totalTokens = 0;
  for (const msg of messages) {
    totalTokens += msg.token_count || estimateTokens(msg.content);
  }

  // c. 判断是否超过阈值（任一阈值超限即触发）
  const exceedTokens = totalTokens >= config.MEMORY_TOKEN_THRESHOLD;
  const exceedMessages = messages.length >= config.MEMORY_MESSAGE_THRESHOLD;

  if (!exceedTokens && !exceedMessages) {
    return false;
  }

  // 保留最近 N 条消息不压缩
  const keepCount = config.KEEP_RECENT_MESSAGES;
  if (messages.length <= keepCount) {
    // 消息数量不足，无法压缩
    return false;
  }

  // 分割：待压缩消息 + 保留消息
  const toCompress = messages.slice(0, messages.length - keepCount);
  const toKeep = messages.slice(messages.length - keepCount);

  // 待压缩消息的 seq 范围
  const fromMessageSeq = toCompress[0].seq;
  const toMessageSeq = toCompress[toCompress.length - 1].seq;

  // d. 调用 DeepSeek 生成摘要
  const compressMessages = [
    { role: 'system', content: COMPRESS_PROMPT },
  ];

  // 把待压缩的对话拼接为 user 消息
  const conversationText = toCompress
    .map((m) => `${m.role === 'user' ? '用户' : '助手'}：${m.content}`)
    .join('\n\n');

  compressMessages.push({ role: 'user', content: conversationText });

  const summaryText = await deepseekService.chat(compressMessages);

  // e. 保存摘要到 memory_summaries 表
  const { error: insertError } = await supabase
    .from('memory_summaries')
    .insert({
      session_id: sessionId,
      summary: summaryText,
      from_message_seq: fromMessageSeq,
      to_message_seq: toMessageSeq,
    });

  if (insertError) throw insertError;

  // f. 更新 session.last_summary_at
  await sessionService.updateLastSummaryAt(sessionId);

  return true;
}

module.exports = {
  compressIfNeeded,
};
