"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProjectPage({ params }: { params: Promise<{ projectName: string }> }) {
  const resolvedParams = use(params);
  const decodedName = decodeURIComponent(resolvedParams.projectName);
  const router = useRouter();

  // State-uri Date
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [projectExists, setProjectExists] = useState<boolean | null>(null);

  // State-uri Formular
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const initPage = async () => {
      try {
        // 1. Verificăm dacă proiectul există
        const { data: project } = await supabase
          .from("projects")
          .select("name")
          .eq("name", decodedName)
          .maybeSingle();

        if (!project) {
          setProjectExists(false);
          return;
        }
        setProjectExists(true);

        // 2. Verificăm dacă utilizatorul este logat (Student sau Admin)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user); // Oricine e logat primește acces la buton
        }

        // 3. Încărcăm postările
        const { data: postsData } = await supabase
          .from("posts")
          .select("*")
          .eq("project_name", decodedName)
          .order("created_at", { ascending: false });
          
        setPosts(postsData || []);
      } catch (err) {
        setProjectExists(false);
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [decodedName]);

  // Preview Imagine
  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Logica de Upload (Sigură pentru orice nume de fișier)
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const safeFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(safeFileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("images").getPublicUrl(safeFileName);

      // Inserăm postarea cu email-ul autorului (student sau admin)
  // Modifică doar această parte în handleUpload:
const { data: newPost, error: dbError } = await supabase
  .from("posts")
  .insert([{ 
    title, 
    image_url: urlData.publicUrl, 
    project_name: decodedName,
    // Comentează linia de mai jos dacă baza de date face figuri:
    // author_email: user.email 
  }])
  .select();

      if (dbError) throw dbError;

      setPosts([newPost[0], ...posts]);
      setShowForm(false);
      setTitle("");
      setFile(null);
    } catch (error: any) {
      alert("Eroare la încărcare: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-white">
      <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">Accesare baza de date...</p>
    </div>
  );

  if (projectExists === false) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center">
          <h1 className="text-[15rem] font-black text-white/5 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 -z-10">404</h1>
          <h2 className="text-6xl font-black text-white mb-4 tracking-tighter transition-all italic">PROIECT INEXISTENT</h2>
          <p className="text-slate-500 mb-10 text-xl tracking-tight">Sesiunea <span className="text-white font-mono">/{decodedName}</span> nu a fost găsită.</p>
          <Link href="/" className="bg-white text-black px-12 py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95">Treci la căutare</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 h-24 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-950 text-white hover:bg-indigo-600 transition-all font-bold">←</Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 capitalize tracking-tighter">{decodedName}</h1>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{posts.length} RESURSE ÎNCĂRCATE</p>
            </div>
          </div>

          {user && (
            <button 
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-slate-950 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-3"
            >
              <span className="text-xl">+</span> POSTARE NOUĂ
            </button>
          )}
        </div>
      </header>

      {/* GALERIE MASONRY */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="break-inside-avoid bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200/60 group hover:shadow-2xl transition-all duration-500 relative">
              <div className="relative overflow-hidden">
                <img src={post.image_url} alt={post.title} className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-8 flex flex-col justify-end">
                   <p className="text-white font-black text-xl italic tracking-tighter">{post.title}</p>
                   {post.author_email && <p className="text-indigo-400 text-[10px] font-bold mt-2 uppercase">De la: {post.author_email.split('@')[0]}</p>}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-slate-900 font-bold tracking-tight truncate">{post.title}</h3>
                <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest italic">Data: {new Date(post.created_at).toLocaleDateString('ro-RO')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL FORMULAR */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => !uploading && setShowForm(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-slate-950 italic tracking-tighter leading-none">ADAUGĂ ÎN /{decodedName}</h2>
              <button onClick={() => setShowForm(false)} className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 hover:bg-slate-950 hover:text-white transition-all">✕</button>
            </div>

            <form onSubmit={handleUpload} className="space-y-8">
              {!previewUrl ? (
                <label className="flex flex-col items-center justify-center w-full h-72 border-4 border-dashed border-slate-100 rounded-[2.5rem] cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all group">
                   <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">📥</div>
                   <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Încarcă proiectul (JPG/PNG)</p>
                   <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
              ) : (
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-2xl">
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  <button onClick={() => setFile(null)} className="absolute top-4 right-4 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl text-[10px] font-black hover:bg-red-500 hover:text-white transition-all shadow-xl">SCHIMBĂ IMAGINEA</button>
                </div>
              )}

              <input
                type="text"
                placeholder="Titlul lucrării..."
                className="w-full bg-slate-50 border-none rounded-2xl px-8 py-6 outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900 text-xl shadow-inner"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <button
                type="submit"
                disabled={uploading || !file || !title}
                className="w-full bg-slate-950 text-white py-7 rounded-[2rem] font-black text-xl shadow-2xl disabled:bg-slate-100 disabled:text-slate-300 transition-all flex justify-center items-center gap-4 active:scale-95"
              >
                {uploading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : "PUBLICĂ POSTAREA"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}