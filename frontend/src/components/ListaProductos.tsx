interface Props {
  productos: string
  compacta?: boolean
}

type Estilo = "agregar" | "sacar" | "otro"

type Linea =
  | { tipo: "producto"; texto: string }
  | { tipo: "grupo"; estilo: Estilo; texto: string }
  | { tipo: "opcion"; estilo: Estilo; texto: string }
  | { tipo: "nota"; texto: string }

const ESTILO_DE_MARCA: Record<string, Estilo> = {
  "+": "agregar",
  "-": "sacar",
  "*": "otro",
}

// Cómo se dibuja el título de cada grupo y lo elegido adentro
const COLORES: Record<Estilo, { titulo: string; opcion: string }> = {
  agregar: {
    titulo: "bg-green-400 text-black",
    opcion: "text-green-200",
  },
  sacar: {
    titulo: "bg-red-600 text-white",
    opcion: "font-bold text-red-300",
  },
  otro: {
    titulo: "bg-neutral-600 text-white",
    opcion: "text-neutral-200",
  },
}

// Lee el texto línea por línea y entiende qué es cada una
function leerLineas(texto: string): Linea[] {
  const resultado: Linea[] = []
  // Las opciones heredan el estilo del último título de grupo
  let estiloActual: Estilo = "otro"

  for (const linea of texto.split("\n")) {
    if (linea.trim() === "") continue

    const titulo = linea.match(/^\[([+\-*])\] (.*)$/)
    if (titulo) {
      estiloActual = ESTILO_DE_MARCA[titulo[1]]
      resultado.push({ tipo: "grupo", estilo: estiloActual, texto: titulo[2] })
    } else if (linea.startsWith("- ")) {
      resultado.push({
        tipo: "opcion",
        estilo: estiloActual,
        texto: linea.slice(2),
      })
    } else if (linea.startsWith("! ")) {
      resultado.push({ tipo: "nota", texto: linea.slice(2) })
    } else {
      resultado.push({ tipo: "producto", texto: linea })
    }
  }

  return resultado
}

export function ListaProductos({ productos, compacta = false }: Props) {
  const lineas = leerLineas(productos)

  const tamanoProducto = compacta ? "text-base" : "text-xl"
  const tamanoOpcion = compacta ? "text-sm" : "text-lg"

  return (
    <ul className="space-y-1">
      {lineas.map((linea, i) => {
        if (linea.tipo === "producto") {
          return (
            <li
              key={i}
              className={`${tamanoProducto} font-bold ${i > 0 ? "pt-3" : ""}`}
            >
              {linea.texto}
            </li>
          )
        }

        if (linea.tipo === "grupo") {
          return (
            <li key={i} className="ml-3 pt-1">
              <span
                className={`rounded px-2 py-0.5 text-xs font-extrabold tracking-wide ${COLORES[linea.estilo].titulo}`}
              >
                {linea.texto}
              </span>
            </li>
          )
        }

        if (linea.tipo === "opcion") {
          return (
            <li
              key={i}
              className={`ml-8 ${tamanoOpcion} ${COLORES[linea.estilo].opcion}`}
            >
              {linea.texto}
            </li>
          )
        }

        return (
          <li
            key={i}
            className={`ml-3 ${tamanoOpcion} italic text-yellow-300`}
          >
            Nota: {linea.texto}
          </li>
        )
      })}
    </ul>
  )
}