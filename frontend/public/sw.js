// Service Worker：缓存静态资源，API 请求走网络
const CACHE_NAME = 'ai-chat-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// 安装：预缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((err) => console.warn('SW 预缓存失败:', err))
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

// 请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API 请求与 SSE 流式请求：始终走网络
  if (
    url.pathname.startsWith('/api') ||
    request.headers.get('accept')?.includes('text/event-stream')
  ) {
    return;
  }

  // 仅处理 GET 请求
  if (request.method !== 'GET') {
    return;
  }

  // 静态资源：缓存优先，网络回退
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request)
        .then((response) => {
          // 缓存成功的响应（同源请求）
          if (response && response.status === 200 && url.origin === self.location.origin) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // 离线时返回首页（SPA 回退）
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('离线状态', { status: 503 });
        });
    })
  );
});
