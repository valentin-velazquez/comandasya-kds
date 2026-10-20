import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "./supabase"

export type Rol = "cocina" | "mostrador"

export function useSesion() {
  const [sesion, setSesion] = useState<Session | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Al abrir la app, ve si ya había una sesión guardada
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session)
      setCargando(false)
    })

    // Se entera cuando alguien inicia o cierra sesión
    const { data: suscripcion } = supabase.auth.onAuthStateChange(
      (_evento, nuevaSesion) => {
        setSesion(nuevaSesion)
      }
    )

    return () => suscripcion.subscription.unsubscribe()
  }, [])

  // El rol viene guardado en el usuario (lo pusimos con SQL)
  const rol = (sesion?.user.app_metadata?.rol ?? null) as Rol | null

  // Devuelve null si salió bien, o un mensaje si falló
  async function iniciarSesion(
    email: string,
    password: string
  ): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? "Email o contraseña incorrectos" : null
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
  }

  return { sesion, rol, cargando, iniciarSesion, cerrarSesion }
}