import { useState } from "react"
import type { FormEvent } from "react"

interface Props {
  alIniciar: (email: string, password: string) => Promise<string | null>
}

export function Login({ alIniciar }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    setEnviando(true)
    setError(null)
    const mensaje = await alIniciar(email.trim(), password)
    if (mensaje) setError(mensaje)
    setEnviando(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 p-4">
      <form
        onSubmit={enviar}
        className="w-full max-w-sm rounded-3xl border-2 border-celeste bg-neutral-800 p-6 text-white"
      >
        {/* El logo va sobre un círculo blanco para que se vean sus contornos negros */}
        <img
          src="/logo.png"
          alt="Pri-Burgers"
          className="mx-auto mb-3 h-32 w-32 rounded-full bg-white p-1"
        />
        <h1 className="text-center font-titulo text-4xl font-extrabold text-celeste">
          Pri-Burgers
        </h1>
        <p className="mb-6 text-center text-sm text-neutral-400">
          Sistema de comandas · Iniciá sesión para continuar
        </p>

        <label className="mb-1 block text-sm font-bold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-lg bg-neutral-700 p-3 text-white outline-none focus:ring-2 focus:ring-celeste"
        />

        <label className="mb-1 block text-sm font-bold">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 w-full rounded-lg bg-neutral-700 p-3 text-white outline-none focus:ring-2 focus:ring-celeste"
        />

        {error && (
          <p className="mb-4 rounded-lg bg-orange-500 p-3 font-bold text-black">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-xl bg-celeste py-3 font-titulo text-xl font-bold text-black disabled:opacity-50"
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  )
}