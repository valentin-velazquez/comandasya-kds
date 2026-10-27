# ComandasYa · Pri-Burgers

Sistema de comandas para la cocina de una hamburguesería . Los pedidos que llegan por la tienda online **Pedix** aparecen solos en una pantalla de la cocina, y el mostrador puede ver, cancelar y reenviar pedidos. Todo en tiempo real y sin papel.

---

## ¿Qué problema resuelve?

Antes, los pedidos de la tienda online había que pasarlos a la cocina a mano o impresos. Ahora:

1. El cliente hace el pedido en Pedix.
2. El pedido aparece automáticamente en la pantalla de la cocina, con todo detallado (extras, "sin", notas, nombre, envío o retiro).
3. La cocina lo marca como listo.
4. El mostrador lo ve completado, y si algo salió mal puede reenviarlo a la cocina con una nota.

---

## Cómo funciona

```
Pedix  ──►  n8n  ──►  Supabase  ◄──►  App web (React)
(pedido)   (recibe    (guarda y       (pantalla de cocina
            y valida)  avisa)          y de mostrador)
```

| Pieza | Para qué sirve |
|---|---|
| **Pedix** | La tienda online donde los clientes hacen el pedido. Avisa cada pedido nuevo con un mensaje (webhook de Google Pub/Sub). |
| **n8n** | Recibe el aviso, comprueba que viene de verdad de Pedix, ordena los datos y los guarda. |
| **Supabase** | La base de datos (Postgres). También maneja el inicio de sesión, los permisos y el tiempo real. |
| **App web** | Hecha con React. Muestra los pedidos y deja operar según el rol de cada usuario. |

La app habla **solo con Supabase**. n8n se ocupa únicamente de la entrada de pedidos.

---

## Pantallas y roles

Hay dos usuarios, cada uno con un rol. Al iniciar sesión, la app muestra la pantalla que le corresponde.

### Cocina (pantalla oscura)
- Ve los pedidos pendientes, del más viejo al más nuevo.
- Cada pedido muestra número, nombre del cliente, envío o retiro, productos con sus extras (verde) y lo que se saca (rojo), y observaciones.
- Los pedidos que tardan más de 15 minutos se marcan en naranja.
- Los pedidos **reenviados** por el mostrador se ven en violeta, con la nota del mostrador.
- Puede hacer una sola cosa: **marcar como listo**.

### Mostrador (pantalla clara)
- Ve todos los pedidos del día y puede elegir otro día.
- Puede **cancelar** un pedido que todavía está en cocina (con confirmación).
- Puede **restaurar a cocina** un pedido ya completado, con una nota opcional de hasta 200 caracteres. Vuelve a la cocina marcado como reenviado.
- Los pedidos recién completados se resaltan en verde durante 5 minutos.


---

## Seguridad

La seguridad **no depende de la pantalla**: se aplica en la base de datos. Aunque alguien modifique la página en su navegador, la base rechaza lo que su rol no puede hacer.

- **Inicio de sesión** con email y contraseña (Supabase Auth). El registro público está desactivado: solo existen los usuarios que creamos nosotros.
- **El rol** (`cocina` o `mostrador`) se guarda en un dato que el propio usuario no puede modificar.
- **Reglas de acceso por fila (RLS):** sin sesión y rol válido no se puede leer ni cambiar ningún pedido.
- **Un "guardia" en la base** (un *trigger*) revisa cada cambio de estado y aplica la tabla de arriba. Además, completa solo las horas de completado y reenvío, para que la pantalla no pueda falsearlas.
- **n8n valida a Pedix:** antes de guardar un pedido comprueba el token de Google (que venga de la cuenta de Pedix correcta).
- **Las claves:** la clave secreta de Supabase vive solo en n8n. La app usa solo la clave pública. Ninguna clave está en este repositorio.

---

## Tecnologías

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Base de datos y sesión:** Supabase (Postgres, Auth, RLS, Realtime)
- **Automatización:** n8n
- **Origen de los pedidos:** Pedix (webhook de Google Pub/Sub)


---

## Cómo ponerlo a andar

### La app (frontend)

1. Instalar [Node.js](https://nodejs.org).
2. En la carpeta `frontend`, crear un archivo llamado `.env.local` con estas dos líneas (los datos salen de Supabase, en *Project Settings > API*):

   ```
   VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_TU_CLAVE_PUBLICA
   ```

   Usar **solo la clave pública**. La clave secreta nunca va en la app. El archivo `.env.local` no se sube a GitHub.
3. Instalar y arrancar:

   ```
   cd frontend
   npm install
   npm run dev
   ```
4. Abrir la dirección que muestra la terminal e iniciar sesión.



---

## Límites de los planes gratuitos

El proyecto corre en planes gratis. Para que no se corten:

- **n8n (plan gratis):** 50 ejecuciones por mes y se pausa si pasan 7 días sin entrar. Cada pedido que llega usa una ejecución.
- **Supabase (plan gratis):** el proyecto se pausa tras una semana sin actividad. Tiene 500 MB de base de datos.
- Entrar a ambos al menos una vez por semana evita las pausas.
- Para usarlo en el negocio todos los días habría que pasar a un plan pago o mudarlo a alternativas autoalojadas.

---

## Autor

Valentín Velázquez · Escuela Secundaria Técnica UBA · TIC
