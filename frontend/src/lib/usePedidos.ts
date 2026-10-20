import { useEffect, useState } from "react"
import { supabase } from "./supabase"
import type { Pedido } from "./pedidos"

function ordenarPorLlegada(lista: Pedido[]): Pedido[] {
  return [...lista].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
}

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [conectado, setConectado] = useState(false)

  // Trae de la base los pedidos pendientes, del más viejo al más nuevo
  async function cargarPendientes() {
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .eq("estado", "pendiente")
      .order("created_at", { ascending: true })

    if (error) {
      setError("No se pudieron cargar los pedidos")
    } else {
      setPedidos(data as Pedido[])
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

  // Cambia el estado de un pedido (sirve para "listo" y para "cancelado")
  async function cambiarEstado(id: number, nuevoEstado: "listo" | "cancelado") {
    // Primero lo sacamos de la pantalla para que se sienta instantáneo
    setPedidos((anteriores) => anteriores.filter((p) => p.id !== id))

    const { error } = await supabase
      .from("pedidos")
      .update({ estado: nuevoEstado, completed_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      // Si falló, volvemos a traer la lista real y avisamos
      await cargarPendientes()
      setError("No se pudo actualizar el pedido. Probá de nuevo.")
    }
  }

  function marcarListo(id: number) {
    return cambiarEstado(id, "listo")
  }

  function cancelarPedido(id: number) {
    return cambiarEstado(id, "cancelado")
  }

  return { pedidos, cargando, error, conectado, marcarListo, cancelarPedido }
}