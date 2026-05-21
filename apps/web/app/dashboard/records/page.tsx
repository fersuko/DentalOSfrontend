"use client";

import { useEffect, useState, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import type { ClinicalRecord, Patient } from "@/types";
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

export default function RecordsPage() {
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
        <h1 className="text-2xl font-bold tracking-tight">
          Historial Clínico
        </h1>
        <p className="text-sm text-muted-foreground">
          Registros clínicos de los pacientes
        </p>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-records"
                placeholder="Buscar por diagnóstico o paciente..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold">
                No hay registros clínicos
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Los registros aparecerán aquí cuando se creen desde la consulta
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registro</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Diente
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Plan de tratamiento
                    </TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{record.diagnosis}</p>
                            {record.notes && (
                              <p className="max-w-sm truncate text-xs text-muted-foreground">
                                {record.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {record.tooth_number ? (
                          <Badge variant="outline">#{record.tooth_number}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <p className="max-w-xs truncate text-sm text-muted-foreground">
                          {record.treatment_plan ?? "—"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.created_at).toLocaleDateString(
                            "es-MX",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
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
    </div>
  );
}
