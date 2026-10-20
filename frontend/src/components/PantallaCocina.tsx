import { Tablero } from "./Tablero"
import { usePedidos } from "../lib/usePedidos"

interface Props {
  alCerrarSesion: () => void
}

export function PantallaCocina({ alCerrarSesion }: Props) {
  const { pedidos, cargando, error, conectado, marcarListo, cancelarPedido } =
    usePedidos()

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

      {error && (
        <div className="mb-6 rounded-xl border-2 border-orange-500 bg-orange-500/10 p-4 text-base font-bold text-white">
          {error}
        </div>
      )}

      {cargando ? (
        <p className="py-24 text-center text-xl font-semibold text-neutral-400">
          Cargando pedidos...
        </p>
      ) : (
        <Tablero
          pedidos={pedidos}
          alMarcarListo={marcarListo}
          alCancelar={cancelarPedido}
        />
      )}
    </div>
  )
}