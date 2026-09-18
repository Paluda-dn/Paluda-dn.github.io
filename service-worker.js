const NOM_CACHE = 'piano-abel-v1';
const FICHIERS_A_METTRE_EN_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(NOM_CACHE).then((cache) => cache.addAll(FICHIERS_A_METTRE_EN_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((noms) =>
      Promise.all(noms.filter((n) => n !== NOM_CACHE).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((reponse) => reponse || fetch(event.request))
  );
});
