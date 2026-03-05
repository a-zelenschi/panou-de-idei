// app/dashboard/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";

// Simulăm un check simplu de autentificare
const isAuthenticated = () => {
  // În realitate aici ai verifica token-ul sau sesiunea
  return true; // schimbă pe `false` pentru test
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    // redirecționează către login dacă nu e autentificat
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </header>
      <main className="top-0">{children}</main>
      <footer className="bg-gray-200 text-center p-4">
        &copy; 2026 My Dashboard
      </footer>
    </div>
  );
}
