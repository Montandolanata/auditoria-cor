/* Service Worker — Auditoría Cor Outsourcing
   ------------------------------------------------------------------
   Estrategia híbrida:
   - stale-while-revalidate para los archivos "vivos" de la app
     (HTML, JS y manifest). El usuario ve la versión cacheada al
     instante y, en paralelo, descargamos la nueva en segundo plano.
     Así nunca se queda atascado en una versión vieja sin enterarse.
   - cache-first para los assets que casi nunca cambian (iconos,
     librerías de terceros con versión fija como jsPDF). Ahorra red.
   ------------------------------------------------------------------ */
const CACHE = 'cor-audit-v7';

// Archivos "vivos": estrategia stale-while-revalidate.
const LIVE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.webmanifest'
];

// Archivos "fijos": estrategia cache-first.
// Desde la v1.3 jsPDF se sirve desde el propio repo (./vendor/) en lugar
// del CDN cdnjs.cloudflare.com. Esto hace la app totalmente autocontenida.
const STATIC_ASSETS = [
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './vendor/jspdf.umd.min.js'
];

const ALL_ASSETS = [...LIVE_ASSETS, ...STATIC_ASSETS];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ALL_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        // Avisar a las pestañas abiertas de que hay una versión nueva activa.
        return self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
        });
      })
  );
});

// Detecta si una URL es un asset "vivo" (con o sin trailing slash en raíz).
function isLive(url) {
  const path = new URL(url).pathname;
  return path.endsWith('/index.html')
      || path.endsWith('/app.js')
      || path.endsWith('/manifest.webmanifest')
      || path === '/' || path.endsWith('/');
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Ignorar peticiones a esquemas no http (chrome-extension, etc.)
  if (!req.url.startsWith('http')) return;

  if (isLive(req.url)) {
    // STALE-WHILE-REVALIDATE: devolver cache si existe, refrescar siempre en paralelo.
    e.respondWith(
      caches.open(CACHE).then(cache => {
        return cache.match(req).then(cached => {
          const networkFetch = fetch(req).then(res => {
            // Solo cachear respuestas OK.
            if (res && res.status === 200) {
              try { cache.put(req, res.clone()); } catch (_) {}
            }
            return res;
          }).catch(() => cached); // Si no hay red, nos quedamos con la caché.
          return cached || networkFetch;
        });
      })
    );
    return;
  }

  // CACHE-FIRST para el resto.
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => { try { c.put(req, copy); } catch (_) {} });
        }
        return res;
      }).catch(() => cached);
    })
  );
});

// Permitir que la app fuerce skipWaiting desde el cliente
// (lo usamos cuando el usuario pulsa "Recargar" en el aviso de versión nueva).
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
