"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/apiClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Users,
  CalendarDays,
  CalendarCheck,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import type { DashboardStats, Appointment, Patient } from "@/types";
import Link from "next/link";

// ── Stat card component ─────────────────────────────────────
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  loading,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  gradient: string;
  loading: boolean;
}) {
  return (
    <Card className="relative overflow-hidden border-border/50 transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${gradient}`}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// ── Status badge color map ──────────────────────────────────
const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  scheduled: { label: "Programada", variant: "outline" },
  confirmed: { label: "Confirmada", variant: "default" },
  in_progress: { label: "En curso", variant: "secondary" },
  completed: { label: "Completada", variant: "default" },
  cancelled: { label: "Cancelada", variant: "destructive" },
  no_show: { label: "No asistió", variant: "destructive" },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await apiClient.get<DashboardStats>(
          "/api/v1/dashboard/stats",
        );
        setStats(data);
      } catch {
        // If endpoint doesn't exist yet, use placeholder
        setStats({
          total_patients: 0,
          total_appointments_today: 0,
          total_appointments_week: 0,
          total_revenue_month: 0,
          upcoming_appointments: [],
          recent_patients: [],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Pacientes Totales",
      value: stats?.total_patients ?? 0,
      description: "Pacientes registrados",
      icon: Users,
      gradient: "bg-gradient-to-br from-blue-600 to-blue-400",
    },
    {
      title: "Citas Hoy",
      value: stats?.total_appointments_today ?? 0,
      description: "Citas programadas para hoy",
      icon: CalendarDays,
      gradient: "bg-gradient-to-br from-emerald-600 to-emerald-400",
    },
    {
      title: "Citas esta Semana",
      value: stats?.total_appointments_week ?? 0,
      description: "Total de la semana actual",
      icon: CalendarCheck,
      gradient: "bg-gradient-to-br from-violet-600 to-violet-400",
    },
    {
      title: "Ingresos del Mes",
      value: `$${(stats?.total_revenue_month ?? 0).toLocaleString("es-MX")}`,
      description: "Facturación del mes actual",
      icon: TrendingUp,
      gradient: "bg-gradient-to-br from-amber-600 to-amber-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resumen general de la clínica — Bienvenido,{" "}
          {user?.full_name?.split(" ")[0]}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} loading={loading} />
        ))}
      </div>

      {/* Two-column section */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Upcoming appointments */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Próximas Citas</CardTitle>
              <CardDescription>Citas programadas para hoy</CardDescription>
            </div>
            <Link
              href="/dashboard/appointments"
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-400 transition-colors"
            >
              Ver todas <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (stats?.upcoming_appointments?.length ?? 0) === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarDays className="h-10 w-10 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No hay citas próximas
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.upcoming_appointments?.slice(0, 5).map((apt: Appointment) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{apt.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(apt.start_time).toLocaleTimeString("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(apt.end_time).toLocaleTimeString("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        statusConfig[apt.status]?.variant ?? "outline"
                      }
                    >
                      {statusConfig[apt.status]?.label ?? apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent patients */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Pacientes Recientes</CardTitle>
              <CardDescription>Últimos pacientes registrados</CardDescription>
            </div>
            <Link
              href="/dashboard/patients"
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-400 transition-colors"
            >
              Ver todos <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (stats?.recent_patients?.length ?? 0) === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-10 w-10 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No hay pacientes registrados
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.recent_patients?.slice(0, 5).map((patient: Patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-bold text-white">
                      {(patient.first_name && patient.first_name[0]) || ""}
                      {(patient.last_name && patient.last_name[0]) || ""}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">
                        {patient.first_name || ""} {patient.last_name || ""}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {patient.phone ?? patient.email ?? "Sin contacto"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
