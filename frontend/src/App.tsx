import { Login } from "./components/Login"
import { PantallaCocina } from "./components/PantallaCocina"
import { useSesion } from "./lib/useSesion"

function Mensaje({ texto, alSalir }: { texto: string; alSalir?: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-900 p-4 text-center text-xl text-neutral-300">
      <p>{texto}</p>
      {alSalir && (
        <button
          onClick={alSalir}
          className="rounded-lg border border-neutral-600 px-4 py-2 text-base"
        >
          Salir
        </button>
      )}
    </div>
  )
}

function App() {
  const { sesion, rol, cargando, iniciarSesion, cerrarSesion } = useSesion()

  if (cargando) return <Mensaje texto="Cargando..." />

  // Sin sesión: pide usuario y contraseña
  if (!sesion) return <Login alIniciar={iniciarSesion} />

  // Con sesión: muestra la pantalla que corresponde al rol
  if (rol === "cocina") return <PantallaCocina alCerrarSesion={cerrarSesion} />

  if (rol === "mostrador") {
    return (
      <Mensaje
        texto="Pantalla de mostrador (en construcción)"
        alSalir={cerrarSesion}
      />
    )
  }

  return (
    <Mensaje
      texto="Tu usuario no tiene un rol asignado"
      alSalir={cerrarSesion}
    />
  )
}

export default App