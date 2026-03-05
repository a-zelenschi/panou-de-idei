"use client"

import { supabase } from "@/lib/supabase/auth"
import { useState, useEffect } from "react"

// Definim structura exactă a proiectului
interface Project {
  id: number
  name: string
}

// Definim ce poate conține starea modalului
interface ModalState {
  mode: "add" | "edit"
  id?: number
  name?: string
}

// Interfața Props actualizată pentru a se potrivi cu ProjectsPage
interface ModalProps {
  modal: ModalState | null
  setModal: (val: ModalState | null) => void
  onSuccess: () => Promise<void> // Folosim o singură funcție de succes
}

export default function ProjectModal({
  modal,
  setModal,
  onSuccess,
}: ModalProps) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  // Resetăm input-ul când se deschide modalul
  useEffect(() => {
    if (modal) {
      setName(modal.name || "")
    } else {
      setName("")
    }
  }, [modal])

  if (!modal) return null

  const handleSave = async () => {
    if (!name.trim()) return
    setLoading(true)

    try {
      if (modal.mode === "add") {
        // LOGICA DE ADĂUGARE
        const { error } = await supabase
          .from("projects")
          .insert([{ name }])

        if (error) throw error
      } else if (modal.mode === "edit" && modal.id) {
        // LOGICA DE EDITARE
        const { error } = await supabase
          .from("projects")
          .update({ name })
          .eq("id", modal.id)

        if (error) throw error
      }

      // Dacă totul e ok, refresh la listă și închidem modalul
      await onSuccess()
      setModal(null)
    } catch (error: any) {
      alert("Eroare la salvare: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-[2rem] w-[400px] shadow-2xl border border-slate-100">
        <h2 className="text-xl font-black text-slate-800 mb-6">
          {modal.mode === "add" ? "Proiect Nou" : "Editează Proiect"}
        </h2>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Nume Proiect
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium transition-all"
            placeholder="Introduceți numele..."
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setModal(null)}
            className="px-6 py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors"
          >
            Anulează
          </button>

          <button
            onClick={handleSave}
            disabled={loading || !name.trim()}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-200 disabled:shadow-none transition-all active:scale-95"
          >
            {loading ? "Se salvează..." : "Salvează"}
          </button>
        </div>
      </div>
    </div>
  )
}