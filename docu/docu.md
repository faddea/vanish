# Proyecto — Web App de Transferencia Privada y Temporal

---

# Idea General

Aplicación web multiplataforma (mobile + desktop) para transferir archivos entre dispositivos de forma:

- privada
- rápida
- temporal
- segura
- sin usar WhatsApp Web o Google Drive

El foco principal son:

- escuelas
- facultades
- computadoras públicas
- cibercafés
- PCs compartidas

---

# Problema que Resuelve

Muchos alumnos/docentes necesitan:

- abrir PDFs del classroom
- mover archivos entre dispositivos
- continuar trabajos en casa

Pero NO quieren:

- abrir WhatsApp Web
- iniciar Google Drive
- dejar cuentas abiertas
- exponer conversaciones o archivos personales

---

# Contexto Real de Uso

## Escenario Principal

El producto está pensado especialmente para:

- laboratorios escolares
- computadoras compartidas
- clases prácticas
- facultades
- entornos donde alumnos están físicamente cerca unos de otros

---

## Observación Real

Muchos estudiantes evitan abrir:

- WhatsApp Web
- Google Drive
- correo personal

en computadoras compartidas porque:

- exponen conversaciones privadas
- aparecen notificaciones
- pueden olvidar cerrar sesión
- otros alumnos pueden ver contenido personal

---

## Fricción Detectada

Frases observadas informalmente:

> “Tengo que abrir WhatsApp otra vez”

Esto indica:

- molestia real
- fricción repetitiva
- necesidad existente
- incomodidad social además de técnica

---

# Valor Principal del Producto

La app NO busca solamente:

- transferir archivos

La app busca:

- permitir usar archivos en PCs compartidas sin exponer información personal

---

# Tipo de Uso Esperado

La app probablemente NO será usada:

- todo el día
- por todos los estudiantes
- constantemente

La app SÍ será usada en:

- momentos específicos
- materias prácticas
- necesidad puntual de transferencia
- apertura rápida de PDFs/documentos

Esto es completamente válido para el producto.

---

# Concepto del Producto

## Filosofía

> “Subí → descargá → desaparece”

La app NO busca ser:

- un Drive
- almacenamiento permanente
- nube tradicional

La app SÍ busca ser:

- efímera
- segura
- instantánea
- simple

---

# Principios del Producto

## Prioridad absoluta

La experiencia debe ser:

- más rápida
- más limpia
- más privada

que abrir WhatsApp Web.

---

## Filosofía UX

Cada acción debe requerir:

- pocos clicks
- poca configuración
- mínima fricción

---

## Regla importante

Si una feature hace que la app se parezca demasiado a Google Drive:
- probablemente NO debe agregarse al MVP.

---

# Casos de Uso

---

## Caso 1 — Descargar PDF desde la escuela

### Flujo

1. Alumno descarga PDF desde el celular.
2. Lo sube a la web app.
3. En la PC escolar:
   - abre el sitio
   - escanea QR
4. El archivo aparece automáticamente.
5. Puede:
   - visualizarlo
   - descargarlo
6. Al finalizar:
   - cierra sesión
   - archivo se elimina automáticamente tras descarga.

---

## Caso 2 — Continuar trabajo en casa

### Flujo

1. Alumno trabaja en un archivo en la PC escolar.
2. Inicia sesión mediante QR.
3. Arrastra archivo a la app.
4. Archivo queda temporalmente almacenado.
5. En su casa:
   - entra desde otra PC
   - descarga archivo
6. Sistema:
   - muestra mensaje tipo:
     - “¡Bien, pudiste!”
   - elimina automáticamente el archivo.

---

# Objetivos del MVP

## MVP = versión mínima funcional

---

## Funciones PRINCIPALES

### Autenticación

- Login mediante QR
- Sesión temporal
- Logout remoto

---

### Archivos

- Subir archivos
- Descargar archivos
- Drag & drop
- Visualización básica PDFs/imágenes

---

### Seguridad

- Encriptación
- Tokens temporales
- Sesiones efímeras

