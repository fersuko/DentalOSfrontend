"use client";

import { useEffect, useState, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import type { Appointment, AppointmentCreate, Patient, User } from "@/types";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  CalendarDays,
  Plus,
  Search,
  Clock,
  Loader2,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }
> = {
  scheduled: { label: "Programada", variant: "outline", color: "text-blue-500" },
  confirmed: { label: "Confirmada", variant: "default", color: "text-emerald-500" },
  in_progress: { label: "En curso", variant: "secondary", color: "text-amber-500" },
  completed: { label: "Completada", variant: "default", color: "text-green-500" },
  cancelled: { label: "Cancelada", variant: "destructive", color: "text-red-500" },
  no_show: { label: "No asistió", variant: "destructive", color: "text-red-400" },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState<AppointmentCreate>({
    patient_id: 0,
    doctor_id: 0,
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    status: "scheduled",
    notes: "",
  });

  const fetchAppointments = useCallback(async () => {
    try {
      const { data } = await apiClient.get<Appointment[]>(
        "/api/v1/appointments/mine/",
        {
          params: {
            search: search || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
          },
        },
      );
      setAppointments(Array.isArray(data) ? data : (data as { items?: Appointment[] }).items ?? []);
    } catch {
      toast.error("Error al cargar citas");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  const fetchOptions = useCallback(async () => {
    try {
      const pRes = await apiClient.get<Patient[]>("/api/v1/patients").catch(() => ({ data: [] }));
      setPatients(Array.isArray(pRes.data) ? pRes.data : (pRes.data as { items?: Patient[] }).items ?? []);
    } catch {
      // Non-critical patient fallback
    }

    try {
      const dRes = await apiClient.get<User[]>("/api/v1/users").catch(() => ({ data: [] }));
      const usersList = Array.isArray(dRes.data) ? dRes.data : (dRes.data as { items?: User[] }).items ?? [];
      
      // Also fetch doctors from doctors endpoint if users list is empty
      let docs = usersList.filter((u: User) => u.role === "doctor");
      if (docs.length === 0) {
        const doctorsRes = await apiClient.get<User[]>("/api/v1/users/doctors/").catch(() => ({ data: [] }));
        docs = Array.isArray(doctorsRes.data) ? doctorsRes.data : (doctorsRes.data as { items?: User[] }).items ?? [];
      }
      setDoctors(docs);
    } catch {
      // Non-critical doctors fallback
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(fetchAppointments, 300);
    return () => clearTimeout(timeout);
  }, [fetchAppointments]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await apiClient.post("/api/v1/appointments", form);
      toast.success("Cita creada exitosamente");
      setDialogOpen(false);
      setForm({
        patient_id: 0,
        doctor_id: 0,
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        status: "scheduled",
        notes: "",
      });
      fetchAppointments();
    } catch {
      toast.error("Error al crear la cita");
    } finally {
      setCreating(false);
    }
  };

  const filteredAppointments =
    statusFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Citas</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las citas de la clínica
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              id="new-appointment-button"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm hover:from-blue-500 hover:to-cyan-400"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nueva Cita</DialogTitle>
              <DialogDescription>
                Programa una nueva cita para un paciente
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apt-title">Título *</Label>
                <Input
                  id="apt-title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  required
                  placeholder="Ej: Limpieza dental"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="apt-patient">Paciente *</Label>
                  <Select
                    value={form.patient_id ? String(form.patient_id) : ""}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, patient_id: Number(v) }))
                    }
                  >
                    <SelectTrigger id="apt-patient">
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((pat) => (
                        <SelectItem key={pat.id} value={String(pat.id)}>
                          {pat.first_name} {pat.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apt-doctor">Doctor *</Label>
                  <Select
                    value={form.doctor_id ? String(form.doctor_id) : ""}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, doctor_id: Number(v) }))
                    }
                  >
                    <SelectTrigger id="apt-doctor">
                      <SelectValue placeholder="Seleccionar doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doc) => (
                        <SelectItem key={doc.id} value={String(doc.id)}>
                          {doc.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="apt-start">Inicio *</Label>
                  <Input
                    id="apt-start"
                    type="datetime-local"
                    value={form.start_time}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, start_time: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apt-end">Fin *</Label>
                  <Input
                    id="apt-end"
                    type="datetime-local"
                    value={form.end_time}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, end_time: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apt-description">Descripción</Label>
                <Textarea
                  id="apt-description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Detalles de la cita..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apt-notes">Notas</Label>
                <Textarea
                  id="apt-notes"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  placeholder="Notas adicionales..."
                  rows={2}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Crear Cita"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs filter */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="scheduled">Programadas</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmadas</TabsTrigger>
            <TabsTrigger value="in_progress">En curso</TabsTrigger>
            <TabsTrigger value="completed">Completadas</TabsTrigger>
          </TabsList>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search-appointments"
              placeholder="Buscar citas..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value={statusFilter} className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CalendarDays className="h-12 w-12 text-muted-foreground/30" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No hay citas
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No se encontraron citas con los filtros actuales
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cita</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Horario
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Paciente
                        </TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((apt) => (
                        <TableRow key={apt.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                <CalendarCheck className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">{apt.title}</p>
                                {apt.description && (
                                  <p className="max-w-xs truncate text-xs text-muted-foreground">
                                    {apt.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {new Date(apt.start_time).toLocaleDateString(
                                  "es-MX",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                  },
                                )}{" "}
                                {new Date(apt.start_time).toLocaleTimeString(
                                  "es-MX",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {apt.patient ? (
                              <span className="text-sm">
                                {apt.patient.first_name} {apt.patient.last_name}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                ID: {apt.patient_id}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                statusConfig[apt.status]?.variant ?? "outline"
                              }
                            >
                              {statusConfig[apt.status]?.label ?? apt.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Ver detalle
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
