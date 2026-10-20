import { Tablero } from "./components/Tablero"
import { usePedidos } from "./lib/usePedidos"

function App() {
  const { pedidos, cargando, error, conectado } = usePedidos()

  return (
    <div className="min-h-screen bg-neutral-900 p-4 sm:p-8">
      <div className="mb-4 flex items-center justify-end gap-2 text-sm font-semibold text-neutral-400">
        <span
          className={`h-3 w-3 rounded-full ${conectado ? "bg-green-500" : "bg-red-500"}`}
        />
        {conectado ? "En vivo" : "Sin conexión"}
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
        <Tablero pedidos={pedidos} />
      )}
    </div>
  )
}

export default App