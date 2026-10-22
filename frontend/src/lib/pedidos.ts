export type EstadoPedido = "pendiente" | "listo" | "cancelado"
export type TipoEntrega = "envio" | "retiro"

export interface Pedido {
  id: number
  pedix_id: string
  cliente_nombre: string | null
  tipo_entrega: TipoEntrega | null
  productos: string
  observaciones: string | null
  estado: EstadoPedido
  created_at: string
  completed_at: string | null
  reenviado: boolean
  reenviado_at: string | null
  nota_reenvio: string | null
}

// Cuántos minutos se mantiene resaltado un pedido recién completado
export const MINUTOS_RESALTADO = 5

// "2026-10-19T18:30:00Z" -> "15:30"
export function formatearHora(fechaIso: string): string {
  return new Date(fechaIso).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Cuántos minutos pasaron desde una fecha
export function minutosDesde(fechaIso: string): number {
  return Math.floor((Date.now() - new Date(fechaIso).getTime()) / 60000)
}

// Desde cuándo está esperando en cocina: si fue reenviado cuenta
// desde el reenvío, si no, desde que llegó
export function momentoDeLlegada(pedido: Pedido): string {
  return pedido.reenviado && pedido.reenviado_at
    ? pedido.reenviado_at
    : pedido.created_at
}

// ¿Se completó hace menos de 5 minutos?
export function esRecienCompletado(pedido: Pedido): boolean {
  if (pedido.estado !== "listo" || !pedido.completed_at) return false
  return minutosDesde(pedido.completed_at) < MINUTOS_RESALTADO
}

// La fecha de hoy como "2026-10-20" (con la hora de tu compu, no la de Londres)
export function hoyLocal(): string {
  const ahora = new Date()
  const mes = String(ahora.getMonth() + 1).padStart(2, "0")
  const dia = String(ahora.getDate()).padStart(2, "0")
  return `${ahora.getFullYear()}-${mes}-${dia}`
}

// De "2026-10-20" saca desde qué momento hasta qué momento va ese día
export function rangoDelDia(dia: string): { inicio: string; fin: string } {
  const [anio, mes, diaDelMes] = dia.split("-").map(Number)
  const inicio = new Date(anio, mes - 1, diaDelMes)
  const fin = new Date(anio, mes - 1, diaDelMes + 1)
  return { inicio: inicio.toISOString(), fin: fin.toISOString() }
}