import { useEffect, useState } from "react"
import { Encabezado } from "./Encabezado"
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
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <Encabezado
        seccion="Mostrador"
        conectado={conectado}
        alCerrarSesion={alCerrarSesion}
        tema="claro"
      />

      <main className="p-4 sm:p-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-titulo text-4xl font-bold">Últimos pedidos</h1>

          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="dia" className="text-sm font-bold text-neutral-500">
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
              className="rounded-lg border border-neutral-300 bg-white p-2 text-neutral-900"
            />
            <button
              onClick={() => setDia(hoyLocal())}
              className="rounded-lg bg-celeste px-4 py-2 font-titulo text-lg font-bold text-black"
            >
              Hoy
            </button>
            <span className="rounded-full bg-celeste-claro px-4 py-1 font-titulo text-lg font-bold text-celeste-oscuro">
              {pedidos.length} pedidos
            </span>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border-2 border-orange-500 bg-orange-100 p-4 text-base font-bold text-black">
            {error}
          </div>
        )}

        {cargando ? (
          <p className="py-24 text-center text-xl font-semibold text-neutral-500">
            Cargando pedidos...
          </p>
        ) : pedidos.length === 0 ? (
          <p className="py-24 text-center text-xl text-neutral-500">
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
      </main>
    </div>
  )
}