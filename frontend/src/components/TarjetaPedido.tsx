import { formatearHora, minutosDesde } from "../lib/pedidos"
import type { Pedido } from "../lib/pedidos"

interface Props {
  pedido: Pedido
}

export function TarjetaPedido({ pedido }: Props) {
  const minutos = minutosDesde(pedido.created_at)
  const demorado = minutos > 15
  const lineas = pedido.productos.split("\n")

  return (
    <article
      className={`rounded-2xl bg-neutral-800 p-5 text-white border-2 ${
        demorado ? "border-orange-500" : "border-neutral-700"
      }`}
    >
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

      <p className="mt-2 text-sm text-neutral-400">
        Llegó a las {formatearHora(pedido.created_at)}
      </p>

      <ul className="mt-4 space-y-1 text-lg">
        {lineas.map((linea, i) => (
          <li key={i}>{linea}</li>
        ))}
      </ul>

      {pedido.observaciones && (
        <div className="mt-4 rounded-lg bg-yellow-400 p-3 text-black">
          <strong>OBSERVACIÓN:</strong> {pedido.observaciones}
        </div>
      )}
    </article>
  )
}