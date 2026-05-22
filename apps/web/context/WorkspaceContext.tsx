"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Cookies from "js-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "./AuthContext";
import apiClient from "@/lib/apiClient";
import type { UserRole } from "@/types";

export interface Workspace {
  id: number;
  name: string;
  role: UserRole;
  status?: string;
}

interface WorkspaceContextType {
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  isLoading: boolean;
  switchWorkspace: (workspaceId: number) => Promise<void>;
  fetchWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Centralized QueryClient for the application
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // ── Fetch available workspaces ──────────────────────────────
  const fetchWorkspaces = useCallback(async () => {
    if (!isAuthenticated) {
      setWorkspaces([]);
      setActiveWorkspace(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.get<Workspace[]>("/api/v1/workspaces/mine");
      const list = response.data || [];
      setWorkspaces(list);

      // Determine active workspace
      const savedTenantId = Cookies.get("tenant_id");
      const savedWorkspaceStr = localStorage.getItem("active_workspace");

      if (savedTenantId && savedWorkspaceStr) {
        try {
          const parsed = JSON.parse(savedWorkspaceStr) as Workspace;
          if (parsed.id === Number(savedTenantId) && list.some((w) => w.id === parsed.id)) {
            setActiveWorkspace(parsed);
            setIsLoading(false);
            return;
          }
        } catch {
          // Ignore parsing errors
        }
      }

      // If no valid saved workspace, check for cookies-only match
      if (savedTenantId) {
        const matched = list.find((w) => w.id === Number(savedTenantId));
        if (matched) {
          setActiveWorkspace(matched);
          localStorage.setItem("active_workspace", JSON.stringify(matched));
          setIsLoading(false);
          return;
        }
      }

      // Autoselect if exactly 1 workspace is available
      if (list.length === 1 && list[0]) {
        const singleWorkspace = list[0];
        Cookies.set("tenant_id", singleWorkspace.id.toString(), {
          expires: 7,
          sameSite: "Lax",
          secure: window.location.protocol === "https:",
        });
        localStorage.setItem("active_workspace", JSON.stringify(singleWorkspace));
        setActiveWorkspace(singleWorkspace);
      } else {
        // Clear workspace state if multiple or none and no selection is active
        setActiveWorkspace(null);
        Cookies.remove("tenant_id");
        localStorage.removeItem("active_workspace");
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      toast.error("No se pudieron cargar tus espacios de trabajo.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  // ── Switch workspace with query cache reset ──────────────────
  const switchWorkspace = useCallback(async (workspaceId: number) => {
    const target = workspaces.find((w) => w.id === workspaceId);
    if (!target) {
      toast.error("El espacio de trabajo seleccionado no es válido.");
      return;
    }

    // 1. Update React state
    setActiveWorkspace(target);

    // 2. Persist in cookies & localStorage
    Cookies.set("tenant_id", target.id.toString(), {
      expires: 7,
      sameSite: "Lax",
      secure: window.location.protocol === "https:",
    });
    localStorage.setItem("active_workspace", JSON.stringify(target));

    // 3. CRITICAL: Reset react-query clinical data cache without page reload
    queryClient.resetQueries({ exact: false, type: "active" });

    toast.success(`Cambiado a: ${target.name}`);

    // 4. Redirect based on role and active route
    if (target.role === "doctor") {
      router.push("/doctor");
    } else if (target.role === "superadmin") {
      router.push("/superadmin");
    } else {
      router.push("/dashboard");
    }
  }, [workspaces, router]);

  // ── Handle WorkspaceContextMissing event ────────────────────
  useEffect(() => {
    const handleContextMissing = () => {
      toast.error("Debes seleccionar un espacio de trabajo para continuar.");
      router.replace("/workspaces");
    };

    window.addEventListener("WorkspaceContextMissing", handleContextMissing);
    return () => {
      window.removeEventListener("WorkspaceContextMissing", handleContextMissing);
    };
  }, [router]);

  // ── Route guard redirection ────────────────────────────────
  useEffect(() => {
    if (authLoading || isLoading) return;

    if (isAuthenticated && user?.role !== "superadmin") {
      const isProtectedRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/doctor") ||
        pathname.startsWith("/portal");

      if (isProtectedRoute && !activeWorkspace) {
        router.replace("/workspaces");
      }
    }
  }, [isAuthenticated, authLoading, isLoading, activeWorkspace, pathname, router, user]);

  const value = useMemo<WorkspaceContextType>(
    () => ({
      activeWorkspace,
      workspaces,
      isLoading,
      switchWorkspace,
      fetchWorkspaces,
    }),
    [activeWorkspace, workspaces, isLoading, switchWorkspace, fetchWorkspaces]
  );

  if ((authLoading || isLoading) && isAuthenticated) {
    const isProtectedRoute =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/doctor") ||
      pathname.startsWith("/portal");

    if (isProtectedRoute && !activeWorkspace) {
      return (
        <div className="flex min-h-svh items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Verificando espacio de trabajo…</p>
          </div>
        </div>
      );
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
    </QueryClientProvider>
  );
}

export function useWorkspace(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
