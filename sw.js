/* Service Worker — Auditoría Cor Outsourcing
   ------------------------------------------------------------------
   Estrategia híbrida:
   - stale-while-revalidate para los archivos "vivos" de la app
     (HTML, JS y manifest). El usuario ve la versión cacheada al
     instante y, en paralelo, descargamos la nueva en segundo plano.
     Así nunca se queda atascado en una versión vieja sin enterarse.
   - cache-first para los assets que casi nunca cambian (iconos,
     librerías de terceros con versión fija como jsPDF). Ahorra red.
   ------------------------------------------------------------------
   NOTA sobre el banner de "versión nueva disponible":
   La detección de versión nueva la lleva app.js (ver
   checkForVersionUpdate). Compara la versión del index.html servido
   por la red con la del DOM cargado. Esto desacopla el banner del
   ciclo de vida del Service Worker, así que basta con cambiar la
   versión en UN solo sitio (el footer de index.html) — no hace falta
   tocar sw.js en cada release.

   sw.js solo es responsable de cachear los assets y de servir contenido
   offline. El nombre de la caché va atado a APP_VERSION; la cambiamos
   solo cuando hay un cambio en el propio sw.js (por ejemplo, nuevos
   assets a cachear o cambios en la estrategia).
   ------------------------------------------------------------------ */
const APP_VERSION = 'v1.4.1';
const CACHE = 'cor-audit-' + APP_VERSION;

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
  // El cliente puede preguntar qué versión está activa para detectar
  // actualizaciones que se le hayan podido escapar (red de seguridad).
  if (e.data && e.data.type === 'GET_VERSION') {
    if (e.source) {
      e.source.postMessage({ type: 'VERSION', version: APP_VERSION });
    }
  }
  // Vaciar las cachés de assets "vivos" (HTML, JS, manifest) para
  // forzar que la próxima carga los baje de red. Se usa cuando el
  // cliente detecta versión nueva y pulsa "Recargar".
  if (e.data && e.data.type === 'CLEAR_LIVE_CACHE') {
    e.waitUntil(
      caches.open(CACHE).then(cache => {
        return Promise.all(LIVE_ASSETS.map(url => cache.delete(url)));
      })
    );
  }
});
