/**
 * 简单的 token 估算函数
 * 中文约 1.5 字/token，英文约 0.75 词/token
 * @param {string} text - 待估算的文本
 * @returns {number} 估算的 token 数
 */
function estimateTokens(text) {
  if (!text) return 0;

  const str = String(text);

  // 统计中文字符数（CJK 统一表意文字范围）
  const chineseChars = (str.match(/[\u4e00-\u9fff]/g) || []).length;

  // 统计英文单词数（非中文字符序列）
  const nonChinese = str.replace(/[\u4e00-\u9fff]/g, ' ');
  const englishWords = (nonChinese.match(/[a-zA-Z]+/g) || []).length;

  // 中文约 1.5 字/token，英文约 0.75 词/token
  const chineseTokens = chineseChars / 1.5;
  const englishTokens = englishWords / 0.75;

  // 向上取整，保证不低估
  return Math.ceil(chineseTokens + englishTokens);
}

module.exports = { estimateTokens };
