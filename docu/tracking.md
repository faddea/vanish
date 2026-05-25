# Tracking — Vanish

## Estado Actual

### ✅ Home Page (Landing)
- Hero con logo animado (bounce), título, tagline, orbes flotantes de fondo
- Card visual con simulación de transferencia (barra de progreso animada, QR con scan highlight, "Subiendo..." animado)
- Sección "Cómo funciona" con scroll reveal
- Banner filosofía "Subí → descargá → desaparece"
- Footer con CTA
- Nav bar fija
- Loader inicial con fade-in del hero completo
- Paleta negro/blanco estilo Vercel/Apple
- TailwindCSS vía CDN
- 0 dependencias extra

### ✅ Dashboard (post-login) — "Subir archivo"
- Crea sesión real en localStorage al montar (código único 6 chars)
- Drop zone para subir archivos (drag & drop + file input)
- File list con download y preview
- QR placeholder + código de sesión dinámico en sidebar
- Detección de dispositivo (mobile vs desktop)
- Botón "Cerrar sesión" → vuelve al home
- Reverse upload: arrastrar archivos desde PC al móvil

### ✅ ReceiveFlow — "Ya tengo un código"
- 6 inputs de código con auto-advance, paste, uppercase, shake en error
- Validación contra localStorage (sesiones reales)
- File list con download (auto-delete al descargar) y preview
- Reverse upload: drag & drop desde PC al móvil
- Success overlay: "Archivo descargado y eliminado"
- Estado conectado/desconectado

### ✅ Capa de datos compartida
- `lib/session.js`: createSession, addFileToSession, getSession, formatSize, canPreview, dataURLtoBlob
- Sesiones persistidas en localStorage con prefijo `vanish_session_`
- Sincronización entre pestañas mediante localStorage compartido

---

## Flujo Completo de la App

### Botón "Subir archivo" — Iniciar transferencia

Abre el Dashboard. Genera sesión con código único de 6 caracteres + QR placeholder.

| Dispositivo | Acción |
|---|---|
| **Desktop** | Toca "Subir archivo" → Dashboard con QR en esquina + código de sesión |
| **Mobile** | Toca "Subir archivo" → Dashboard con QR en esquina + código de sesión |

### Botón "Ya tengo un código" — Unirse a transferencia

Abre ReceiveFlow con inputs de código.

| Dispositivo | Acción |
|---|---|
| **Mobile** | Ingresa código de 6 chars de la sesión del desktop → ve archivos y descarga |
| **Desktop** | Ingresa código de 6 chars de la sesión del mobile → ve archivos y descarga |

### Ciclo principal (Desktop recibe → Mobile sube)

```
1. Desktop: "Subir archivo" → Dashboard (QR + código en sidebar)
2. Mobile:  "Ya tengo un código" → ingresa código del desktop
3. Mobile conectado → sube archivos (drag & drop o file picker)
4. Desktop ve los archivos en el Dashboard → los descarga
```

### Ciclo inverso (Mobile recibe → Desktop sube)

```
1. Mobile:   "Subir archivo" → Dashboard (QR + código en sidebar)
2. Desktop:  "Ya tengo un código" → ingresa código del mobile
3. Desktop conectado → sube archivos
4. Mobile ve los archivos en el Dashboard → los descarga
```

---

## Estado de vistas

- `home`: Landing page (hero + secciones)
- `dashboard`: Panel principal (uploader/receiver)
- `receive`: Flujo de ingreso de código + descarga

---

## Estructura del proyecto

```
src/
├── lib/
│   └── session.js          ← Utilidades de sesión (CRUD localStorage)
├── hooks/
│   ├── useDevice.js        ← Detección mobile/desktop
│   └── useScrollReveal.js  ← IntersectionObserver para animaciones
├── components/
│   ├── Nav.jsx             ← Nav bar fija
│   ├── Hero.jsx            ← Landing hero con animaciones
│   ├── HowItWorks.jsx      ← Scroll storytelling
│   ├── PhilosophyBanner.jsx ← Banner "Subí → descargá → desaparece"
│   ├── CtaFooter.jsx       ← Footer con CTA
│   ├── Dashboard.jsx       ← Post-login (uploader/receiver)
│   └── ReceiveFlow.jsx     ← Ingreso de código + descarga
├── App.jsx                 ← Orquestador de vistas
├── App.css                 ← Animaciones globales
├── index.css               ← Estilos base
└── main.jsx                ← Entry point
```

---

### ❌ Pendiente
- QR real (con librería tipo qrcode.react)
- Backend (Fastify/Node + Socket.IO)
- Subida real de archivos (no localStorage)
- Sistema de sesiones server-side
- Escáner QR con cámara
