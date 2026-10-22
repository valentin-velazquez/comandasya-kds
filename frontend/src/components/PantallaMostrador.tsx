import { useEffect, useState } from "react"
import { FilaPedido } from "./FilaPedido"
import { hoyLocal } from "../lib/pedidos"
import { useUltimosPedidos } from "../lib/useUltimosPedidos"

interface Props {
  alCerrarSesion: () => void
}

export function PantallaMostrador({ alCerrarSesion }: Props) {
  const [dia, setDia] = useState(hoyLocal())
  const {
    pedidos,
    cargando,
    error,
    conectado,
    cancelarPedido,
    restaurarPedido,
  } = useUltimosPedidos(dia)

  // Cada 15 segundos fuerza un redibujado, así el resaltado del
  // "recién completado" se apaga solo a los 5 minutos
  const [, setLatido] = useState(0)
  useEffect(() => {
    const intervalo = setInterval(() => setLatido((n) => n + 1), 15000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className="min-h-screen bg-neutral-900 p-4 sm:p-8">
      <div className="mb-4 flex items-center justify-end gap-4 text-sm font-semibold text-neutral-400">
        <span className="flex items-center gap-2">
          <span
            className={`h-3 w-3 rounded-full ${conectado ? "bg-green-500" : "bg-red-500"}`}
          />
          {conectado ? "En vivo" : "Sin conexión"}
        </span>
        <button
          onClick={alCerrarSesion}
          className="rounded-lg border border-neutral-600 px-3 py-1 text-neutral-300"
        >
          Salir
        </button>
      </div>

      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Últimos pedidos</h1>

        <div className="flex items-center gap-3 text-white">
          <label htmlFor="dia" className="text-sm font-semibold text-neutral-400">
            Día
          </label>
          <input
            id="dia"
            type="date"
            value={dia}
            max={hoyLocal()}
            onChange={(e) => {
              if (e.target.value) setDia(e.target.value)
            }}
            className="rounded-lg bg-neutral-700 p-2 text-white [color-scheme:dark]"
          />
          <button
            onClick={() => setDia(hoyLocal())}
            className="rounded-lg border border-neutral-600 px-3 py-2 text-sm font-semibold"
          >
            Hoy
          </button>
          <span className="rounded-full bg-neutral-700 px-4 py-1 text-sm">
            {pedidos.length} pedidos
          </span>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border-2 border-orange-500 bg-orange-500/10 p-4 text-base font-bold text-white">
          {error}
        </div>
      )}

      {cargando ? (
        <p className="py-24 text-center text-xl font-semibold text-neutral-400">
          Cargando pedidos...
        </p>
      ) : pedidos.length === 0 ? (
        <p className="py-24 text-center text-xl text-neutral-400">
          No hay pedidos ese día
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {pedidos.map((pedido) => (
            <FilaPedido
              key={pedido.id}
              pedido={pedido}
              alCancelar={cancelarPedido}
              alRestaurar={restaurarPedido}
            />
          ))}
        </div>
      )}
    </div>
  )
}