"use client";

import { useEffect, useState, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import type { Patient, PatientCreate } from "@/types";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Loader2,
  FileText
} from "lucide-react";
import { toast } from "sonner";

const emptyPatient: PatientCreate = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  gender: undefined,
  address: "",
  emergency_contact: "",
  emergency_phone: "",
  medical_notes: "",
  allergies: "",
};

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<PatientCreate>(emptyPatient);

  const fetchPatients = useCallback(async () => {
    try {
      const { data } = await apiClient.get<Patient[]>("/api/v1/patients", {
        params: { search: search || undefined },
      });
      setPatients(Array.isArray(data) ? data : (data as { items?: Patient[] }).items ?? []);
    } catch {
      toast.error("Error al cargar pacientes");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(fetchPatients, 300);
    return () => clearTimeout(timeout);
  }, [fetchPatients]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await apiClient.post("/api/v1/patients", form);
      toast.success("Paciente registrado en la clínica");
      setDialogOpen(false);
      setForm(emptyPatient);
      fetchPatients();
    } catch {
      toast.error("Error al registrar paciente");
    } finally {
      setCreating(false);
    }
  };

  const updateField = <K extends keyof PatientCreate>(
    key: K,
    value: PatientCreate[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expedientes Clínicos</h1>
          <p className="text-sm text-muted-foreground">
            Visualiza y gestiona las fichas de salud de tus pacientes
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-sm hover:from-purple-500 hover:to-indigo-400"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
              <DialogDescription>
                Ingresa los datos del paciente para abrir su expediente clínico
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nombre *</Label>
                  <Input
                    id="first_name"
                    value={form.first_name}
                    onChange={(e) => updateField("first_name", e.target.value)}
                    required
                    placeholder="Nombre"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Apellido *</Label>
                  <Input
                    id="last_name"
                    value={form.last_name}
                    onChange={(e) => updateField("last_name", e.target.value)}
                    required
                    placeholder="Apellido"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+52 123 456 7890"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Fecha de nacimiento</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) =>
                      updateField("date_of_birth", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Género</Label>
                  <Select
                    value={form.gender ?? ""}
                    onValueChange={(v) =>
                      updateField("gender", v as "M" | "F" | "O")
                    }
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                      <SelectItem value="O">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Dirección completa"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Contacto de emergencia</Label>
                  <Input
                    id="emergency_contact"
                    value={form.emergency_contact}
                    onChange={(e) =>
                      updateField("emergency_contact", e.target.value)
                    }
                    placeholder="Nombre"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_phone">Tel. emergencia</Label>
                  <Input
                    id="emergency_phone"
                    value={form.emergency_phone}
                    onChange={(e) =>
                      updateField("emergency_phone", e.target.value)
                    }
                    placeholder="+52 123 456 7890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies" className="text-red-500 font-medium">Alergias / Restricciones</Label>
                <Input
                  id="allergies"
                  value={form.allergies}
                  onChange={(e) => updateField("allergies", e.target.value)}
                  placeholder="Penicilina, Látex, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medical_notes">Notas médicas (Historial)</Label>
                <Textarea
                  id="medical_notes"
                  value={form.medical_notes}
                  onChange={(e) => updateField("medical_notes", e.target.value)}
                  placeholder="Antecedentes médicos relevantes, hipertensión, diabetes, etc..."
                  rows={3}
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
                <Button type="submit" disabled={creating} className="bg-purple-600 hover:bg-purple-500 text-white">
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar Paciente"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Listing */}
      <Card className="border-border/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o expediente..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : patients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold">
                No se encontraron expedientes
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead className="hidden md:table-cell">Contacto</TableHead>
                    <TableHead className="hidden lg:table-cell">Alergias</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acción Clínico</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-slate-500/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 text-xs font-bold text-white">
                            {patient.first_name[0]}
                            {patient.last_name[0]}
                          </div>
                          <div>
                            <p className="font-medium">
                              {patient.first_name} {patient.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {patient.phone ?? patient.email ?? "—"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          {patient.phone && <p className="text-xs text-muted-foreground">{patient.phone}</p>}
                          {patient.email && <p className="text-xs text-muted-foreground">{patient.email}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {patient.allergies ? (
                          <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/15">
                            {patient.allergies}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Ninguna</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={patient.is_active ? "default" : "secondary"}>
                          {patient.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-500">
                          <FileText className="mr-1 h-4 w-4" /> Expediente
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
    </div>
  );
}
