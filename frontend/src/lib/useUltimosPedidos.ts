import { useEffect, useState } from "react"
import { supabase } from "./supabase"
import { rangoDelDia } from "./pedidos"
import type { EstadoPedido, Pedido } from "./pedidos"

// Trae todos los pedidos de un día (pendientes, listos y cancelados)
export function useUltimosPedidos(dia: string) {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [conectado, setConectado] = useState(false)

  // Sirve para volver a pedir la lista al terminar una acción
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    // Sirve para ignorar respuestas de un día viejo si se cambia de día rápido
    let activo = true

    async function cargar() {
      const { inicio, fin } = rangoDelDia(dia)

      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .gte("created_at", inicio)
        .lt("created_at", fin)
        .order("created_at", { ascending: false })
        .limit(200)

      if (!activo) return

      if (error) {
        setError("No se pudieron cargar los pedidos")
      } else {
        setPedidos(data as Pedido[])
        setError(null)
      }
      setCargando(false)
    }

    cargar()

    // Cuando algo cambia en la tabla, se vuelve a pedir la lista
    const canal = supabase
      .channel(`pedidos-mostrador-${dia}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pedidos" },
        () => cargar()
      )
      .subscribe((estado) => {
        if (estado === "SUBSCRIBED") {
          setConectado(true)
          cargar()
        } else {
          setConectado(false)
        }
      })

    return () => {
      activo = false
      supabase.removeChannel(canal)
    }
  }, [dia, recarga])

  // Actualiza un pedido. Las reglas las controla Supabase:
  // mostrador solo puede cancelar un pendiente o restaurar un completado.
  async function actualizarPedido(
    id: number,
    cambios: { estado: EstadoPedido; nota_reenvio?: string | null }
  ) {
    const { error } = await supabase
      .from("pedidos")
      .update(cambios)
      .eq("id", id)

    if (error) {
      setError("No se pudo actualizar el pedido. Probá de nuevo.")
    } else {
      setError(null)
    }
    setRecarga((n) => n + 1)
  }

  function cancelarPedido(id: number) {
    return actualizarPedido(id, { estado: "cancelado" })
  }

  // La nota es opcional: si viene vacía se guarda como "sin nota"
  function restaurarPedido(id: number, nota: string) {
    const notaLimpia = nota.trim()
    return actualizarPedido(id, {
      estado: "pendiente",
      nota_reenvio: notaLimpia === "" ? null : notaLimpia,
    })
  }

  return {
    pedidos,
    cargando,
    error,
    conectado,
    cancelarPedido,
    restaurarPedido,
  }
}