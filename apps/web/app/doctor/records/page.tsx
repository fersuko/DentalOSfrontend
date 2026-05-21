"use client";

import { useEffect, useState, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import type { ClinicalRecord } from "@/types";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  ClipboardList,
  Search,
  FileText,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Odontogram } from "@/components/clinical/Odontogram";

export default function DoctorRecordsPage() {
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const handleAddRecord = async (newRec: {
    tooth_number: string;
    diagnosis: string;
    treatment_plan: string;
    notes: string;
  }) => {
    try {
      const payload = {
        patient_id: 1, // Sofia Rodriguez
        doctor_id: 7,
        ...newRec
      };
      const { data } = await apiClient.post<ClinicalRecord>("/api/v1/clinical-records", payload);
      setRecords((prev) => [...prev, data]);
      toast.success(`Tratamiento para pieza dental ${newRec.tooth_number} guardado en el expediente`);
    } catch {
      toast.error("Error al guardar el registro clínico");
    }
  };

  const fetchRecords = useCallback(async () => {
    try {
      const { data } = await apiClient.get<ClinicalRecord[]>(
        "/api/v1/clinical-records",
        { params: { search: search || undefined } },
      );
      setRecords(Array.isArray(data) ? data : (data as { items?: ClinicalRecord[] }).items ?? []);
    } catch {
      toast.error("Error al cargar historial clínico");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(fetchRecords, 300);
    return () => clearTimeout(timeout);
  }, [fetchRecords]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Historial de Tratamientos</h1>
        <p className="text-sm text-muted-foreground">
          Consulta las intervenciones clínicas registradas por todos los odontólogos
        </p>
      </div>

      {/* Interactive Odontogram Component */}
      <Odontogram records={records} onAddRecord={handleAddRecord} />

      {/* Content */}
      <Card className="border-border/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por diagnóstico o diente..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold">
                No hay registros clínicos aún
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comienza registrando un diagnóstico clínico desde la consulta
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead className="hidden md:table-cell">Pieza Dental</TableHead>
                    <TableHead className="hidden lg:table-cell">Plan / Procedimiento</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Detalle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id} className="hover:bg-slate-500/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm sm:text-base">{record.diagnosis}</p>
                            {record.notes && (
                              <p className="max-w-sm truncate text-xs text-muted-foreground mt-0.5">
                                {record.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {record.tooth_number ? (
                          <Badge variant="outline" className="border-purple-500/20 text-purple-600 bg-purple-500/5">
                            Pieza #{record.tooth_number}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <p className="max-w-xs truncate text-sm text-muted-foreground font-medium">
                          {record.treatment_plan ?? "—"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.created_at).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-500 font-semibold">
                          Ver receta
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
