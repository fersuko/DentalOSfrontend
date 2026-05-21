"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SuperadminSidebar } from "@/components/superadmin/Sidebar";
import { SuperadminHeader } from "@/components/superadmin/Header";
import {
  SidebarProvider,
  SidebarInset,
} from "@workspace/ui/components/sidebar";
import { Loader2 } from "lucide-react";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (user?.role !== "superadmin") {
        // Enforce superadmin access (other roles go back to default dashboard)
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-sm text-slate-400">Iniciando Consola Suprema…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "superadmin") {
    return null;
  }

  return (
    <SidebarProvider>
      <SuperadminSidebar />
      <SidebarInset className="bg-slate-950/20 text-slate-100">
        <SuperadminHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-slate-950/10">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
