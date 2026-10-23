import { Encabezado } from "./Encabezado"
import { Tablero } from "./Tablero"
import { usePedidos } from "../lib/usePedidos"

interface Props {
  alCerrarSesion: () => void
}

export function PantallaCocina({ alCerrarSesion }: Props) {
  const { pedidos, cargando, error, conectado, marcarListo } = usePedidos()

  return (
    <div className="min-h-screen bg-neutral-900">
      <Encabezado
        seccion="Cocina"
        conectado={conectado}
        alCerrarSesion={alCerrarSesion}
        tema="oscuro"
      />

      <main className="p-4 sm:p-8">
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
          <Tablero pedidos={pedidos} alMarcarListo={marcarListo} />
        )}
      </main>
    </div>
  )
}