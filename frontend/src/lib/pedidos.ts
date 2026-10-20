export type EstadoPedido = "pendiente" | "listo" | "cancelado"

export interface Pedido {
  id: number
  pedix_id: string
  productos: string
  observaciones: string | null
  estado: EstadoPedido
  created_at: string
  completed_at: string | null
}

// "2026-10-19T18:30:00Z" -> "15:30"
export function formatearHora(fechaIso: string): string {
  return new Date(fechaIso).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Cuántos minutos pasaron desde que llegó el pedido
export function minutosDesde(fechaIso: string): number {
  return Math.floor((Date.now() - new Date(fechaIso).getTime()) / 60000)
}