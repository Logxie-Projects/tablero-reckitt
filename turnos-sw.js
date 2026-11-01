// App de turnos de conductores: guarda la página para abrirla sin señal (los viajes los guarda la página en el celular)
const CACHE = 'turnos-v2', ARCHIVOS = ['turnos.html', 'turnos.webmanifest', 'turnos-icono.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
// la página siempre se pide a la red primero (para tener la versión nueva) y, sin señal, sale de la copia guardada
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
    .catch(() => caches.match(e.request)));
});
