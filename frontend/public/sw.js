// Service Worker：网络优先（保证拿到最新版本），网络失败回退缓存
// 升级 CACHE_NAME 会触发 activate 清理旧缓存，修复旧版本被缓存的问题
const CACHE_NAME = 'caleb-v2-20260705';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// 安装：预缓存静态资源，跳过等待立即激活
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((err) => console.warn('SW 预缓存失败:', err))
  );
  self.skipWaiting();
});

// 激活：清理所有旧缓存（关键：升级 CACHE_NAME 后清掉 ai-chat-v1）
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // 删除 ai-chat-v1 等旧缓存
          }
          return null;
        })
      )
    )
  );
  self.clients.claim(); // 立即接管所有页面
});

// 请求拦截：网络优先，失败回退缓存
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API 与 SSE 流式请求：始终走网络
  if (
    url.pathname.startsWith('/api') ||
    request.headers.get('accept')?.includes('text/event-stream')
  ) {
    return;
  }

  if (request.method !== 'GET') return;

  // 网络优先：先尝试网络，失败才用缓存
  event.respondWith(
    fetch(request)
      .then((response) => {
        // 缓存成功的同源响应
        if (response && response.status === 200 && url.origin === self.location.origin) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败：回退缓存
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // 离线导航请求返回首页
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('离线状态', { status: 503 });
        });
      })
  );
});
