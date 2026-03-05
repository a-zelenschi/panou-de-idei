// 1. Definim tipul pentru datele de profil (poți folosi 'any' temporar dacă te grăbești)
interface HeaderBarProps {
  search: string;
  setSearch: (value: string) => void;
  setModal: (value: any) => void;
  adminData?: any; // <--- ACEASTA ESTE LINIA LIPSA
}

// 2. Aplicăm interfața pe funcție
export default function HeaderBar({ search, setSearch, setModal, adminData }: HeaderBarProps) {
  return (
    <header className="flex justify-between items-center p-4 bg-white border-b">
      <div className="flex items-center gap-4">
        <input 
          type="text" 
          placeholder="Caută proiect..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Acum poți folosi datele adminului aici */}
        {adminData && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-700">{adminData.full_name}</span>
           
            {adminData.email && (
              <span className="block font-bold text-indigo-600 text-center">Bine ai venit:<br/> <span className="text-black"> {adminData.email}</span> </span>
            )}
          </div>
        )}
        
        <button 
          onClick={() => setModal({ mode: 'add' })}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold"
        >
          + Proiect Nou
        </button>
      </div>
    </header>
  );
}