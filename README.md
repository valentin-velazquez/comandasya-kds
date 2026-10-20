
# ComandasYa

Pantalla de cocina (KDS, Kitchen Display System) para la hamburguesería **Priburgers**. Los pedidos que entran por Pedix aparecen solos en una pantalla de la cocina, ordenados por orden de llegada, sin papel ni mensajes de WhatsApp.

Proyecto escolar de la Escuela Secundaria Técnica UBA (orientación TIC).

## Cómo funciona

```
Pedix  →  n8n  →  Supabase  →  Pantalla de cocina (React)
```

1. **Pedix** avisa cada pedido nuevo con un mensaje (webhook de Google Pub/Sub).
2. **n8n** recibe el mensaje, comprueba que viene de Pedix (validación del token JWT), lo ordena y lo guarda.
3. **Supabase** guarda los pedidos en una base de datos y avisa a la pantalla en tiempo real.
4. **La pantalla** (React) muestra los pedidos pendientes apenas llegan, en unos 5 segundos.

La pantalla habla solo con Supabase. n8n se encarga únicamente de la entrada de pedidos.

## Tecnologías

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Base de datos y tiempo real: Supabase
- Automatización: n8n Cloud
- Origen de los pedidos: Pedix

## Qué hace hoy

- Recibe pedidos automáticamente desde Pedix, solo si el token es válido.
- Evita pedidos duplicados.
- Muestra los pedidos en cocina por orden de llegada, con hora, minutos de espera y observaciones.
- Resalta los pedidos que llevan más de 15 minutos.
- Se adapta a tablet.
- Indica si hay conexión en vivo.

## Cómo correrlo

Requiere Node.js.

```bash
cd frontend
npm install
npm run dev
```

Antes, creá el archivo `frontend/.env.local` con:

```
VITE_SUPABASE_URL=la-url-de-tu-proyecto-supabase
VITE_SUPABASE_ANON_KEY=la-clave-publica-de-supabase
```

Usá solo la clave pública (publishable). La clave secreta nunca va en el frontend ni en este repositorio.

## Estructura

```
comandasya/
├── frontend/   app de React (pantalla de cocina)
└── backend/    scripts de Supabase y flujo de n8n (en preparación)
```

## Autor

Valentín Velázquez
