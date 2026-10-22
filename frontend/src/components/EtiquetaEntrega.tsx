import type { TipoEntrega } from "../lib/pedidos"

interface Props {
  tipo: TipoEntrega | null
}

export function EtiquetaEntrega({ tipo }: Props) {
  // Los pedidos viejos no tienen este dato
  if (!tipo) return null

  const esEnvio = tipo === "envio"

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-extrabold tracking-wide text-black ${
        esEnvio ? "bg-indigo-300" : "bg-emerald-300"
      }`}
    >
      {esEnvio ? "ENVÍO" : "RETIRO"}
    </span>
  )
}