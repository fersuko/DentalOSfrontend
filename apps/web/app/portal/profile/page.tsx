"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Phone, Mail, MapPin, User, LogOut, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function PatientProfilePage() {
  const { user, logout } = useAuth();

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "P";

  const handleSave = () => {
    toast.success("Perfil actualizado exitosamente");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white">Mi Perfil</h2>
        <p className="text-xs text-slate-400">Verifica y edita tus datos de contacto</p>
      </div>

      {/* Avatar Card */}
      <Card className="border-slate-900 bg-slate-900/50">
        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
          <Avatar className="h-20 w-20 ring-4 ring-emerald-500/20">
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-400 text-slate-950 text-2xl font-black">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <h3 className="font-black text-white text-base">{user?.full_name ?? "Paciente de Prueba"}</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              <CheckCircle className="h-3 w-3" /> Paciente Activo
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Information Checklist */}
      <Card className="border-slate-900 bg-slate-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-slate-300">Datos de Contacto</CardTitle>
          <CardDescription className="text-[11px] text-slate-500">Mantén estos datos actualizados para recibir tus recordatorios.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950/60 text-emerald-400 border border-slate-900">
              <Phone className="h-4 w-4" />
            </div>
            <div className="text-left space-y-0.5">
              <span className="block text-[10px] text-slate-500 uppercase font-semibold">Teléfono</span>
              <span className="font-bold text-slate-200">555-0123</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950/60 text-emerald-400 border border-slate-900">
              <Mail className="h-4 w-4" />
            </div>
            <div className="text-left space-y-0.5">
              <span className="block text-[10px] text-slate-500 uppercase font-semibold">Correo electrónico</span>
              <span className="font-bold text-slate-200">{user?.email ?? "sofia@example.com"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950/60 text-emerald-400 border border-slate-900">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="text-left space-y-0.5">
              <span className="block text-[10px] text-slate-500 uppercase font-semibold">Dirección</span>
              <span className="font-bold text-slate-200">Av. Insurgentes Sur 456, CDMX</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save & Logout Buttons */}
      <div className="space-y-3">
        <Button onClick={handleSave} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-5 rounded-xl shadow-lg shadow-emerald-500/10">
          Guardar Cambios
        </Button>
        
        <Button onClick={logout} variant="outline" className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 font-bold text-xs py-5 rounded-xl">
          <LogOut className="mr-1.5 h-4 w-4" /> Cerrar Sesión Activa
        </Button>
      </div>
    </div>
  );
}
