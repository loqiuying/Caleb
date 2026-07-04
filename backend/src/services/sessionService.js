const supabase = require('../config/supabase');

/**
 * 会话服务 - 封装会话表的 CRUD 操作
 * 表结构假设：
 * - id (uuid, 主键)
 * - title (text)
 * - last_summary_at (timestamptz, 可空)
 * - is_deleted (boolean, 软删除标记, 默认 false)
 * - created_at (timestamptz)
 * - updated_at (timestamptz)
 */

/**
 * 获取会话列表（分页，排除已软删除）
 * @param {number} page - 页码，从 1 开始
 * @param {number} limit - 每页条数
 * @returns {Promise<{data: Array, total: number}>} 会话列表和总数
 */
async function list(page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const [listResult, countResult] = await Promise.all([
    supabase
      .from('sessions')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1),
    supabase
      .from('sessions')
      .select('id', { count: 'exact', head: true })
      .eq('is_deleted', false),
  ]);

  if (listResult.error) throw listResult.error;
  if (countResult.error) throw countResult.error;

  return {
    data: listResult.data,
    total: countResult.count || 0,
    page,
    limit,
  };
}

/**
 * 创建新会话
 * @param {string} [title] - 会话标题，可选
 * @returns {Promise<object>} 创建的会话
 */
async function create(title) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ title: title || '新对话' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 根据 ID 获取会话
 * @param {string} id - 会话 ID
 * @returns {Promise<object|null>} 会话对象，不存在返回 null
 */
async function getById(id) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * 更新会话标题
 * @param {string} id - 会话 ID
 * @param {string} title - 新标题
 * @returns {Promise<object>} 更新后的会话
 */
async function update(id, title) {
  const { data, error } = await supabase
    .from('sessions')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 软删除会话（设置 is_deleted = true）
 * @param {string} id - 会话 ID
 * @returns {Promise<object>} 更新后的会话
 */
async function softDelete(id) {
  const { data, error } = await supabase
    .from('sessions')
    .update({ is_deleted: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 更新最后摘要时间
 * @param {string} id - 会话 ID
 * @returns {Promise<void>}
 */
async function updateLastSummaryAt(id) {
  const { error } = await supabase
    .from('sessions')
    .update({ last_summary_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

module.exports = {
  list,
  create,
  getById,
  update,
  softDelete,
  updateLastSummaryAt,
};
