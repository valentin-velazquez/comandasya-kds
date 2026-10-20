import type { Pedido } from "./pedidos"

function haceMinutos(minutos: number) {
  return new Date(Date.now() - minutos * 60000).toISOString()
}

export const pedidosDePrueba: Pedido[] = [
  {
    id: 1,
    pedix_id: "1042",
    productos: "2x Doble cheddar - sin cebolla\n1x Papas grandes\n1x Gaseosa cola",
    observaciones: "Una hamburguesa sin cebolla",
    estado: "pendiente",
    created_at: haceMinutos(19),
    completed_at: null,
  },
  {
    id: 2,
    pedix_id: "1043",
    productos: "1x Bacon burger\n1x Veggie burger\n2x Aros de cebolla",
    observaciones: null,
    estado: "pendiente",
    created_at: haceMinutos(7),
    completed_at: null,
  },
  {
    id: 3,
    pedix_id: "1044",
    productos: "3x Combo clásico\n3x Papas medianas\n1x Agua",
    observaciones: "Papas sin sal",
    estado: "pendiente",
    created_at: haceMinutos(2),
    completed_at: null,
  },
  {
    id: 4,
    pedix_id: "1045",
    productos: "1x Doble cheddar (Extra bacon)",
    observaciones: null,
    estado: "pendiente",
    created_at: haceMinutos(0),
    completed_at: null,
  },
]