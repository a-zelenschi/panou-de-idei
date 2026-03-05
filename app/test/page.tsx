"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/auth"
import ProjectBrowser from "@/components/dashbord_ui/ProjectBrowser"

export default function TestPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      // 1. Luăm sesiunea curentă - Aici se definește 'session'
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("Nu există o sesiune activă.");
        setError({ message: "Utilizatorul nu este logat." });
        setLoading(false);
        return;
      }

      // 2. Acum 'session' este disponibil, putem folosi session.user.id
      const { data: profile, error: dbError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      console.log("DEBUG - Date primite:", profile);
      console.log("DEBUG - Eroare primită:", dbError);

      setData(profile);
      setError(dbError);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <div className="p-10 font-mono text-slate-500">Se verifică datele...</div>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Status Debug Bază de Date</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl mb-6 shadow-sm">
          <p className="font-bold mb-1">Eroare detectată:</p>
          <code className="text-sm bg-white/50 px-2 py-1 rounded">{error.message}</code>
        </div>
      )}

      <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl mb-8 overflow-hidden relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-slate-500 font-mono text-xs italic">public.users_response.json</span>
        </div>
        
        <pre className="text-indigo-300 font-mono text-sm overflow-auto max-h-[300px] scrollbar-hide">
          {data ? JSON.stringify(data, null, 2) : "// Niciun rând găsit în tabel (null)\n// Verifică dacă ID-ul tău există în tabelul public.users"}
        </pre>
      </div>

      {data && (
        <div className="opacity-50 pointer-events-none">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Previzualizare Componentă:</p>
          <ProjectBrowser adminData={data} />
        </div>
      )}
    </div>
  )
}