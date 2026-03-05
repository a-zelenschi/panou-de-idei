"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    const term = search.trim();
    if (!term) return;

    setIsLoading(true);
    setErrorMsg(null);

    // Căutăm dacă există un proiect cu acest nume exact
    const { data, error } = await supabase
      .from("projects")
      .select("name")
      .eq("name", term)
      .maybeSingle();

    if (error || !data) {
      setErrorMsg("Nu există un proiect cu acest nume.");
      setIsLoading(false);
      return;
    }

    // Navigăm către URL-ul format din numele proiectului
    router.push(`/${encodeURIComponent(data.name)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white px-4 font-sans">
      <h1 className="text-3xl md:text-4xl font-normal text-gray-900 mb-8 tracking-tight">
        La ce te gândești astăzi?
      </h1>

      <div className="flex items-center w-full max-w-3xl bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm focus-within:shadow-md transition-all duration-300">
        <input
          type="text"
          placeholder="Introdu numele exact al proiectului..."
          className="flex-1 bg-transparent px-3 text-lg text-gray-900 placeholder-gray-400 outline-none w-full"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (errorMsg) setErrorMsg(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="flex items-center justify-center w-12 h-10 bg-black text-white rounded-full hover:bg-gray-800 disabled:bg-gray-400 transition-colors ml-2"
        >
          {isLoading ? "..." : "Go"}
        </button>
      </div>

      {errorMsg && <p className="mt-6 text-red-500 animate-pulse">{errorMsg}</p>}
    </div>
  );
}