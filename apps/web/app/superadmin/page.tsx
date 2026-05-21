"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  TrendingUp,
  Building2,
  Users,
  CreditCard,
  Crown,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle,
  Sliders,
  DollarSign,
  Activity,
  Receipt
} from "lucide-react";
import { toast } from "sonner";

interface Clinic {
  id: number;
  name: string;
  subdomain: string;
  plan: "Básico" | "Profesional" | "Premium";
  status: "active" | "overdue" | "paused";
  doctorsCount: number;
  patientsCount: number;
  lastPayment: string;
}

export default function SuperadminPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Real high-fidelity SaaS clinics state
  const [clinics, setClinics] = useState<Clinic[]>([
    {
      id: 1,
      name: "Clínica Dental Ruiz",
      subdomain: "ruiz.dentalos.com",
      plan: "Profesional",
      status: "active",
      doctorsCount: 8,
      patientsCount: 1240,
      lastPayment: "2026-05-10"
    },
    {
      id: 2,
      name: "OdontoEspecialistas México",
      subdomain: "odontoesp.dentalos.com",
      plan: "Premium",
      status: "overdue",
      doctorsCount: 15,
      patientsCount: 3820,
      lastPayment: "2026-04-01" // Overdue!
    },
    {
      id: 3,
      name: "Dental Center Guadalajara",
      subdomain: "dentalgdl.dentalos.com",
      plan: "Básico",
      status: "active",
      doctorsCount: 2,
      patientsCount: 450,
      lastPayment: "2026-05-14"
    },
    {
      id: 4,
      name: "Smile Factory Monterrey",
      subdomain: "smilemty.dentalos.com",
      plan: "Profesional",
      status: "paused",
      doctorsCount: 6,
      patientsCount: 980,
      lastPayment: "2026-03-15"
    }
  ]);

  const handleAction = (clinicId: number, newStatus: "active" | "paused") => {
    setClinics(prev => prev.map(c => c.id === clinicId ? { ...c, status: newStatus } : c));
    toast.success(`Estado de la clínica actualizado exitosamente`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/15">Activo (Pagado)</Badge>;
      case "overdue":
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/15 flex items-center gap-1 shrink-0"><AlertTriangle className="h-3 w-3" /> Pago Vencido</Badge>;
      case "paused":
        return <Badge variant="secondary" className="bg-slate-500/15 text-slate-400 border-slate-700/30">Suspendido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredClinics = clinics.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subdomain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Global Executive Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 md:p-8 text-white border border-amber-500/10 shadow-xl shadow-amber-500/5">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white blur-2xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-amber-500 blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-500">
              <Crown className="h-3.5 w-3.5 animate-pulse" /> Consola Suprema SaaS Activa
            </span>
            <h1 className="mt-2 text-2xl md:text-3xl font-black tracking-wider text-slate-100 uppercase">
              Consola Master de Control
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Gestiona planes de facturación, suscripciones de clínicas y métricas financieras globales de **DentalOS**.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold border-none shadow-md">
              <Plus className="mr-1.5 h-4 w-4" /> Registrar Clínica Nueva
            </Button>
          </div>
        </div>
      </div>

      {/* SaaS Global Financial KPI Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-amber-500/10 bg-slate-900/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              SaaS MRR (Ingreso Mensual)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-100">$14,850 USD</div>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +12.4% este mes
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/10 bg-slate-900/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Clínicas Registradas
            </CardTitle>
            <Building2 className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-100">{clinics.length} Activas</div>
            <p className="text-[11px] text-slate-400 mt-1">
              48 clínicas en total en producción
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/10 bg-slate-900/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Usuarios Totales
            </CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-100">12,450</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Doctores, asistentes y pacientes
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/10 bg-slate-900/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tasa de Retención
            </CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-100">98.2%</div>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">
              Suscripciones sanas recurrentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans Configuration */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1">
          <Crown className="h-4 w-4 text-amber-500" /> Matriz de Planes SaaS DentalOS
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Plan Básico */}
          <Card className="border-slate-800 bg-slate-900/30">
            <CardContent className="p-5 space-y-4 text-left">
              <div className="space-y-1">
                <Badge className="bg-slate-800 text-slate-400 border-none text-[10px]">Plan Inicial</Badge>
                <h4 className="text-lg font-black text-white">Plan Básico</h4>
                <p className="text-xs text-slate-400">Excelente para consultorios individuales.</p>
              </div>
              <div className="text-2xl font-black text-white">$99 <span className="text-xs font-medium text-slate-500">USD/mes</span></div>
              <ul className="text-xs space-y-1.5 text-slate-400 border-t border-slate-900 pt-3">
                <li className="flex items-center gap-1.5">✓ Hasta 3 Doctores</li>
                <li className="flex items-center gap-1.5">✓ Gestión de Agenda</li>
                <li className="flex items-center gap-1.5">✓ Historias Clínicas</li>
              </ul>
            </CardContent>
          </Card>

          {/* Plan Profesional */}
          <Card className="border-amber-500/20 bg-amber-500/5 ring-1 ring-amber-500/10">
            <CardContent className="p-5 space-y-4 text-left">
              <div className="space-y-1">
                <Badge className="bg-amber-500/20 text-amber-500 border-none text-[10px] font-bold">Más Popular</Badge>
                <h4 className="text-lg font-black text-white">Plan Profesional</h4>
                <p className="text-xs text-slate-400">Para clínicas odontológicas medianas.</p>
              </div>
              <div className="text-2xl font-black text-white">$199 <span className="text-xs font-medium text-slate-500">USD/mes</span></div>
              <ul className="text-xs space-y-1.5 text-slate-400 border-t border-slate-900 pt-3">
                <li className="flex items-center gap-1.5">✓ Hasta 10 Doctores</li>
                <li className="flex items-center gap-1.5">✓ **Odontograma Interactivo**</li>
                <li className="flex items-center gap-1.5">✓ Alertas de Alergias</li>
              </ul>
            </CardContent>
          </Card>

          {/* Plan Premium */}
          <Card className="border-slate-800 bg-slate-900/30">
            <CardContent className="p-5 space-y-4 text-left">
              <div className="space-y-1">
                <Badge className="bg-slate-800 text-slate-400 border-none text-[10px]">Empresarial</Badge>
                <h4 className="text-lg font-black text-white">Plan Premium</h4>
                <p className="text-xs text-slate-400">Para clínicas grandes y redes dentales.</p>
              </div>
              <div className="text-2xl font-black text-white">$399 <span className="text-xs font-medium text-slate-500">USD/mes</span></div>
              <ul className="text-xs space-y-1.5 text-slate-400 border-t border-slate-900 pt-3">
                <li className="flex items-center gap-1.5">✓ Doctores ilimitados</li>
                <li className="flex items-center gap-1.5">✓ **PWA Móvil de Pacientes**</li>
                <li className="flex items-center gap-1.5">✓ Radiografías en la Nube</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interactive Clinic Management Explorer */}
      <Card className="border-slate-800 bg-slate-900/20 backdrop-blur-md">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-1.5 text-slate-100">
                <Building2 className="h-4 w-4 text-amber-500" /> Explorador de Clínicas Odontológicas
              </CardTitle>
              <CardDescription>Revisa el estado de la suscripción y realiza acciones master.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar clínica o dominio..."
                className="pl-9 bg-slate-900/50 border-slate-800 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-900">
            <Table>
              <TableHeader className="bg-slate-900/40">
                <TableRow className="border-slate-900">
                  <TableHead className="text-slate-400">Clínica</TableHead>
                  <TableHead className="text-slate-400 hidden sm:table-cell">Subdominio</TableHead>
                  <TableHead className="text-slate-400">Plan</TableHead>
                  <TableHead className="text-slate-400">Uso</TableHead>
                  <TableHead className="text-slate-400">Estado Pago</TableHead>
                  <TableHead className="text-slate-400 text-right">Acciones Master</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClinics.map((clinic) => (
                  <TableRow key={clinic.id} className="border-slate-900 hover:bg-slate-900/20">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 font-bold text-xs border border-amber-500/20">
                          {clinic.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-100">{clinic.name}</p>
                          <span className="text-[10px] text-slate-500 sm:hidden">{clinic.subdomain}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-xs font-semibold text-slate-400">{clinic.subdomain}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-amber-500/10 text-amber-500 bg-amber-500/5 text-[10px] font-bold">
                        {clinic.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-slate-400 space-y-0.5">
                        <span className="block font-medium">Docs: {clinic.doctorsCount}</span>
                        <span className="block font-medium">Pacientes: {clinic.patientsCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(clinic.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {clinic.status === "paused" ? (
                        <Button 
                          onClick={() => handleAction(clinic.id, "active")}
                          size="sm" 
                          variant="outline" 
                          className="text-[10px] border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 font-bold h-7"
                        >
                          Reactivar
                        </Button>
                      ) : (
                        <div className="flex justify-end gap-1.5">
                          <Button 
                            onClick={() => handleAction(clinic.id, "paused")}
                            size="sm" 
                            variant="outline" 
                            className="text-[10px] border-rose-500/20 text-rose-400 hover:bg-rose-500/10 font-bold h-7"
                          >
                            Pausar
                          </Button>
                          <Button 
                            onClick={() => toast.success("Recordatorio de pago enviado por WhatsApp")}
                            size="sm" 
                            variant="outline" 
                            className="text-[10px] border-amber-500/20 text-amber-500 hover:bg-amber-500/10 font-bold h-7"
                          >
                            Cobrar
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
