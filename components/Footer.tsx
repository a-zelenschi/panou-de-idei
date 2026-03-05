import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid md:grid-cols-3 gap-6">

          {/* Logo + descriere */}
          <div>
            <h2 className="text-lg font-bold text-blue-600">
              LOGO
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Aplicatie pentru idei si colaborare.
            </p>
          </div>
          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-2">Contact</h3>
            <p className="text-sm text-gray-600">
              Email: contact@email.com
            </p>
          </div>
            {/* Bottom */}
        <div className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Aplicatia Mea. Toate drepturile rezervate.
        </div>
        </div>
      
      </div>
    </footer>
  )
}
