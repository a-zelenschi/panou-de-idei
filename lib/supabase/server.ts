import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function createSupabaseServerClient() {
  const cookieStore = await cookies() // ⚡ await aici

  return createServerClient(supabaseUrl, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value ?? null
      },
      set() {
        throw new Error(
          "Setting cookies requires ResponseCookies in App Router."
        )
      },
      remove() {
        throw new Error(
          "Removing cookies requires ResponseCookies in App Router."
        )
      },
    },
  })
}

/**
 * Obține user-ul curent pe server
 */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient() // ⚡ await aici
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

/**
 * Obține access token (pentru GraphQL)
 */
export async function getAccessToken() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}