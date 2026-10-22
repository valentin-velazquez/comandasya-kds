import { useEffect, useState } from "react"
import { supabase } from "./supabase"
import { momentoDeLlegada } from "./pedidos"
import type { Pedido } from "./pedidos"

// Del que espera hace más tiempo al que espera hace menos
function ordenarPorLlegada(lista: Pedido[]): Pedido[] {
  return [...lista].sort(
    (a, b) =>
      new Date(momentoDeLlegada(a)).getTime() -
      new Date(momentoDeLlegada(b)).getTime()
  )
}

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [conectado, setConectado] = useState(false)

  // Trae de la base los pedidos pendientes
  async function cargarPendientes() {
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .eq("estado", "pendiente")

    if (error) {
      setError("No se pudieron cargar los pedidos")
    } else {
      setPedidos(ordenarPorLlegada(data as Pedido[]))
      setError(null)
    }
    setCargando(false)
  }

  useEffect(() => {
    cargarPendientes()

    // Escucha en vivo los cambios de la tabla pedidos
    const canal = supabase
      .channel("pedidos-cocina")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pedidos" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const id = (payload.old as { id: number }).id
            setPedidos((anteriores) => anteriores.filter((p) => p.id !== id))
            return
          }

          // INSERT o UPDATE
          const pedido = payload.new as Pedido
          setPedidos((anteriores) => {
            const sinEste = anteriores.filter((p) => p.id !== pedido.id)
            // Si ya no está pendiente (listo o cancelado), sale de la pantalla
            if (pedido.estado !== "pendiente") return sinEste
            return ordenarPorLlegada([...sinEste, pedido])
          })
        }
      )
      .subscribe((estado) => {
        if (estado === "SUBSCRIBED") {
          setConectado(true)
          cargarPendientes() // por si se perdió algo mientras no había conexión
        } else {
          setConectado(false)
        }
      })

    return () => {
      supabase.removeChannel(canal)
    }
  }, [])

  // Cocina solo puede marcar un pedido como completado
  async function marcarListo(id: number) {
    // Primero lo sacamos de la pantalla para que se sienta instantáneo
    setPedidos((anteriores) => anteriores.filter((p) => p.id !== id))

    const { error } = await supabase
      .from("pedidos")
      .update({ estado: "listo" })
      .eq("id", id)

    if (error) {
      // Si falló, volvemos a traer la lista real y avisamos
      await cargarPendientes()
      setError("No se pudo actualizar el pedido. Probá de nuevo.")
    }
  }

  return { pedidos, cargando, error, conectado, marcarListo }
}