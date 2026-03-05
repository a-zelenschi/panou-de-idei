"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/auth";

export default function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState({
    full_name: "",
    avatar_url: "",
    email: "",
  });

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Luăm datele din tabelul public.users creat anterior
          const { data, error } = await supabase
            .from("users")
            .select("full_name, avatar_url, email")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          if (data) setUserData(data);
        }
      } catch (error) {
        console.error("Eroare la încărcare profil:", error);
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, []);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("users")
        .update({
          full_name: userData.full_name,
          avatar_url: userData.avatar_url,
        })
        .eq("id", user?.id);

      if (error) throw error;
      alert("Profil actualizat cu succes!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div className="p-10 text-center">Se încarcă...</div>;

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-20 px-6">
      <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
        <header className="mb-8 text-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            {userData.avatar_url ? (
              <img src={userData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900">Setări Profil</h1>
          <p className="text-slate-400 text-sm">{userData.email}</p>
        </header>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Nume Complet */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nume Complet</label>
            <input
              type="text"
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium transition-all"
              value={userData.full_name || ""}
              onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
              placeholder="Ex: Ion Popescu"
            />
          </div>

          {/* URL Avatar */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL Fotografie Profil</label>
            <input
              type="text"
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium transition-all"
              value={userData.avatar_url || ""}
              onChange={(e) => setUserData({ ...userData, avatar_url: e.target.value })}
              placeholder="https://link-imagine.jpg"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-200 transition-all active:scale-95 flex justify-center items-center gap-2"
          >
            {updating ? "Se salvează..." : "Salvează Modificările"}
          </button>
        </form>
      </div>
    </main>
  );
}