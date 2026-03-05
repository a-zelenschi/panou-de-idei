const filters = [
  { name: "All Projects", count: 24 },
  { name: "Active", count: 12 },
  { name: "Completed", count: 8 },
  { name: "Archived", count: 4 },
]

interface SidebarProps {
  active: string
  setActive: (name: string) => void
}

export default function Sidebar({ active, setActive }: SidebarProps) {
  return (
    <aside className="w-64 sticky top-0 border-r border-gray-200 hidden md:flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50">
        <h2 className="text-sm font-medium">Filters</h2>
      </div>

      <div className="p-2 space-y-1">
        {filters.map(item => (
          <button
            key={item.name}
            onClick={()=>setActive(item.name)}
            className={`
              w-full flex justify-between items-center
              px-3 py-2 text-sm
              border border-gray-200
              rounded
              shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)]
              transition
              ${active === item.name
                ? "bg-gray-200"
                : "bg-white hover:bg-gray-100"}
            `}
          >
            <span>{item.name}</span>
            <span className="text-xs text-gray-500">{item.count}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
