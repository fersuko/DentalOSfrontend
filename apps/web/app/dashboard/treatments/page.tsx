"use client";

import { useEffect, useState, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import type { Treatment, TreatmentCreate } from "@/types";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
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
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Textarea } from "@workspace/ui/components/textarea";
import { Stethoscope, Plus, Search, Clock, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState<TreatmentCreate>({
    name: "",
    description: "",
    price: 0,
    duration_minutes: 30,
    category: "",
  });

  const fetchTreatments = useCallback(async () => {
    try {
      const { data } = await apiClient.get<Treatment[]>(
        "/api/v1/treatments/mine/",
        { params: { search: search || undefined } },
      );
      setTreatments(Array.isArray(data) ? data : (data as { items?: Treatment[] }).items ?? []);
    } catch {
      toast.error("Error al cargar tratamientos");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(fetchTreatments, 300);
    return () => clearTimeout(timeout);
  }, [fetchTreatments]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await apiClient.post("/api/v1/treatments", form);
      toast.success("Tratamiento creado exitosamente");
      setDialogOpen(false);
      setForm({ name: "", description: "", price: 0, duration_minutes: 30, category: "" });
      fetchTreatments();
    } catch {
      toast.error("Error al crear el tratamiento");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tratamientos</h1>
          <p className="text-sm text-muted-foreground">
            Catálogo de servicios y tratamientos dentales
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              id="new-treatment-button"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm hover:from-blue-500 hover:to-cyan-400"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tratamiento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Tratamiento</DialogTitle>
              <DialogDescription>
                Agrega un nuevo servicio al catálogo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tx-name">Nombre *</Label>
                <Input
                  id="tx-name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  placeholder="Ej: Limpieza dental profunda"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tx-price">Precio (MXN) *</Label>
                  <Input
                    id="tx-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: Number(e.target.value) }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tx-duration">Duración (min) *</Label>
                  <Input
                    id="tx-duration"
                    type="number"
                    min="5"
                    step="5"
                    value={form.duration_minutes}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        duration_minutes: Number(e.target.value),
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tx-category">Categoría</Label>
                <Input
                  id="tx-category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  placeholder="Ej: Prevención, Ortodoncia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tx-description">Descripción</Label>
                <Textarea
                  id="tx-description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Descripción del tratamiento..."
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
                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Tratamiento"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-treatments"
                placeholder="Buscar tratamiento..."
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
          ) : treatments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Stethoscope className="h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold">
                No hay tratamientos
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comienza agregando servicios al catálogo
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tratamiento</TableHead>
                    <TableHead className="hidden md:table-cell">Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead className="hidden sm:table-cell">Duración</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {treatments.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{tx.name}</p>
                          {tx.description && (
                            <p className="max-w-sm truncate text-xs text-muted-foreground">
                              {tx.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {tx.category ? (
                          <Badge variant="outline">{tx.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-semibold text-emerald-500">
                          <DollarSign className="h-3 w-3" />
                          {tx.price.toLocaleString("es-MX")}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {tx.duration_minutes} min
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.is_active ? "default" : "secondary"}>
                          {tx.is_active ? "Activo" : "Inactivo"}
                        </Badge>
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
