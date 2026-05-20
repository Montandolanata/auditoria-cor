# Auditoría Cor Outsourcing — App móvil

PWA (Progressive Web App) para realizar la auditoría operativa y de rentabilidad en el Hotel Puerta de Bilbao directamente desde el móvil. Funciona offline, guarda las auditorías en el propio dispositivo y exporta el informe en PDF con el formato de Cor Outsourcing.

## Contenido de la carpeta

- `index.html` — pantalla principal de la app
- `app.js` — lógica (checklist, IndexedDB, firma, PDF)
- `manifest.webmanifest` — metadatos para instalación como app
- `sw.js` — service worker (modo offline)
- `icon-192.png` / `icon-512.png` / `icon.svg` — iconos

## Cómo desplegarla (3 opciones)

### Opción 1 — La más rápida: GitHub Pages (gratis, 5 min)
1. Crear un repositorio en GitHub.
2. Subir todos los archivos de la carpeta `app/`.
3. Settings → Pages → activar desde la rama principal.
4. URL resultante: `https://USUARIO.github.io/REPO/`.
5. Abrir esa URL desde el móvil de María José.

### Opción 2 — Netlify Drop (sin cuenta, sin Git)
1. Entrar en https://app.netlify.com/drop
2. Arrastrar la carpeta `app/` entera.
3. Te dan una URL del tipo `https://nombre-aleatorio.netlify.app`.
4. Abrir desde el móvil.

### Opción 3 — Sin internet, vía WiFi local
1. En el PC ejecutar: `python -m http.server 8000` dentro de la carpeta `app/`.
2. En el móvil, conectado a la misma WiFi: abrir `http://IP-DEL-PC:8000`.

> ⚠️ Para que el service worker y la instalación funcionen, **debe servirse por HTTPS** (Opciones 1 y 2) o desde `localhost`. Por HTTP plano la app funciona, pero no será instalable.

## Instalar la app en el móvil de María José

### Android (Chrome)
1. Abrir la URL.
2. Menú (⋮) → **"Instalar aplicación"** o **"Añadir a pantalla de inicio"**.
3. Aparecerá un icono "Auditoría Cor" en el escritorio igual que una app normal.
4. A partir de ahí, abrir desde el icono — funciona sin internet.

### iPhone (Safari)
1. Abrir la URL.
2. Botón **Compartir** (cuadradito con flecha) → **"Añadir a pantalla de inicio"**.

## Cómo usarla durante la auditoría

1. **Acceso Seguro**: Introduce el PIN de 4 dígitos en la pantalla de bloqueo táctil (el PIN por defecto es **`2026`**). La sesión expira de forma segura a las 12 horas o al cerrar la pestaña del navegador.
2. **Nueva auditoría**: La fecha y la hora de inicio se rellenan solas al pulsar "Nueva auditoría". Comprueba el nombre del hotel y rellena las habitaciones revisadas.
3. **Recorrer los 3 bloques** del checklist marcando SÍ / NO / N/A en cada ítem.
4. Para los **NO**, escribe la observación y pulsa **+** para hacer una foto como evidencia (se reduce y comprime localmente de forma automática). **Puedes pulsar sobre cualquier miniatura de foto** para ampliarla a pantalla completa en el visor interactivo y descargarla directamente a tu dispositivo con el botón `↓`.
5. **Plan de acción**: Campo grande al final para anotaciones libres y puntos de mejora detectados.
6. **Firma digital** con el dedo.
7. **Autoguardado en Tiempo Real**: La aplicación guarda automáticamente todos tus cambios en el propio dispositivo. Las marcas, fotos y firmas se guardan inmediatamente; los textos libres se guardan tras 1 segundo de inactividad de forma transparente (puedes ver el indicador `✓ Borrador guardado` parpadear en la cabecera). Si cierras la pestaña por error, podrás continuar desde el **Histórico**.
8. **Resumen**: Muestra el % de conformidad y lista de incidencias detectadas.
9. **Generar PDF**: Descarga el informe en formato oficial de Cor Outsourcing, listo para imprimir, enviar por WhatsApp o email.

## Privacidad y Almacenamiento Local

Todos los datos (incluidas las fotos de alta resolución) se guardan **únicamente en el dispositivo** de la auditora, dentro de la base de datos local del navegador (IndexedDB). Ningún dato se transmite a servidores externos, garantizando una privacidad absoluta y funcionamiento 100% offline.

## Próximas mejoras posibles

- Convertir la PWA en APK firmada (con PWABuilder).
- Sincronización entre dispositivos (requiere backend).
- Comparativa entre auditorías y gráficos de evolución mensual.
- Exportar a Excel además de PDF.
