const NOM_CACHE = 'piano-abel-v2';
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

// Réseau en priorité : on va toujours chercher la dernière version en ligne.
// Le cache ne sert que de secours si l'appareil est hors-ligne.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((reponse) => {
        const copie = reponse.clone();
        caches.open(NOM_CACHE).then((cache) => cache.put(event.request, copie));
        return reponse;
      })
      .catch(() => caches.match(event.request))
  );
});
