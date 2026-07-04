const OpenAI = require('openai');
const config = require('../config/index');

// 校验 API Key
if (!config.DEEPSEEK_API_KEY) {
  throw new Error('DEEPSEEK_API_KEY 必须在环境变量中配置');
}

// 创建 OpenAI 兼容客户端，指向 DeepSeek API
const client = new OpenAI({
  apiKey: config.DEEPSEEK_API_KEY,
  baseURL: config.DEEPSEEK_BASE_URL,
});

/**
 * 流式调用 DeepSeek 聊天接口
 * @param {Array} messages - 消息数组 [{role, content}]
 * @param {function} onToken - 收到 token 时的回调 (tokenText) => void
 * @param {function} onDone - 流结束回调 (fullText) => void
 * @param {function} onError - 错误回调 (err) => void
 */
async function chatStream(messages, onToken, onDone, onError) {
  try {
    const stream = await client.chat.completions.create({
      model: config.DEEPSEEK_MODEL,
      messages,
      stream: true,
    });

    let fullText = '';

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content || '';
      if (delta) {
        fullText += delta;
        if (onToken) onToken(delta);
      }
    }

    if (onDone) onDone(fullText);
  } catch (err) {
    if (onError) onError(err);
  }
}

/**
 * 非流式调用 DeepSeek 聊天接口
 * @param {Array} messages - 消息数组 [{role, content}]
 * @returns {Promise<string>} 完整回复内容
 */
async function chat(messages) {
  const response = await client.chat.completions.create({
    model: config.DEEPSEEK_MODEL,
    messages,
    stream: false,
  });

  return response.choices?.[0]?.message?.content || '';
}

module.exports = {
  chatStream,
  chat,
};
