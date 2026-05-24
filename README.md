# Auditoría Cor Outsourcing — App móvil

PWA (Progressive Web App) para realizar la auditoría operativa y de rentabilidad de Cor Outsourcing directamente desde el móvil. Funciona offline, guarda las auditorías en el propio dispositivo y exporta el informe en PDF con el formato oficial.

## Características

- Checklist completo en 3 bloques (Rentabilidad y Costes, PRL, Gestión de Equipos)
- Funciona 100% offline tras la primera carga
- Almacenamiento local (IndexedDB), ningún dato sale del dispositivo
- Fotos como evidencia, comprimidas automáticamente
- Firma digital con el dedo
- Exportación a PDF con el formato de Cor Outsourcing
- Copias de seguridad en JSON (importar/exportar)
- Protegida con PIN de 4 dígitos (PBKDF2-SHA256, configurable por la usuaria)
- Detección automática de versiones nuevas

## Documentación

Para instrucciones de instalación, despliegue y uso, ver [`COMO_USAR.md`](COMO_USAR.md).

## Tecnología

Solo HTML, CSS y JavaScript vanilla. Sin frameworks, sin build, sin backend. Una única dependencia externa: [jsPDF](https://github.com/parallax/jsPDF) cargado desde CDN.

## Estructura

- `index.html` — pantalla principal
- `app.js` — lógica (checklist, IndexedDB, firma, PDF, autenticación)
- `sw.js` — service worker (estrategia híbrida: stale-while-revalidate + cache-first)
- `manifest.webmanifest` — metadatos para instalación como PWA
- `icon-*.png` / `icon.svg` — iconos
- `robots.txt` — exclusión de buscadores (app de uso interno)

## Uso interno

Esta aplicación es de uso interno de Cor Outsourcing. No está pensada para distribución pública.
