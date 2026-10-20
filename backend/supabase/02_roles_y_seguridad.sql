-- ComandasYa: roles y seguridad de la tabla pedidos
-- Requiere que existan los usuarios en Supabase Auth (Authentication > Users)
-- y que el registro público esté desactivado.

-- 1) Roles: se guardan en app_metadata, que el usuario no puede modificar
--    (reemplazar los mails por los de cada usuario)
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"rol":"cocina"}'::jsonb
where email = 'cocina@example.com';

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"rol":"mostrador"}'::jsonb
where email = 'mostrador@example.com';

-- 2) Columnas para marcar un pedido reenviado a cocina
alter table public.pedidos
  add column if not exists reenviado boolean not null default false,
  add column if not exists reenviado_at timestamptz;

-- 3) Permisos para usuarios con sesión y rol
grant select, update on public.pedidos to authenticated;

drop policy if exists "usuarios con rol leen pedidos" on public.pedidos;
create policy "usuarios con rol leen pedidos"
on public.pedidos for select to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'rol') in ('cocina', 'mostrador'));

drop policy if exists "usuarios con rol actualizan pedidos" on public.pedidos;
create policy "usuarios con rol actualizan pedidos"
on public.pedidos for update to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'rol') in ('cocina', 'mostrador'))
with check ((auth.jwt() -> 'app_metadata' ->> 'rol') in ('cocina', 'mostrador'));

-- 4) Sin sesión no se puede hacer nada
drop policy if exists "cocina puede leer pedidos" on public.pedidos;
drop policy if exists "cocina puede marcar pedidos" on public.pedidos;
revoke all on public.pedidos from anon;

-- 5) El guardia: valida cada cambio de estado según el rol
create or replace function public.validar_cambio_pedido()
returns trigger
language plpgsql
as $$
declare
  rol text := coalesce(auth.jwt() -> 'app_metadata' ->> 'rol', '');
begin
  -- Cambios de n8n (service_role) o del panel de Supabase: se dejan pasar
  if coalesce(auth.jwt() ->> 'role', '') <> 'authenticated' then
    return new;
  end if;

  -- Nadie puede cambiar los datos del pedido, solo su estado
  if new.pedix_id is distinct from old.pedix_id
     or new.productos is distinct from old.productos
     or new.observaciones is distinct from old.observaciones
     or new.created_at is distinct from old.created_at then
    raise exception 'No se pueden modificar los datos del pedido';
  end if;

  -- Cocina: pendiente -> listo
  if rol = 'cocina' and old.estado = 'pendiente' and new.estado = 'listo' then
    new.completed_at := now();
    new.reenviado := old.reenviado;
    new.reenviado_at := old.reenviado_at;
    return new;
  end if;

  -- Mostrador: cancelar un pendiente
  if rol = 'mostrador' and old.estado = 'pendiente' and new.estado = 'cancelado' then
    new.completed_at := now();
    new.reenviado := old.reenviado;
    new.reenviado_at := old.reenviado_at;
    return new;
  end if;

  -- Mostrador: restaurar un listo (vuelve a cocina como reenviado)
  if rol = 'mostrador' and old.estado = 'listo' and new.estado = 'pendiente' then
    new.reenviado := true;
    new.reenviado_at := now();
    new.completed_at := null;
    return new;
  end if;

  -- Todo lo demás se rechaza (por ejemplo, cancelar un pedido completado)
  raise exception 'Cambio no permitido para el rol %', rol;
end;
$$;

drop trigger if exists validar_cambio_pedido on public.pedidos;
create trigger validar_cambio_pedido
before update on public.pedidos
for each row execute function public.validar_cambio_pedido();