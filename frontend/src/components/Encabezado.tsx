interface Props {
  seccion: string
  conectado: boolean
  alCerrarSesion: () => void
  tema: "oscuro" | "claro"
}

const ESTILOS = {
  oscuro: {
    barra: "bg-neutral-950",
    nombre: "text-celeste",
    seccion: "text-neutral-400",
    estado: "text-neutral-400",
    salir: "border-neutral-600 text-neutral-300",
  },
  claro: {
    barra: "bg-white",
    nombre: "text-celeste-oscuro",
    seccion: "text-neutral-500",
    estado: "text-neutral-500",
    salir: "border-neutral-300 text-neutral-700",
  },
}

export function Encabezado({ seccion, conectado, alCerrarSesion, tema }: Props) {
  const e = ESTILOS[tema]

  return (
    <header
      className={`flex items-center justify-between gap-4 border-b-4 border-celeste px-4 py-3 sm:px-8 ${e.barra}`}
    >
      <div className="flex items-center gap-3">
        {/* Círculo blanco detrás del logo para que se vean sus contornos negros */}
        <img
          src="/logo.png"
          alt="Pri-Burgers"
          className="h-14 w-14 rounded-full bg-white p-0.5"
        />
        <div>
          <p
            className={`font-titulo text-2xl font-extrabold leading-none ${e.nombre}`}
          >
            Pri-Burgers
          </p>
          <p className={`text-sm font-bold ${e.seccion}`}>{seccion}</p>
        </div>
      </div>

      <div className={`flex items-center gap-4 text-sm font-bold ${e.estado}`}>
        <span className="flex items-center gap-2">
          <span
            className={`h-3 w-3 rounded-full ${conectado ? "bg-green-500" : "bg-red-500"}`}
          />
          {conectado ? "En vivo" : "Sin conexión"}
        </span>
        <button
          onClick={alCerrarSesion}
          className={`rounded-lg border px-3 py-1 ${e.salir}`}
        >
          Salir
        </button>
      </div>
    </header>
  )
}