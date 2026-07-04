import { request } from './api.js';

// 会话相关 API 调用
export const sessionService = {
  // 获取会话列表
  async list(page = 1, limit = 20) {
    return request(`/sessions?page=${page}&limit=${limit}`);
  },

  // 创建会话
  async create(title) {
    const body = title ? { title } : {};
    return request('/sessions', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // 获取会话详情
  async get(id) {
    return request(`/sessions/${id}`);
  },

  // 更新会话（重命名）
  async update(id, title) {
    return request(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    });
  },

  // 删除会话
  async delete(id) {
    return request(`/sessions/${id}`, {
      method: 'DELETE',
    });
  },

  // 获取会话历史消息
  async getMessages(id, limit = 50) {
    return request(`/sessions/${id}/messages?limit=${limit}`);
  },
};
