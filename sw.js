import { CACHE_NAME } from './src/config.js';
import { assetsToCache } from './src/asset_list.js';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('キャッシュを開きました。アセットを個別にキャッシュしています。');
      const promises = assetsToCache.map((url) => {
        return cache.add(url).catch(err => {
          console.error(`${url} のキャッシュに失敗しました:`, err);
        });
      });
      return Promise.all(promises);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
