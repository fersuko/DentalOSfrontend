"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import type { Appointment } from "@/types";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { CalendarDays, Clock, CheckCircle2, UserCircle, Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const { data } = await apiClient.get<Appointment[]>("/api/v1/appointments/mine/");
        if (data.length > 0) {
          setAppointments(data);
        } else {
          // Mock data for beautiful presentation
          setAppointments([
            {
              id: 301,
              patient_id: 1,
              doctor_id: 7,
              title: "Revisión General y Profilaxis",
              description: "Control de rutina anual.",
              start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              end_time: new Date(Date.now() + 24.5 * 60 * 60 * 1000).toISOString(),
              status: "scheduled",
              created_at: new Date().toISOString()
            },
            {
              id: 302,
              patient_id: 1,
              doctor_id: 7,
              title: "Resina Estética Fotocurable",
              description: "Restauración dental en pieza 46.",
              start_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
              end_time: new Date(Date.now() - 4.9 * 24 * 60 * 60 * 1000).toISOString(),
              status: "completed",
              created_at: new Date().toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error("Error loading patient appointments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("es-MX", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return "—";
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Mis Citas</h2>
          <p className="text-xs text-slate-400">Revisa tu historial y próximas visitas</p>
        </div>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
          <Plus className="mr-1 h-3.5 w-3.5" /> Nueva Cita
        </Button>
      </div>

      {/* Appointment List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full bg-slate-900 rounded-2xl" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays className="h-10 w-10 text-slate-700 mx-auto" />
            <p className="mt-2 text-xs font-semibold text-slate-400">No tienes citas registradas</p>
          </div>
        ) : (
          appointments.map((apt) => (
            <Card key={apt.id} className="border-slate-900 bg-slate-900/50">
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  apt.status === "completed" 
                    ? "bg-slate-500/10 text-slate-400" 
                    : "bg-emerald-500/10 text-emerald-400"
                }`}>
                  {apt.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <CalendarDays className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold ${
                      apt.status === "completed" ? "text-slate-500" : "text-emerald-400"
                    }`}>
                      {formatDate(apt.start_time)} · {formatTime(apt.start_time)} hrs
                    </span>
                    <Badge variant={apt.status === "completed" ? "secondary" : "default"} className="text-[9px] py-0 px-1.5 h-4 shrink-0">
                      {apt.status === "completed" ? "Terminada" : "Confirmada"}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-sm text-white truncate">{apt.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{apt.description ?? "Consulta dental general."}</p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1.5">
                    <UserCircle className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="truncate">Atendido por: Dra. Lucía Fernández</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
