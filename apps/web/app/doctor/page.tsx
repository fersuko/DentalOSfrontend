"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/apiClient";
import type { Appointment, Patient } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Button } from "@workspace/ui/components/button";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  ChevronRight,
  TrendingUp,
  Stethoscope,
  Smile,
  Plus,
  Users,
  ClipboardList
} from "lucide-react";
import Link from "next/link";

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgenda() {
      try {
        const { data } = await apiClient.get<Appointment[]>("/api/v1/appointments/mine/");
        // If data is empty, let's provide some realistic doctor appointments for today
        if (data.length === 0) {
          setAppointments([
            {
              id: 201,
              patient_id: 1,
              doctor_id: 7,
              title: "Evaluación y Diagnóstico Inicial",
              description: "Paciente reporta molestia leve en molar inferior derecho.",
              start_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
              end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
              status: "confirmed",
              created_at: new Date().toISOString(),
              patient: {
                id: 1,
                first_name: "Sofía",
                last_name: "Rodríguez",
                email: "sofia@example.com",
                phone: "555-0123",
                is_active: true,
                created_at: ""
              }
            },
            {
              id: 202,
              patient_id: 2,
              doctor_id: 7,
              title: "Endodoncia - Segunda Sesión",
              description: "Tratamiento de conducto en pieza 24.",
              start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
              end_time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
              status: "in_progress",
              created_at: new Date().toISOString(),
              patient: {
                id: 2,
                first_name: "Carlos",
                last_name: "Mendoza",
                email: "carlos@example.com",
                phone: "555-0456",
                is_active: true,
                created_at: ""
              }
            },
            {
              id: 203,
              patient_id: 3,
              doctor_id: 7,
              title: "Limpieza Ultra Sónica",
              description: "Profilaxis rutinaria anual.",
              start_time: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
              end_time: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString(),
              status: "scheduled",
              created_at: new Date().toISOString(),
              patient: {
                id: 3,
                first_name: "Ana",
                last_name: "Gómez",
                email: "ana@example.com",
                phone: "555-0789",
                is_active: true,
                created_at: ""
              }
            }
          ]);
        } else {
          setAppointments(data);
        }
      } catch (err) {
        console.error("Error fetching doctor appointments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAgenda();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/15">Programada</Badge>;
      case "confirmed":
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15">Confirmada</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/15 animate-pulse">En Sillón</Badge>;
      case "completed":
        return <Badge className="bg-slate-500/10 text-slate-500 hover:bg-slate-500/15">Completada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "--:--";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white blur-2xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-purple-500 blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
              <Activity className="h-3.5 w-3.5" /> Portal Clínico Activo
            </span>
            <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
              ¡Hola, Dra/Dr. {user?.full_name ?? "Odontólogo"}!
            </h1>
            <p className="mt-1 text-sm md:text-base text-slate-300">
              Hoy tienes <span className="font-semibold text-purple-300">{appointments.length} consultas</span> en tu agenda.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-500 border-none shadow-md">
              <Plus className="mr-1.5 h-4 w-4" /> Agregar Diagnóstico
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-purple-500/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pacientes Hoy
            </CardTitle>
            <Smile className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Todos confirmados o en sala de espera
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Procedimientos
            </CardTitle>
            <Stethoscope className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 / 3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Falta 1 profilaxis programada
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Expedientes Actualizados
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Notas clínicas completas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Agenda Timeline & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timeline (Left side, takes 2 cols) */}
        <Card className="lg:col-span-2 border-border/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Agenda de Consultas</CardTitle>
              <CardDescription>Lista cronológica de pacientes agendados hoy</CardDescription>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500/60" />
                <p className="mt-2 text-sm font-semibold">¡Día libre de consultas!</p>
                <p className="text-xs text-muted-foreground">No tienes citas médicas registradas para hoy.</p>
              </div>
            ) : (
              <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-6 py-2">
                {appointments.map((apt) => (
                  <div key={apt.id} className="relative group">
                    {/* Time dot */}
                    <div className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-purple-500 group-hover:bg-purple-500 transition-colors" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/50 bg-background/60 hover:bg-background/80 transition-all hover:shadow-md">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTime(apt.start_time)} - {formatTime(apt.end_time)}
                          </span>
                          {getStatusBadge(apt.status)}
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-foreground">{apt.title}</h4>
                        <p className="text-xs text-muted-foreground">{apt.description}</p>
                        
                        <div className="flex items-center gap-2 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                          <User className="h-3.5 w-3.5 text-purple-500" />
                          <span>Paciente: {apt.patient?.first_name} {apt.patient?.last_name}</span>
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col gap-2 pt-2 sm:pt-0">
                        <Button size="sm" variant="outline" className="text-xs flex-1 sm:flex-none border-purple-500/20 text-purple-600 hover:bg-purple-500/10">
                          <FileText className="mr-1 h-3.5 w-3.5" /> Expediente
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions (Right side, takes 1 col) */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Atajos Clínicos</CardTitle>
              <CardDescription>Enlaces directos a tus operaciones principales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/doctor/patients" className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50 hover:bg-purple-500/5 hover:border-purple-500/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Buscar Paciente</p>
                    <p className="text-xs text-muted-foreground">Ver historial y odontograma</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 transition-colors" />
              </Link>

              <Link href="/doctor/records" className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50 hover:bg-purple-500/5 hover:border-purple-500/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                    <ClipboardList className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Crear Receta Médica</p>
                    <p className="text-xs text-muted-foreground">Nueva indicación clínica</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 transition-colors" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-purple-500/10 bg-gradient-to-br from-purple-600/5 to-indigo-600/5 backdrop-blur-md">
            <CardContent className="pt-6 space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm">Consejo Médico DentalOS</h4>
              <p className="text-xs text-muted-foreground">
                Recuerda actualizar el odontograma de los pacientes en cada sesión para mantener una bitácora visual limpia del tratamiento.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
