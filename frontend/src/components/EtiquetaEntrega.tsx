import type { TipoEntrega } from "../lib/pedidos"

interface Props {
  tipo: TipoEntrega | null
  // true = versión para fondo claro (mostrador)
  claro?: boolean
}

export function EtiquetaEntrega({ tipo, claro = false }: Props) {
  // Los pedidos viejos no tienen este dato
  if (!tipo) return null

  const esEnvio = tipo === "envio"

  const colores = claro
    ? esEnvio
      ? "bg-indigo-600 text-white"
      : "bg-emerald-600 text-white"
    : esEnvio
      ? "bg-indigo-300 text-black"
      : "bg-emerald-300 text-black"

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-extrabold tracking-wide ${colores}`}
    >
      {esEnvio ? "ENVÍO" : "RETIRO"}
    </span>
  )
}