---

### Auto eliminación

- Archivo se borra:
  - tras descarga
  - o tras tiempo límite

---

# Funciones que NO deben hacerse al inicio

## Evitar scope gigante

NO agregar:

- carpetas
- compartir links públicos
- perfiles complejos
- chat
- edición online
- almacenamiento permanente
- colaborativo
- comentarios
- historial infinito

---

# Validación Inicial

## Señales positivas observadas

- estudiantes ya usan métodos incómodos para transferir archivos
- existe incomodidad al abrir apps personales
- existe necesidad de visualizar PDFs más cómodamente en desktop
- existe preocupación por privacidad en PCs compartidas

---

# Qué NO optimizar todavía

NO enfocarse inicialmente en:

- miles de usuarios
- microservicios
- infraestructura compleja
- monetización
- app móvil nativa
- IA integrada

La prioridad actual es:

> validar si estudiantes realmente prefieren este flujo antes que WhatsApp Web.

---

# Stack Tecnológico Recomendado

---

# Frontend

## Recomendado

- Vite
- React
- TailwindCSS

---

## Motivo

Necesitás:

- interacción rápida
- QR
- realtime
- drag & drop
- manejo de estado

Astro NO aporta demasiado para este tipo de app interactiva.

---

# Backend

## Actual (MVP)

### Convex (Backend-as-a-Service)

Convex combina en un solo servicio:

- base de datos (document-relacional)
- serverless functions (queries + mutations)
- reactive queries (tiempo real sin WebSocket manual)
- file storage (archivos temporales)
- crons (limpieza automática)
- type-safety end-to-end (TypeScript nativo)

---

## Motivos

- sin servidor que mantener
- queries reactivas = reemplazan Socket.IO automáticamente
- file storage incluido sin configuración extra
- no pausa proyectos inactivos (serverless puro, se paga por uso)

---

## Stack final

```txt
Frontend:  Vite + React + TailwindCSS (CDN)
Backend:   Convex (BaaS)
Auth:      Code-based (sin login, solo código de sesión)
Storage:   Convex File Storage
Tiempo real: Convex Reactive Queries (built-in)
```

---

# Persistencia y Ciclo de Vida

## Archivos

| Evento | Comportamiento |
|---|---|
| Subida exitosa | Se guarda en Convex File Storage |
| Cierre del navegador | El archivo sigue en el servidor |
| Descarga desde otro dispositivo | Se elimina del servidor (`removeFile`) |
| Pasadas 24h sin descargar | Cron de limpieza lo elimina |
| Todos los archivos descargados | La sesión queda vacía (no se borra automáticamente) |

---

## Sesiones

| Característica | Detalle |
|---|---|
| Creación | `createSession` genera código único de 6 chars |
| Unión | `validateSession` verifica que el código exista |
| Múltiples receptores | Todos los que ingresen el mismo código ven los mismos archivos |
| Primera descarga | El archivo se elimina para todos (no hay contador de descargas) |
| Expiración | Cleanup automático cada 1h elimina sesiones >24h |

---

## Comportamiento multi-usuario

- Un solo **sender** (quien crea la sesión desde Dashboard)
- Múltiples **receivers** pueden unirse con el mismo código
- Todos los receivers ven los archivos en tiempo real
- **El primero que descarga un archivo lo elimina para todos** (sin contador de descargas)
- No hay límite de sesiones concurrentes en el free tier (1,000 sesiones simultáneas)

> ⚠️ Consideración de diseño: Si se necesita que N personas descarguen el mismo archivo, habría que agregar un contador de descargas o copia por receiver. Actualmente no está implementado.

---

# Seguridad

# Objetivo principal

El servidor NO debería poder leer archivos.

---

# Encriptación Recomendada

## End-to-End Encryption (E2EE)

---

## Flujo

### En celular

1. Archivo se cifra localmente.
2. Archivo cifrado se sube.

---

### En servidor

Servidor almacena:

- datos cifrados
- sin acceso al contenido real

---

