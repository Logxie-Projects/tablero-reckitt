// App de turnos de conductores: guarda la página para abrirla sin señal (los viajes los guarda la página en el celular)
// v4 (7-nov): estilo nuevo con fuentes incluidas; se guardan con la página para que la app se vea igual sin señal
// v5 (8-nov): también Mi viaje (conductor.html), que abre sin señal con lo último que guardó del viaje
const CACHE = 'turnos-v5', ARCHIVOS = ['turnos.html', 'conductor.html', 'turnos.webmanifest', 'turnos-icono.svg', 'conductores.css',
  'fuentes/plus-jakarta-sans-latin-400-normal.woff2', 'fuentes/plus-jakarta-sans-latin-600-normal.woff2', 'fuentes/plus-jakarta-sans-latin-700-normal.woff2',
  'fuentes/plus-jakarta-sans-latin-800-normal.woff2', 'fuentes/jetbrains-mono-latin-500-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
// la página siempre se pide a la red primero (para tener la versión nueva) y, sin señal, sale de la copia guardada
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));   // el enlace trae ?t=CÓDIGO: sirve la misma página
});
