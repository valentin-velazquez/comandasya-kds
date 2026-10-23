import { useEffect, useState } from "react"
import { momentoDeLlegada } from "../lib/pedidos"
import type { Pedido } from "../lib/pedidos"
import { TarjetaPedido } from "./TarjetaPedido"

interface Props {
  pedidos: Pedido[]
  alMarcarListo: (id: number) => void
}

export function Tablero({ pedidos, alMarcarListo }: Props) {
  // Cada 60 segundos fuerza un redibujado para actualizar los "N min"
  const [, setLatido] = useState(0)
  useEffect(() => {
    const intervalo = setInterval(() => setLatido((n) => n + 1), 60000)
    return () => clearInterval(intervalo)
  }, [])

  const pendientes = pedidos
    .filter((p) => p.estado === "pendiente")
    .sort(
      (a, b) =>
        new Date(momentoDeLlegada(a)).getTime() -
        new Date(momentoDeLlegada(b)).getTime()
    )

  return (
    <section>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="font-titulo text-4xl font-bold text-white">
          Pedidos en cocina
        </h1>
        <span className="rounded-full bg-celeste px-4 py-1 font-titulo text-xl font-bold text-black">
          {pendientes.length} pendientes
        </span>
      </header>

      {pendientes.length === 0 ? (
        <p className="mt-20 text-center text-xl text-neutral-400">
          No hay pedidos pendientes
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pendientes.map((pedido) => (
            <TarjetaPedido
              key={pedido.id}
              pedido={pedido}
              alMarcarListo={alMarcarListo}
            />
          ))}
        </div>
      )}
    </section>
  )
}