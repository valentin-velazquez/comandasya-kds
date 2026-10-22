import { formatearHora, minutosDesde, momentoDeLlegada } from "../lib/pedidos"
import type { Pedido } from "../lib/pedidos"
import { EtiquetaEntrega } from "./EtiquetaEntrega"
import { ListaProductos } from "./ListaProductos"

interface Props {
  pedido: Pedido
  alMarcarListo: (id: number) => void
}

export function TarjetaPedido({ pedido, alMarcarListo }: Props) {
  const llegada = momentoDeLlegada(pedido)
  const minutos = minutosDesde(llegada)
  const demorado = minutos > 15

  // Un pedido reenviado se ve distinto: borde y fondo celestes
  const colores = pedido.reenviado
    ? "border-sky-400 bg-sky-950"
    : demorado
      ? "border-orange-500 bg-neutral-800"
      : "border-neutral-700 bg-neutral-800"

  return (
    <article className={`rounded-2xl border-2 p-5 text-white ${colores}`}>
      {pedido.reenviado && (
        <div className="mb-4 rounded-lg bg-sky-400 py-1 text-center text-lg font-extrabold tracking-widest text-black">
          REENVIADO
        </div>
      )}

      <header className="flex items-center justify-between">
        <span className="rounded-lg bg-neutral-700 px-3 py-1 text-lg font-bold">
          #{pedido.pedix_id}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            demorado ? "bg-orange-500 text-black" : "bg-neutral-700"
          }`}
        >
          {minutos < 1 ? "recién" : `${minutos} min`}
        </span>
      </header>

      {(pedido.cliente_nombre || pedido.tipo_entrega) && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {pedido.cliente_nombre && (
            <span className="text-xl font-semibold">{pedido.cliente_nombre}</span>
          )}
          <EtiquetaEntrega tipo={pedido.tipo_entrega} />
        </div>
      )}

      <p className="mt-2 text-sm text-neutral-300">
        {pedido.reenviado
          ? `Reenviado a las ${formatearHora(llegada)} (pedido original de las ${formatearHora(pedido.created_at)})`
          : `Llegó a las ${formatearHora(pedido.created_at)}`}
      </p>

      <div className="mt-4">
        <ListaProductos productos={pedido.productos} />
      </div>

      {pedido.observaciones && (
        <div className="mt-4 rounded-lg bg-yellow-400 p-3 text-black">
          <strong>OBSERVACIÓN:</strong> {pedido.observaciones}
        </div>
      )}

      {pedido.reenviado && pedido.nota_reenvio && (
        <div className="mt-4 rounded-lg bg-sky-200 p-3 text-lg text-black">
          <strong>NOTA DE MOSTRADOR:</strong> {pedido.nota_reenvio}
        </div>
      )}

      <button
        onClick={() => alMarcarListo(pedido.id)}
        className="mt-5 w-full rounded-xl bg-white py-3 text-lg font-bold text-black"
      >
        Marcar como listo
      </button>
    </article>
  )
}