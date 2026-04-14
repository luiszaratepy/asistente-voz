const CACHE = 'asistente-v3';
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
  // API de Groq siempre va a la red
  if (e.request.url.includes('groq.com')) return;
  // index.html siempre desde la red (nunca desde cache)
  if (e.request.url.includes('index.html') || e.request.url.endsWith('/asistente-voz/')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // El resto desde cache con fallback a red
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
