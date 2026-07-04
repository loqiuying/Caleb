const sessionService = require('../services/sessionService');
const messageService = require('../services/messageService');

/**
 * 会话控制器 - 处理会话相关的 HTTP 请求
 */

/**
 * 获取会话列表
 * GET /api/sessions?page=1&limit=20
 */
async function list(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await sessionService.list(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * 创建新会话
 * POST /api/sessions
 * body: { title?: string }
 */
async function create(req, res, next) {
  try {
    const { title } = req.body || {};
    const session = await sessionService.create(title);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
}

/**
 * 获取单个会话详情
 * GET /api/sessions/:id
 */
async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const session = await sessionService.getById(id);
    if (!session) {
      return res.status(404).json({ error: '会话不存在' });
    }
    res.json(session);
  } catch (err) {
    next(err);
  }
}

/**
 * 更新会话标题
 * PUT /api/sessions/:id
 * body: { title: string }
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'title 为必填项' });
    }
    const session = await sessionService.update(id, title);
    res.json(session);
  } catch (err) {
    next(err);
  }
}

/**
 * 软删除会话
 * DELETE /api/sessions/:id
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await sessionService.softDelete(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * 获取会话的消息列表
 * GET /api/sessions/:id/messages?limit=50&beforeSeq=123
 */
async function getMessages(req, res, next) {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit, 10) || 50;
    const beforeSeq = req.query.beforeSeq ? parseInt(req.query.beforeSeq, 10) : null;

    // 先校验会话是否存在
    const session = await sessionService.getById(id);
    if (!session) {
      return res.status(404).json({ error: '会话不存在' });
    }

    const messages = await messageService.getBySession(id, limit, beforeSeq);
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  create,
  getById,
  update,
  remove,
  getMessages,
};
