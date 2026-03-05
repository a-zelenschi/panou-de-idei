"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/auth"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    checkSession()
    
    // Listen la schimbări de autentificare
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <img src="https://hwliovgvieibewagfvhx.supabase.co/storage/v1/object/public/logo/logo.png" alt="Logo" className="h-10 w-10 rounded-md" />

            {/* Title */}
            <div className="font-semibold text-gray-700">
              <Link href="/" className="hover:text-blue-600">
               Panou de idei
              </Link>
            </div>

            {/* Menu */}
            <div className="hidden md:flex gap-4 ml-6">
              <Link href="/dashboard" className="hover:text-blue-600">
                Panou
              </Link>

              <Link href="/idei" className="hover:text-blue-600">
                Idei despre aplicatie
              </Link>

              <Link href="/contacte" className="hover:text-blue-600">
                Contacte
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Logare
                </Link>

                <Link
                  href="/register"
                  className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Inregistrare
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}
