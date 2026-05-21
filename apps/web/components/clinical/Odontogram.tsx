"use client";

import { useState } from "react";
import type { ClinicalRecord } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Sparkles,
  Info,
  Calendar,
  User,
  Heart,
  PlusCircle,
  FileImage,
  FolderOpen
} from "lucide-react";

// Standard FDI teeth notation quadrants
const quadrant1 = [18, 17, 16, 15, 14, 13, 12, 11]; // Upper Right
const quadrant2 = [21, 22, 23, 24, 25, 26, 27, 28]; // Upper Left
const quadrant3 = [38, 37, 36, 35, 34, 33, 32, 31]; // Lower Left
const quadrant4 = [41, 42, 43, 44, 45, 46, 47, 48]; // Lower Right

interface OdontogramProps {
  records: ClinicalRecord[];
  onAddRecord: (record: {
    tooth_number: string;
    diagnosis: string;
    treatment_plan: string;
    notes: string;
  }) => void;
}

export function Odontogram({ records, onAddRecord }: OdontogramProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [notes, setNotes] = useState("");

  // Get all clinical history for a specific tooth
  const getToothRecords = (toothNum: number) => {
    return records.filter(r => r.tooth_number === String(toothNum));
  };

  // Determine visual color of the tooth based on its most recent treatment status
  const getToothColor = (toothNum: number) => {
    const toothHistory = getToothRecords(toothNum);
    if (toothHistory.length === 0) return "bg-slate-100 hover:bg-purple-100 border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-purple-950/40 text-slate-800 dark:text-slate-300"; // healthy
    
    const latest = toothHistory[toothHistory.length - 1]!;
    const plan = latest.treatment_plan?.toLowerCase() ?? "";
    const diag = latest.diagnosis.toLowerCase();

    if (plan.includes("endodoncia")) {
      return "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/40 text-yellow-600 dark:text-yellow-400"; // Endodoncia
    }
    if (plan.includes("corona") || plan.includes("prótesis") || plan.includes("protesis")) {
      return "bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/40 text-purple-600 dark:text-purple-400"; // Corona/Zirconia
    }
    if (diag.includes("caries")) {
      return "bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/40 text-rose-600 dark:text-rose-400"; // Cavidad activa / Caries
    }
    return "bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/40 text-blue-600 dark:text-blue-400"; // Resina
  };

  const handleSaveTreatment = () => {
    if (!selectedTooth || !diagnosis || !treatmentPlan) return;
    
    onAddRecord({
      tooth_number: String(selectedTooth),
      diagnosis,
      treatment_plan: treatmentPlan,
      notes
    });

    // Reset inputs
    setDiagnosis("");
    setTreatmentPlan("");
    setNotes("");
    setSelectedTooth(null);
  };

  const renderToothRow = (quad: number[]) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center py-2">
        {quad.map((tooth) => {
          const isSelected = selectedTooth === tooth;
          const history = getToothRecords(tooth);
          
          return (
            <button
              key={tooth}
              onClick={() => setSelectedTooth(tooth)}
              className={`flex flex-col items-center justify-between w-10 h-14 rounded-lg border-2 text-xs font-bold transition-all shadow-sm ${getToothColor(tooth)} ${
                isSelected ? "ring-2 ring-purple-600 border-purple-600 scale-105" : ""
              }`}
            >
              {/* Tooth Number */}
              <span className="pt-1.5">{tooth}</span>
              
              {/* Small indicator dots for accumulated treatments */}
              <div className="flex gap-0.5 pb-2">
                {history.slice(0, 3).map((_, i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Visual Interactive Odontogram Map */}
      <Card className="border-border/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-black flex items-center gap-1.5 text-purple-600">
                <Sparkles className="h-5 w-5" /> Odontograma Clínico Interactivo
              </CardTitle>
              <CardDescription>
                Explora y selecciona piezas bajo la notación internacional FDI.
              </CardDescription>
            </div>
            {/* Theme labels legend */}
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px]">Caries</Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px]">Resina</Badge>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px]">Corona / Zirconia</Badge>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px]">Endodoncia</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 overflow-x-auto py-6">
          {/* Superior Arch */}
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase text-center tracking-wider">Arcada Superior (18 - 28)</h4>
            <div className="flex justify-center gap-6">
              {renderToothRow(quadrant1)}
              <div className="border-r border-dashed border-border/60 hidden sm:block" />
              {renderToothRow(quadrant2)}
            </div>
          </div>

          <div className="border-t border-dashed border-border/60 my-4" />

          {/* Inferior Arch */}
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase text-center tracking-wider">Arcada Inferior (48 - 38)</h4>
            <div className="flex justify-center gap-6">
              {renderToothRow(quadrant4)}
              <div className="border-r border-dashed border-border/60 hidden sm:block" />
              {renderToothRow(quadrant3)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Tooth Action Panel */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: Treatment creation (takes 2 cols if a tooth is selected) */}
        <Card className={`md:col-span-2 border-border/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md transition-all ${
          selectedTooth ? "ring-1 ring-purple-600/30 border-purple-500/30" : "opacity-75"
        }`}>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              {selectedTooth ? (
                <>Registrar Tratamiento para Pieza #{selectedTooth}</>
              ) : (
                <>Selecciona una pieza dental del mapa superior</>
              )}
            </CardTitle>
            <CardDescription>
              Agrega diagnósticos y procedimientos acumulativos al expediente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTooth ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="diagnosis-select">Diagnóstico Clínico</Label>
                    <Select value={diagnosis} onValueChange={setDiagnosis}>
                      <SelectTrigger id="diagnosis-select">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Caries Grado 1 (Esmalte)">Caries Grado 1 (Esmalte)</SelectItem>
                        <SelectItem value="Caries Grado 2 (Dentina)">Caries Grado 2 (Dentina)</SelectItem>
                        <SelectItem value="Pulpitis Irreversible (Requiere Endodoncia)">Pulpitis Irreversible</SelectItem>
                        <SelectItem value="Falta de pieza dental (Edéntulo)">Falta de pieza dental</SelectItem>
                        <SelectItem value="Fractura Coronaria">Fractura Coronaria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 text-left">
                    <Label htmlFor="plan-select">Plan de Tratamiento</Label>
                    <Select value={treatmentPlan} onValueChange={setTreatmentPlan}>
                      <SelectTrigger id="plan-select">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Resina Compuesta Fotocurable">Resina Compuesta</SelectItem>
                        <SelectItem value="Corona de Circonia estética">Corona de Circonia</SelectItem>
                        <SelectItem value="Corona de Silicato de Litio">Corona de Silicato</SelectItem>
                        <SelectItem value="Tratamiento de Conducto (Endodoncia)">Endodoncia</SelectItem>
                        <SelectItem value="Prótesis Fija Parcial">Prótesis Fija</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <Label htmlFor="clinical-notes">Indicaciones / Notas</Label>
                  <Textarea
                    id="clinical-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Escribe aquí las observaciones clínicas..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setSelectedTooth(null)}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSaveTreatment} className="bg-purple-600 hover:bg-purple-500 text-white">
                    Registrar Tratamiento
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                <Info className="h-8 w-8 mb-2 opacity-40 text-purple-600" />
                <p className="text-xs">
                  Haz clic sobre cualquier diente (ej. Pieza 46 o 24) en el odontograma de arriba para abrir el panel de acciones clínicas.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Accumulated timeline history */}
        <Card className="border-border/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-base font-bold">Historial de Tratamientos</CardTitle>
            <CardDescription>
              Tratamientos acumulados en este paciente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">Sin intervenciones previas</p>
            ) : (
              <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
                {records.map((rec) => (
                  <div key={rec.id} className="p-3 rounded-xl border border-border/40 bg-background/50 space-y-1.5 text-left text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-purple-600">Pieza #{rec.tooth_number}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(rec.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                      </span>
                    </div>
                    <p className="font-bold text-foreground line-clamp-1">{rec.diagnosis}</p>
                    <p className="text-muted-foreground line-clamp-2">{rec.treatment_plan}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Radiografías & Cold Cloud Storage Panel */}
      <Card className="border-border/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-purple-500" /> Repositorio de Radiografías (Nube Fría)
          </CardTitle>
          <CardDescription>
            Carga y consulta radiografías del paciente (Almacenamiento optimizado de archivos grandes mediante Google Drive / S3).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Drag & drop simulated placeholder */}
            <div className="sm:col-span-2 border-2 border-dashed border-border/80 hover:border-purple-500/50 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-background/40 hover:bg-background/60 transition-all cursor-pointer">
              <FileImage className="h-8 w-8 text-purple-500 mb-2 opacity-65" />
              <p className="text-xs font-bold text-foreground">Arrastra tus Radiografías o Imágenes de Diagnóstico</p>
              <p className="text-[10px] text-muted-foreground mt-1">Soporta JPG, PNG, DICOM · Enrutado directo a tu nube de archivos fríos</p>
            </div>
            
            {/* Simulated X-Ray files list */}
            <div className="space-y-2">
              <div className="p-3 rounded-xl border border-border/40 bg-background/40 flex items-center justify-between text-xs text-left">
                <div className="space-y-0.5 min-w-0">
                  <span className="font-bold text-foreground block truncate">Radiografia_Panoramica_46.jpg</span>
                  <span className="text-[10px] text-muted-foreground">Subido: 10 de Mayo</span>
                </div>
                <Badge variant="secondary" className="text-[9px] shrink-0">Ver</Badge>
              </div>

              <div className="p-3 rounded-xl border border-border/40 bg-background/40 flex items-center justify-between text-xs text-left">
                <div className="space-y-0.5 min-w-0">
                  <span className="font-bold text-foreground block truncate">Aleta_Mordible_24.jpg</span>
                  <span className="text-[10px] text-muted-foreground">Subido: 11 de Mayo</span>
                </div>
                <Badge variant="secondary" className="text-[9px] shrink-0">Ver</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
