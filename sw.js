const CACHE = 'asistente-v1.6.2';
const ASSETS = [
  '/asistente-voz/icon-192.png',
  '/asistente-voz/icon-512.png',
  '/asistente-voz/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('groq.com')) return;
  if (e.request.url.includes('googleapis.com')) return; // nueva
  if (e.request.url.includes('openrouter.ai')) return; // y esta por las dudas
  if (e.request.url.includes('index.html') || e.request.url.endsWith('/asistente-voz/')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
