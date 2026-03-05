"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/auth"
import ProjectBrowser from "@/components/dashbord_ui/ProjectBrowser"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isAuthorized, setIsAuthorized] = useState(false) // Flag nou pentru securitate
  const router = useRouter()

  useEffect(() => {
    const fetchAndVerifyAdmin = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session) {
          router.replace("/")
          return
        }

        const { data, error: dbError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle()

        // Verificăm strict rolul de admin
        if (dbError || !data || data.role !== 'admin') {
          console.warn("Acces refuzat: Nu ești administrator.")
          router.replace("/") // Aruncă studentul pe prima pagină
          return
        }

        setUserProfile(data)
        setIsAuthorized(true) // Doar acum permitem afișarea
      } catch (err) {
        console.error("Eroare neașteptată:", err)
        router.replace("/")
      } finally {
        setLoading(false)
      }
    }

    fetchAndVerifyAdmin()
  }, [router])

  // 1. În timp ce verificăm, arătăm loader-ul
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Verificare securitate...</p>
        </div>
      </div>
    )
  }

  // 2. DACĂ NU ESTE ADMIN, NU RNDĂM NIMIC (returnăm null)
  // Chiar dacă loading e false, dacă isAuthorized e false, studentul vede un ecran alb înainte de redirect
  if (!isAuthorized) {
    return null 
  }

  // 3. Doar adminul ajunge aici
  return <ProjectBrowser adminData={userProfile} />
}