const sessionService = require('../services/sessionService');
const messageService = require('../services/messageService');
const contextService = require('../services/contextService');
const memoryService = require('../services/memoryService');
const deepseekService = require('../services/deepseekService');
const { estimateTokens } = require('../utils/tokenCounter');

/**
 * 聊天控制器 - 处理聊天请求，使用 SSE 流式返回
 */

/**
 * 聊天接口
 * POST /api/chat
 * body: { sessionId: string, message: string }
 * 响应：SSE 流
 *   event: token
 *   data: {"content":"xxx"}
 *
 *   event: done
 *   data: {"messageId":"xxx","content":"完整回复"}
 *
 *   event: error
 *   data: {"message":"错误信息"}
 */
async function chat(req, res, next) {
  const { sessionId, message } = req.body || {};

  // 1. 校验请求参数
  if (!sessionId || !message || typeof message !== 'string') {
    return res.status(400).json({ error: 'sessionId 和 message 为必填项' });
  }

  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // SSE 错误发送辅助函数
  const sendError = (msg) => {
    res.write(`event: error\ndata: ${JSON.stringify({ message: msg })}\n\n`);
    res.end();
  };

  try {
    // 校验会话存在
    const session = await sessionService.getById(sessionId);
    if (!session) {
      return sendError('会话不存在');
    }

    // 2. 保存用户消息
    const userSeq = await messageService.getNextSeq(sessionId);
    const userTokenCount = estimateTokens(message);
    await messageService.create(sessionId, 'user', message, userTokenCount, userSeq);

    // 3. 组装上下文
    const { messages } = await contextService.assembleContext(sessionId);

    // 4. 检查是否需要压缩记忆（发送前同步检查一次）
    try {
      await memoryService.compressIfNeeded(sessionId);
      // 压缩后重新组装上下文
      const refreshed = await contextService.assembleContext(sessionId);
      messages.length = 0;
      messages.push(...refreshed.messages);
    } catch (compressErr) {
      // 压缩失败不阻断主流程，记录错误继续对话
      console.error('记忆压缩失败（不阻断）:', compressErr.message);
    }

    // 5. 调用 DeepSeek 流式 API，逐 token 通过 SSE 返回
    let fullReply = '';

    await new Promise((resolve) => {
      deepseekService.chatStream(
        messages,
        // onToken: 逐 token 发送
        (token) => {
          fullReply += token;
          res.write(`event: token\ndata: ${JSON.stringify({ content: token })}\n\n`);
        },
        // onDone: 流结束
        async () => {
          resolve();
        },
        // onError: 流式调用出错
        (err) => {
          console.error('DeepSeek 流式调用失败:', err.message);
          resolve();
        }
      );
    });

    if (!fullReply) {
      return sendError('AI 未返回有效内容');
    }

    // 7. 保存 AI 回复
    const aiSeq = await messageService.getNextSeq(sessionId);
    const aiTokenCount = estimateTokens(fullReply);
    const savedMsg = await messageService.create(
      sessionId,
      'assistant',
      fullReply,
      aiTokenCount,
      aiSeq
    );

    // 8. 异步检查压缩（不阻塞响应）
    memoryService.compressIfNeeded(sessionId).catch((err) => {
      console.error('异步记忆压缩失败:', err.message);
    });

    // 9. 发送 done 事件
    res.write(
      `event: done\ndata: ${JSON.stringify({
        messageId: savedMsg.id,
        content: fullReply,
      })}\n\n`
    );
    res.end();
  } catch (err) {
    console.error('聊天处理失败:', err);
    sendError(err.message || '服务器内部错误');
  }
}

module.exports = {
  chat,
};