### En PC destino

1. Archivo se descarga.
2. Se descifra localmente.

---

# Tecnologías recomendadas

## Navegador

### Web Crypto API

Usar:

- AES-GCM
- claves temporales

---

# Login QR

# Flujo recomendado

---

## PC

1. Usuario abre sitio.
2. Se genera QR temporal.

---

## Celular

1. Usuario escanea QR.
2. Aprueba sesión.

---

## Resultado

PC obtiene:

- token temporal
- acceso temporal

---

# Sistema de Sesiones

## Características

- temporales
- expiración automática
- logout remoto
- un solo dispositivo activo opcional

---

# Auto eliminación de Archivos

## Opciones

### Opción 1

Eliminar:

- inmediatamente tras descarga

### Opción 2

Eliminar:

- tras X minutos/horas

---

# UX/UI

# Filosofía

La app debe sentirse:

- rápida
- limpia
- minimalista
- confiable

---

# Detalles importantes

## Mensajes humanos

Ejemplo:

- “¡Bien, pudiste!”
- “Archivo eliminado correctamente”
- “Sesión cerrada”
- “Transferencia segura completada”

---

# Diseño recomendado

## Inspiración

- Discord
- Telegram Web
- WeTransfer
- Apple AirDrop

---

# Hosting Gratuito Recomendado

# Frontend

- Vercel
- Netlify

---

# Backend

- Render
- Railway

---

# Storage

- Cloudflare R2

---

# Limitaciones del Hosting Gratis

Posibles problemas:

- backend dormido
- límites mensuales
- uploads lentos
- pocas conexiones simultáneas

Pero suficiente para:

- MVP
- demo
- portfolio
- primeras pruebas escolares

---

# Escalabilidad Aproximada

## MVP básico

Puede soportar:

- decenas o cientos de usuarios

---

## Escalable

Con:

- R2
- PostgreSQL
- backend optimizado

Puede escalar a:

- miles de usuarios

---

# Arquitectura Recomendada

```txt
[ Celular ]
    ↓
Frontend React/Vite
    ↓
Backend Fastify
    ↓
Socket.IO realtime
    ↓
Cloudflare R2 (archivos)
    ↓
PostgreSQL (sesiones/metadatos)
```

---

# Estructura Inicial del Proyecto

```txt
/frontend
  /components
  /pages
  /hooks
  /services

/backend
  /routes
  /controllers
  /services
  /sockets
  /middlewares

/shared
```

---

# Prioridades de Desarrollo

# Fase 1 — MVP

## Objetivo

Transferencia funcional simple.

### Features

- subir archivo
- QR login
- descargar
- eliminar archivo
- logout remoto

---

# Fase 2 — Seguridad

### Features

- encriptación E2EE
- expiración de sesiones
- tokens temporales

---

# Fase 3 — UX

### Features

- drag & drop
- preview PDFs
- animaciones
- mensajes de estado

---

# Fase 4 — Escalabilidad

### Features

- múltiples archivos
- colas
- optimización uploads
- CDN

---

# Riesgos Técnicos

## Importantes

### Subidas grandes

Problema:

- hosting gratuito limitado

---

### Realtime

Problema:

- sincronización QR

---

### Encriptación

Problema:

- manejo correcto de claves

---

# Diferenciador Principal

NO competir contra Drive.

El valor real es:

- privacidad
- rapidez
- temporalidad
- simplicidad
- PCs públicas

---

# Posible Pitch

> “Transferí archivos entre dispositivos de forma privada y temporal sin abrir WhatsApp Web ni Google Drive.”

---

# Ideas Futuras (NO MVP)

## Opcionales

- app móvil
- compartir entre compañeros
- modo offline local
- P2P/WebRTC
- historial temporal
- archivos autodestructivos
- límite de descargas
- links temporales

---

# Objetivo Final

Crear una herramienta:f

- útil
- rápida
- segura
- extremadamente simple

Especialmente diseñada para:

- estudiantes
- docentes
- computadoras públicas/shared devices.