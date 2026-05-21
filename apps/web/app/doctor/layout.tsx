"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DoctorSidebar } from "@/components/doctor/Sidebar";
import { DoctorHeader } from "@/components/doctor/Header";
import {
  SidebarProvider,
  SidebarInset,
} from "@workspace/ui/components/sidebar";
import { Loader2 } from "lucide-react";

export default function DoctorLayout({
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
      } else if (user?.role !== "doctor" && user?.role !== "admin") {
        // Enforce doctor or admin access (admins can preview everything)
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-sm text-muted-foreground">Iniciando Portal Clínico…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== "doctor" && user?.role !== "admin")) {
    return null;
  }

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset>
        <DoctorHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-950/20">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
