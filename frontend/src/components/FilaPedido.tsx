import { useState } from "react"
import { esRecienCompletado, formatearHora } from "../lib/pedidos"
import type { EstadoPedido, Pedido } from "../lib/pedidos"
import { EtiquetaEntrega } from "./EtiquetaEntrega"
import { ListaProductos } from "./ListaProductos"

interface Props {
  pedido: Pedido
  alCancelar: (id: number) => void
  alRestaurar: (id: number, nota: string) => void
}

const ETIQUETAS: Record<EstadoPedido, { texto: string; clases: string }> = {
  pendiente: { texto: "En cocina", clases: "bg-amber-400 text-black" },
  listo: { texto: "Completado", clases: "bg-green-500 text-black" },
  cancelado: { texto: "Cancelado", clases: "bg-red-600 text-white" },
}

export function FilaPedido({ pedido, alCancelar, alRestaurar }: Props) {
  // true = apretó "Cancelar pedido" y falta que confirme
  const [confirmando, setConfirmando] = useState(false)
  // true = apretó "Restaurar a cocina" y está escribiendo la nota
  const [restaurando, setRestaurando] = useState(false)
  const [nota, setNota] = useState("")

  const etiqueta = ETIQUETAS[pedido.estado]
  const recien = esRecienCompletado(pedido)

  // Recién completado: borde y fondo verdes con un poco de brillo
  const colores = recien
    ? "border-green-500 bg-green-50 shadow-lg shadow-green-500/30"
    : "border-neutral-200 bg-white shadow-sm"

  function reenviar() {
    alRestaurar(pedido.id, nota)
    setRestaurando(false)
    setNota("")
  }

  function volver() {
    setRestaurando(false)
    setNota("")
  }

  return (
    <article className={`rounded-2xl border-2 p-4 text-neutral-900 ${colores}`}>
      {recien && (
        <div className="mb-3 rounded-lg bg-green-500 py-1 text-center font-titulo text-lg font-extrabold tracking-widest text-white">
          RECIÉN COMPLETADO
        </div>
      )}

      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-lg bg-neutral-100 px-3 py-1 font-titulo text-xl font-bold">
            #{pedido.pedix_id}
          </span>
          {pedido.cliente_nombre && (
            <span className="font-titulo text-lg font-semibold">
              {pedido.cliente_nombre}
            </span>
          )}
          <span className="text-sm text-neutral-500">
            Enviado a las {formatearHora(pedido.created_at)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <EtiquetaEntrega tipo={pedido.tipo_entrega} claro />
          {pedido.reenviado && (
            <span className="rounded-full border border-violet-500 px-3 py-1 text-xs font-bold text-violet-700">
              REENVIADO
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${etiqueta.clases}`}
          >
            {etiqueta.texto}
          </span>
        </div>
      </header>

      <div className="mt-3">
        <ListaProductos productos={pedido.productos} compacta claro />
      </div>

      {pedido.observaciones && (
        <p className="mt-3 rounded-lg bg-yellow-300 p-2 text-sm text-black">
          <strong>OBSERVACIÓN:</strong> {pedido.observaciones}
        </p>
      )}

      {pedido.nota_reenvio && (
        <p className="mt-3 rounded-lg bg-violet-100 p-2 text-sm text-black">
          <strong>NOTA DE REENVÍO:</strong> {pedido.nota_reenvio}
        </p>
      )}

      {pedido.completed_at && pedido.estado !== "pendiente" && (
        <p className="mt-3 text-sm text-neutral-500">
          {pedido.estado === "listo" ? "Completado" : "Cancelado"} a las{" "}
          {formatearHora(pedido.completed_at)}
        </p>
      )}

      {/* Pendiente: se puede cancelar (con confirmación) */}
      {pedido.estado === "pendiente" &&
        (confirmando ? (
          <div className="mt-4">
            <p className="mb-2 font-bold">
              ¿Cancelar el pedido #{pedido.pedix_id}?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => alCancelar(pedido.id)}
                className="rounded-xl bg-red-600 py-2 font-bold text-white"
              >
                Sí, cancelar
              </button>
              <button
                onClick={() => setConfirmando(false)}
                className="rounded-xl bg-neutral-200 py-2 font-bold text-neutral-800"
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className="mt-4 w-full rounded-xl border-2 border-red-500 py-2 font-bold text-red-600"
          >
            Cancelar pedido
          </button>
        ))}

      {/* Completado: se puede restaurar a cocina, con una nota opcional */}
      {pedido.estado === "listo" &&
        (restaurando ? (
          <div className="mt-4">
            <label
              htmlFor={`nota-${pedido.id}`}
              className="mb-1 block text-sm font-bold"
            >
              Nota para cocina (opcional)
            </label>
            <textarea
              id={`nota-${pedido.id}`}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              maxLength={200}
              rows={2}
              placeholder="Ej: faltó la bebida / salió fría la hamburguesa"
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-neutral-900 outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="mb-2 text-right text-xs text-neutral-500">
              {nota.length}/200
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={reenviar}
                className="rounded-xl bg-violet-600 py-2 font-bold text-white"
              >
                Reenviar a cocina
              </button>
              <button
                onClick={volver}
                className="rounded-xl bg-neutral-200 py-2 font-bold text-neutral-800"
              >
                Volver
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setRestaurando(true)}
            className="mt-4 w-full rounded-xl border-2 border-violet-500 py-2 font-bold text-violet-700"
          >
            Restaurar a cocina
          </button>
        ))}
    </article>
  )
}