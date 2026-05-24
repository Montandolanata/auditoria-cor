# Auditoría Cor Outsourcing — App móvil

PWA (Progressive Web App) para realizar la auditoría operativa y de rentabilidad de Cor Outsourcing directamente desde el móvil. Funciona offline, guarda las auditorías en el propio dispositivo y exporta el informe en PDF con el formato oficial.

## Contenido de la carpeta

- `index.html` — pantalla principal de la app
- `app.js` — lógica (checklist, IndexedDB, firma, PDF, autenticación)
- `manifest.webmanifest` — metadatos para instalación como app
- `sw.js` — service worker (modo offline + auto-actualización)
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

## Primer arranque: crear el PIN

La primera vez que se abre la app, te pedirá **crear un PIN de 4 dígitos** (con confirmación). Ese PIN solo lo conoce María José: se guarda cifrado en el propio dispositivo (PBKDF2-SHA256 con 250 000 iteraciones) y no se transmite a ningún servidor.

- Si olvidas el PIN, pulsa **"¿Olvidaste tu PIN?"** en la pantalla de bloqueo. Podrás crear uno nuevo y **las auditorías guardadas no se pierden**.
- Para cambiar el PIN sin haberlo olvidado, ve a "Cómo instalar y usar" → **"Cambiar PIN"**.

> Esta es una pantalla de bloqueo personal para evitar que alguien que coja prestado el móvil vea las auditorías. No protege frente a un atacante con acceso técnico al dispositivo; para eso, mantén también el código de desbloqueo del propio móvil.

## Cómo usarla durante la auditoría

1. **Desbloquear**: Introduce tu PIN. La sesión expira a las 12 horas o al cerrar la pestaña.
2. **Nueva auditoría**: La fecha y la hora de inicio se rellenan solas al pulsar "Nueva auditoría". Selecciona el hotel y rellena las habitaciones revisadas.
3. **Recorrer los 3 bloques** del checklist marcando SÍ / NO / N/A en cada ítem.
4. Para los **NO**, escribe la observación y pulsa **+** para hacer una foto como evidencia (se reduce y comprime localmente de forma automática). **Puedes pulsar sobre cualquier miniatura de foto** para ampliarla a pantalla completa en el visor interactivo y descargarla directamente a tu dispositivo con el botón `↓`.
5. **Plan de acción**: Campo grande al final para anotaciones libres y puntos de mejora detectados.
6. **Firma digital** con el dedo.
7. **Autoguardado en Tiempo Real**: La aplicación guarda automáticamente todos tus cambios en el propio dispositivo. Las marcas, fotos y firmas se guardan inmediatamente; los textos libres se guardan tras 1 segundo de inactividad de forma transparente (puedes ver el indicador `✓ Borrador guardado` parpadear en la cabecera). Si cierras la pestaña por error, podrás continuar desde el **Histórico**.
8. **Resumen**: Muestra el % de conformidad y lista de incidencias detectadas.
9. **Generar PDF**: Descarga el informe en formato oficial de Cor Outsourcing, listo para imprimir, enviar por WhatsApp o email.

## Privacidad y almacenamiento local

Todos los datos (incluidas las fotos de alta resolución) se guardan **únicamente en el dispositivo** de la auditora, dentro de la base de datos local del navegador (IndexedDB). Ningún dato se transmite a servidores externos, garantizando una privacidad absoluta y funcionamiento 100% offline.

### Indicador de espacio

En la pantalla del **Histórico** verás un indicador con el espacio usado por la app (`X MB de Y MB`). Cuando se acerque al 85% aparecerá en rojo. **Si llega al 100%**:

- La app muestra un aviso claro al intentar guardar.
- **Exporta una copia de seguridad** (botón "📤 Exportar backup") antes de borrar nada.
- Borra las auditorías antiguas que ya tengas en PDF para liberar espacio.

La app también solicita "almacenamiento persistente" al sistema para que el navegador no purgue los datos automáticamente si la app pasa mucho tiempo sin abrirse.

## Actualizaciones automáticas

La app detecta cuando hay una versión nueva publicada. Verás un banner verde en la parte superior con un botón **"Recargar"**. Pulsándolo cargas la versión nueva sin perder datos. Si no quieres actualizar en ese momento, basta con ignorarlo.

## Próximas mejoras posibles

- Convertir la PWA en APK firmada (con PWABuilder).
- Sincronización entre dispositivos (requiere backend).
- Comparativa entre auditorías y gráficos de evolución mensual.
- Exportar a Excel además de PDF.
