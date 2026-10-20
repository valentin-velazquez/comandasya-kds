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
        className="w-full max-w-sm rounded-2xl border-2 border-neutral-700 bg-neutral-800 p-6 text-white"
      >
        <h1 className="mb-1 text-2xl font-bold">ComandasYa</h1>
        <p className="mb-6 text-sm text-neutral-400">Iniciá sesión para continuar</p>

        <label className="mb-1 block text-sm font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-lg bg-neutral-700 p-3 text-white outline-none focus:ring-2 focus:ring-white"
        />

        <label className="mb-1 block text-sm font-semibold">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 w-full rounded-lg bg-neutral-700 p-3 text-white outline-none focus:ring-2 focus:ring-white"
        />

        {error && (
          <p className="mb-4 rounded-lg bg-orange-500 p-3 font-semibold text-black">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-xl bg-white py-3 text-lg font-bold text-black disabled:opacity-50"
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  )
}