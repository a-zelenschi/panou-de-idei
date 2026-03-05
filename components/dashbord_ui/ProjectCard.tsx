interface ProjectCardProps {
  project: { id:number, name:string }
  setModal: (val:any) => void
}

export default function ProjectCard({ project, setModal }: ProjectCardProps) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 transition">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">{project.name}</h3>
        <button
          onClick={()=>setModal({...project, mode:"edit"})}
          className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-100"
        >
          Edit
        </button>
      </div>
    </div>
  )
}
