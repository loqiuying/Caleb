// API 基础配置
// 通过环境变量 VITE_API_BASE_URL 配置后端地址，默认走代理（/api）
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api';

// 通用请求封装
export async function request(path, options = {}) {
  const url = path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const message = await response.text().catch(() => '请求失败');
    throw new Error(`HTTP ${response.status}: ${message}`);
  }

  // 健康检查等可能返回纯文本
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}
