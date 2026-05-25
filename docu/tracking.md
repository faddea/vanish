# Tracking — Vanish

## Estado Actual

### ✅ Home Page (Landing)
- Hero con logo animado (bounce), título, tagline, orbes flotantes de fondo
- Card visual con simulación de transferencia (barra de progreso animada, QR con scan highlight, "Subiendo..." animado)
- Sección "Cómo funciona" con 4 pasos + imágenes reales
- Banner filosofía "Subí → descargá → desaparece"
- Footer con CTA
- Nav bar fija con menú mobile slide-in desde la derecha
- Loader inicial con fade-in del hero completo
- Paleta negro/blanco estilo Vercel/Apple
- TailwindCSS vía CDN

### ✅ Dashboard (post-login) — "Subir archivo"
- Crea sesión en Convex (cloud) con código único de 6 chars
- Drop zone para subir archivos (drag & drop + file input)
- Upload via Convex File Storage (no más base64/localStorage)
- File list reactiva (se actualiza sola cuando otro dispositivo sube algo)
- QR real (QRCodeSVG) con URL completa: `https://vanish.vercel.app/?code=XXX`
- Detección de dispositivo (mobile vs desktop)
- Botón "Cerrar sesión" → vuelve al home

### ✅ ReceiveFlow — "Ya tengo un código"
- 6 inputs de código con auto-advance, paste, uppercase, shake en error
- Validación contra Convex (mutation `validateSession`)
- File list reactiva (ve archivos al instante cuando el sender sube)
- Download con fetch + blob + auto-delete del servidor
- Preview de archivos (abre URL en otra pestaña)
- Auto-detección de código desde URL (`?code=XXX`)
- Success overlay: "Archivo descargado y eliminado"
- Estado conectado/desconectado

### ✅ Backend (Convex)
- `sessions.ts`: create (genera código único), validate (mutation), join (query)
- `files.ts`: generateUploadUrl, save, list (reactivo con URLs de descarga), markDownloaded, remove
- `crons.ts`: cleanup cada 1h de sesiones >24h
- File Storage de Convex para archivos reales
- Reactive queries = los archivos aparecen en tiempo real sin WebSocket

### ✅ Deploy
- Frontend en Vercel: `https://vanish-61a9.vercel.app`
- Backend en Convex Cloud: `https://fast-pig-237.convex.cloud`
- QR apunta a la URL de Vercel con código embebido

---

## Comportamiento del sistema

### Persistencia

| Evento | Comportamiento |
|---|---|
| Subida exitosa | Se guarda en Convex File Storage |
| Cierre del navegador | El archivo sigue en el servidor |
| Descarga desde otro dispositivo | Se elimina del servidor |
| Pasadas 24h sin descargar | Cron de limpieza lo elimina |
| Sesión vacía | No se borra automáticamente (solo por cron) |

### Multi-usuario

- Múltiples receivers pueden unirse al mismo código
- Todos ven los archivos en tiempo real
- **El primero que descarga un archivo lo elimina para todos**
- No hay contador de descargas

---

## Estructura del proyecto

```
vanish/
├── convex/
│   ├── schema.ts              ← Schema de sesiones y archivos
│   ├── sessions.ts            ← Crear y validar sesiones
│   ├── files.ts               ← Upload, list, download, delete
│   ├── crons.ts               ← Cleanup cada 1h
│   └── _generated/            ← Bindings auto-generados
├── src/
│   ├── hooks/
│   │   ├── useDevice.js       ← Detección mobile/desktop
│   │   └── useScrollReveal.js ← IntersectionObserver para animaciones
│   ├── components/
│   │   ├── Nav.jsx            ← Nav bar fija + menú mobile slide-in
│   │   ├── Hero.jsx           ← Landing hero con animaciones
│   │   ├── HowItWorks.jsx     ← Scroll storytelling (4 pasos)
│   │   ├── PhilosophyBanner.jsx ← Banner filosofía
│   │   ├── CtaFooter.jsx      ← Footer con CTA
│   │   ├── Dashboard.jsx      ← Post-login (uploader con QR real)
│   │   └── ReceiveFlow.jsx    ← Ingreso de código + descarga reactiva
│   ├── App.jsx                ← Orquestador de vistas + lectura de ?code=
│   ├── App.css                ← Animaciones globales
│   ├── index.css              ← Estilos base
│   └── main.jsx               ← Entry point (ConvexProvider)
├── public/
│   ├── icon.jpeg
│   └── image-1.png .. image-4.png  ← Imágenes de los pasos
├── docu/
│   ├── docu.md                ← Documentación del producto
│   └── tracking.md            ← Este archivo
├── .env.local                 ← VITE_CONVEX_URL (no subido a git)
├── .gitignore
├── var.md                     ← Variable de entorno para Vercel
├── package.json
└── vite.config.js
```

---

## Flujo Completo de la App

### Botón "Subir archivo" — Iniciar transferencia

| Dispositivo | Acción |
|---|---|
| **Desktop** | Toca "Subir archivo" → Dashboard con QR real + código de sesión |
| **Mobile** | Toca "Subir archivo" → Dashboard con QR real + código de sesión |

### Botón "Ya tengo un código" — Unirse a transferencia

| Dispositivo | Acción |
|---|---|
| **Mobile** | Escanea QR o ingresa código → ve archivos en tiempo real y descarga |
| **Desktop** | Escanea QR o ingresa código → ve archivos en tiempo real y descarga |

### Ciclo principal (Sender → Receiver)

```
1. Sender:  "Subir archivo" → Dashboard (QR + código)
2. Receiver: escanea QR desde el celular → se abre la app con código cargado
3. Receiver conectado → ve los archivos que el sender sube (en tiempo real)
4. Receiver descarga → el archivo se borra del servidor
```

---

## Pendiente (futuro)
- E2EE (Web Crypto API AES-GCM)
- Contador de descargas (evitar que un archivo se borre para todos al primer download)
- Escáner QR con cámara (jsQR/getUserMedia)
- Progreso de subida (barra)
- Notificación sonora al recibir archivos
- Auto-borrado de sesión al cerrar Dashboard
- Dominio personalizado
