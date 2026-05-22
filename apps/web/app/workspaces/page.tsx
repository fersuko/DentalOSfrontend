"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace, Workspace } from "@/context/WorkspaceContext";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  CrosshairIcon as ToothIcon,
  Loader2,
  Building2,
  LogOut,
  Stethoscope,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";

export default function WorkspacesPage() {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const { workspaces, activeWorkspace, switchWorkspace, isLoading: workspaceLoading } = useWorkspace();
  const router = useRouter();
  const [selectingId, setSelectingId] = useState<number | null>(null);

  // Redirection guard if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // If there is an active workspace, and they navigated here manually, let them switch,
  // but if there's only 1 workspace and it was auto-selected, the guard in WorkspaceContext
  // will redirect them away. So they only stay here if they have multiple workspaces.

  if (authLoading || workspaceLoading) {
    return (
      <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
        <div className="flex flex-col items-center gap-4 text-white">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          <p className="text-sm text-slate-400">Cargando tus clínicas y consultorios…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSelect = async (workspaceId: number) => {
    setSelectingId(workspaceId);
    try {
      await switchWorkspace(workspaceId);
    } catch (err) {
      console.error(err);
    } finally {
      setSelectingId(null);
    }
  };

  // Helper to render role badge with style
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "superadmin":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
            <ShieldAlert className="h-3 w-3" />
            Administrador Global
          </span>
        );
      case "doctor":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-400 border border-purple-500/20">
            <Stethoscope className="h-3 w-3" />
            Dentista Especialista
          </span>
        );
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 border border-blue-500/20">
            <Building2 className="h-3 w-3" />
            Administrador Clínico
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-medium text-slate-400 border border-slate-500/20">
            Personal Clínico
          </span>
        );
    }
  };

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      {/* Background decoration orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-20 top-20 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -right-20 top-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <Card
        id="workspace-selector-card"
        className="relative z-10 w-full max-w-xl border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl text-white"
      >
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/25">
            <ToothIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Espacio de Trabajo
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-slate-300">
              Hola, <span className="font-semibold text-cyan-400">{user?.full_name}</span>. Por favor selecciona a qué clínica o consultorio deseas acceder para esta sesión.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {workspaces.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-slate-400">
              <Building2 className="mx-auto h-8 w-8 text-slate-500 mb-2 animate-pulse" />
              <p className="text-sm">No se encontraron espacios de trabajo asociados a tu cuenta.</p>
              <p className="text-xs text-slate-500 mt-1">Contacta a soporte técnico para verificar tus accesos.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {workspaces.map((workspace: Workspace) => {
                const isActive = activeWorkspace?.id === workspace.id;
                const isSelecting = selectingId === workspace.id;

                return (
                  <button
                    key={workspace.id}
                    onClick={() => handleSelect(workspace.id)}
                    disabled={selectingId !== null}
                    className={`group relative flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                      isActive
                        ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/5"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    } ${selectingId !== null && !isSelecting ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-200 ${
                          isActive
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                        }`}
                      >
                        <Building2 className="h-5.5 w-5.5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-100 transition-colors group-hover:text-white">
                          {workspace.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {renderRoleBadge(workspace.role)}
                          {isActive && (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                              Activo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelecting ? (
                        <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <Button
              variant="ghost"
              onClick={() => logout()}
              className="text-xs text-slate-400 hover:text-white hover:bg-white/5 px-3 py-1.5 gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              Cerrar Sesión
            </Button>
            <span className="text-[10px] text-slate-500">DentalOS · Aislamiento Clínico Activo</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
