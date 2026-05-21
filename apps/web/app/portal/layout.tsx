"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Home, Calendar, ClipboardCheck, User, LogOut } from "lucide-react";
import Link from "next/link";

export default function PatientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (user?.role !== "patient" && user?.role !== "admin") {
        // Admins can preview everything
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-sm text-slate-400">Iniciando Portal Dental…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== "patient" && user?.role !== "admin")) {
    return null;
  }

  const bottomNavItems = [
    { title: "Inicio", href: "/portal", icon: Home },
    { title: "Mis Citas", href: "/portal/appointments", icon: Calendar },
    { title: "Expediente", href: "/portal/records", icon: ClipboardCheck },
    { title: "Mi Perfil", href: "/portal/profile", icon: User },
  ];

  return (
    <div className="min-h-svh flex flex-col bg-slate-950 text-slate-100 max-w-md mx-auto relative shadow-2xl border-x border-slate-900">
      {/* Top microheader */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-900 bg-slate-950/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400">
            <span className="text-xs font-bold text-slate-950">D</span>
          </div>
          <span className="text-sm font-bold tracking-wider text-slate-200">DentalOS Portal</span>
        </div>
        
        <button 
          onClick={logout}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-900 text-slate-400 hover:text-red-400 transition-colors"
          title="Cerrar Sesión"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      {/* Dynamic Mobile View Area */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4 space-y-6">
        {children}
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto border-t border-slate-900 bg-slate-950/95 backdrop-blur-lg px-2 py-2.5 shadow-lg">
        <div className="flex justify-around items-center">
          {bottomNavItems.map((item) => {
            const isActive = item.href === "/portal" 
              ? pathname === "/portal"
              : pathname.startsWith(item.href);
              
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                  isActive 
                    ? "text-emerald-400 bg-emerald-500/10 font-bold" 
                    : "text-slate-500 hover:text-slate-300 font-medium"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px]">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
