"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/auth";
import HeaderBar from "@/components/dashbord_ui/HeaderBar";
import ProjectModal from "@/components/dashbord_ui/ProjectModal";

// Definim un tip pentru proiect pentru a evita utilizarea 'any'
interface Project {
  id: number;
  name: string;
  created_at?: string;
}

export default function ProjectsPage({ adminData }: { adminData?: any }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ mode: "add" | "edit"; id?: number; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Folosim useCallback pentru a putea refolosi funcția fără a declanșa re-randări inutile
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error("Eroare la încărcarea proiectelor:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest proiect?")) return;

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      
      // Actualizăm starea local fără a face un nou fetch (mai rapid pentru utilizator)
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      alert("Eroare la ștergere: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Transmitem adminData dacă HeaderBar are nevoie de nume/avatar */}
      <HeaderBar 
        search={search} 
        setSearch={setSearch} 
        setModal={() => setModal({ mode: "add" })} 
        adminData={adminData}
      />

      <main className="max-w-6xl mx-auto p-6">
        {loading && projects.length === 0 ? (
          <p className="text-center py-10 text-slate-500">Se încarcă proiectele...</p>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{project.name}</span>
                    <span className="text-xs text-slate-400">ID: {project.id}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModal({ ...project, mode: "edit" })}
                      className="px-4 py-2 bg-slate-100 hover:bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400">Nu a fost găsit niciun proiect.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL PENTRU ADAUGARE / EDITARE */}
      <ProjectModal
        modal={modal}
        setModal={setModal}
        onSuccess={async () => {
          await fetchProjects();
          setModal(null);
        }}
      />
    </div>
  );
}