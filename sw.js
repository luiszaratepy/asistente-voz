const CACHE = 'asistente-v0.1.1'; 
const ASSETS = [
  '/asistente-voz/',
  '/asistente-voz/index.html',
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
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))\
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('groq.com')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});