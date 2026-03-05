"use client"

import { useState } from "react"
import { signIn, signUp } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import Button from "./ui/Button"
import Input from "./ui/Input"

interface Props {
  mode: "login" | "register"
}

export default function AuthForm({ mode }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (mode === "login") {
        const { user, session } = await signIn(email, password)

        if (!user) {
          setError("User not registered or invalid credentials")
        } else {
          router.push("/dashboard")
        }
      } else {
        // Register
        const { user, session } = await signUp(email, password)
        if (!user) {
          setError("Registration failed")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold text-center">
        {mode === "login" ? "Login" : "Register"}
      </h2>

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit">{mode === "login" ? "Login" : "Register"}</Button>
    </form>
  )
}
