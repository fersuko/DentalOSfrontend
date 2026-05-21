"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/apiClient";
import type { Appointment } from "@/types";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  CalendarDays,
  Clock,
  MapPin,
  ClipboardCheck,
  Stethoscope,
  Smile,
  Info,
  PhoneCall,
  Download
} from "lucide-react";
import Link from "next/link";

export default function PatientPortalHomePage() {
  const { user } = useAuth();
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for PWA installation prompt
    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
      });
    }

    async function fetchPatientData() {
      try {
        // Query endpoints, falls back to mock if needed
        const { data } = await apiClient.get<Appointment[]>("/api/v1/appointments/mine/");
        if (data && data.length > 0 && data[0]) {
          setNextAppointment(data[0]);
        } else {
          // Provide high-fidelity mock appointment for patient portal demo
          setNextAppointment({
            id: 301,
            patient_id: 1,
            doctor_id: 7,
            title: "Revisión General y Profilaxis",
            description: "Control de rutina anual con Dra. Lucía Fernández.",
            start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            end_time: new Date(Date.now() + 24.5 * 60 * 60 * 1000).toISOString(),
            status: "scheduled",
            created_at: new Date().toISOString(),
            doctor: {
              id: 8,
              username: "doctor_lucia",
              email: "lucia@example.com",
              full_name: "Dra. Lucía Fernández",
              role: "doctor",
              is_active: true,
              created_at: ""
            }
          });
        }
      } catch (err) {
        console.error("Error loading patient portal details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPatientData();
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Patient installed DentalOS PWA");
        }
        setDeferredPrompt(null);
      });
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    } catch {
      return "Fecha no definida";
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
      {/* Patient Greeting & Smile Banner */}
      <div className="flex items-center justify-between bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-5 rounded-2xl border border-emerald-500/10">
        <div className="space-y-1">
          <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Tu Portal Odontológico</p>
          <h2 className="text-xl font-black text-white">¡Hola, {user?.full_name ?? "Paciente"}!</h2>
          <p className="text-xs text-slate-400">Mantén una sonrisa sana todos los días.</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10">
          <Smile className="h-6 w-6" />
        </div>
      </div>

      {/* PWA Install Promotion Card */}
      {deferredPrompt && (
        <Card className="bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 border-none shadow-xl">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-sm">Descarga la App de la Clínica</p>
              <p className="text-[11px] text-slate-900 font-medium">Agrégala a tu escritorio para ver tus citas rápido.</p>
            </div>
            <Button size="sm" onClick={handleInstallClick} className="bg-slate-950 text-white hover:bg-slate-900 border-none text-xs font-bold shrink-0">
              <Download className="mr-1 h-3.5 w-3.5" /> Instalar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Next Appointment Dashboard Card */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Tu Próxima Cita</h3>
        
        {loading ? (
          <div className="h-44 w-full rounded-2xl bg-slate-900 animate-pulse" />
        ) : nextAppointment ? (
          <Card className="border-emerald-500/20 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-lg">
            <div className="bg-emerald-500/10 px-4 py-2 border-b border-emerald-500/10 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Próximamente
              </span>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-[10px]">
                Confirmada
              </Badge>
            </div>
            
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1">
                <h4 className="font-black text-base text-white">{nextAppointment.title}</h4>
                <p className="text-xs text-slate-400">{nextAppointment.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-900 text-xs">
                <div className="space-y-1 text-slate-400">
                  <span className="block text-[10px] uppercase text-slate-500 font-bold">Fecha</span>
                  <span className="font-semibold text-slate-200 capitalize">{formatDate(nextAppointment.start_time)}</span>
                </div>
                <div className="space-y-1 text-slate-400">
                  <span className="block text-[10px] uppercase text-slate-500 font-bold">Horario</span>
                  <span className="font-semibold text-slate-200">{formatTime(nextAppointment.start_time)} hrs</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-900 text-xs text-slate-400">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Consultorio 2 · Dra. Lucía Fernández</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-900 bg-slate-900/40 p-6 text-center rounded-2xl">
            <CalendarDays className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="mt-2 text-xs font-semibold text-slate-400">No tienes citas próximas agendadas</p>
            <Button size="sm" variant="outline" className="mt-3 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 text-xs">
              Solicitar Nueva Cita
            </Button>
          </Card>
        )}
      </div>

      {/* Active Medical Guidelines Card */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Indicaciones Activas</h3>
        <Card className="border-slate-900 bg-slate-900/40">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-900">
              <ClipboardCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-left space-y-0.5">
                <p className="text-xs font-bold text-white">Profilaxis & Limpieza Dental</p>
                <p className="text-[11px] text-slate-400">Evitar alimentos con colorantes intensos (vino, café, salsas) durante 24 horas.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-900">
              <Stethoscope className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-left space-y-0.5">
                <p className="text-xs font-bold text-white">Higiene Diaria Reforzada</p>
                <p className="text-[11px] text-slate-400">Utilizar hilo dental y enjuague bucal sin alcohol después de cada cepillado.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dental Care Tip & Emergency Call */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/30 border border-slate-900 p-3 rounded-2xl text-center space-y-1.5">
          <Info className="h-4 w-4 text-emerald-500 mx-auto" />
          <h5 className="text-[11px] font-bold text-slate-200">Tip de Cuidado</h5>
          <p className="text-[10px] text-slate-500 leading-normal">
            Cambia tu cepillo de dientes cada 3 meses para asegurar una limpieza efectiva.
          </p>
        </div>

        <a href="tel:+525550123" className="bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 p-3 rounded-2xl text-center space-y-1.5 flex flex-col justify-center items-center group transition-all">
          <PhoneCall className="h-4 w-4 text-rose-500 group-hover:scale-110 transition-transform" />
          <h5 className="text-[11px] font-bold text-rose-400">Urgencia Médica</h5>
          <p className="text-[10px] text-rose-500/80 leading-normal">
            Llamar directo al consultorio de guardia
          </p>
        </a>
      </div>
    </div>
  );
}
