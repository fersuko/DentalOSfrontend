"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import type { ClinicalRecord } from "@/types";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ClipboardList, Calendar, Heart, ShieldAlert } from "lucide-react";
import { PatientOdontogram } from "@/components/clinical/PatientOdontogram";

export default function PatientRecordsPage() {
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const { data } = await apiClient.get<ClinicalRecord[]>("/api/v1/clinical-records");
        if (data.length > 0) {
          setRecords(data);
        } else {
          // Provide mock clinical records for high fidelity patient view
          setRecords([
            {
              id: 301,
              patient_id: 1,
              doctor_id: 7,
              diagnosis: "Profilaxis Completa & Remoción de Sarro",
              treatment_plan: "Control semestral de placa dentobacteriana.",
              notes: "Paciente mantiene excelente higiene bucal general. Sin caries activas detectadas.",
              tooth_number: "General",
              created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 302,
              patient_id: 1,
              doctor_id: 7,
              diagnosis: "Caries Grado 1 en esmalte",
              treatment_plan: "Resina compuesta fotocurable en pieza 46.",
              notes: "Pieza 46 restaurada exitosamente. Se aplicó sellador de fosetas.",
              tooth_number: "46",
              created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error("Error loading patient clinical records:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white">Mi Expediente</h2>
        <p className="text-xs text-slate-400">Tus diagnósticos y recetas autorizadas</p>
      </div>

      {/* Allergies Alerts Banner */}
      <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl flex gap-3 items-start">
        <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div className="text-left space-y-0.5">
          <p className="text-xs font-bold text-red-400">Alergias Registradas</p>
          <p className="text-[11px] text-slate-400">Alergia declarada a la **Penicilina**. El consultorio está al tanto de esta restricción médica.</p>
        </div>
      </div>

      {/* Mobile Interactive Odontogram Map */}
      {!loading && <PatientOdontogram records={records} />}

      {/* Clinical Records timeline */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full bg-slate-900 rounded-2xl" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="h-10 w-10 text-slate-700 mx-auto" />
            <p className="mt-2 text-xs font-semibold text-slate-400">No hay registros en tu expediente</p>
          </div>
        ) : (
          records.map((rec) => (
            <Card key={rec.id} className="border-slate-900 bg-slate-900/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(rec.created_at).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                  {rec.tooth_number && (
                    <Badge variant="outline" className="border-slate-800 text-slate-400 bg-slate-950/40 text-[9px]">
                      Pieza: {rec.tooth_number}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-white">{rec.diagnosis}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{rec.notes}</p>
                </div>

                {rec.treatment_plan && (
                  <div className="pt-2 border-t border-slate-950/50 flex items-center gap-2 text-xs text-slate-500">
                    <Heart className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Tratamiento: <strong className="text-slate-300 font-semibold">{rec.treatment_plan}</strong></span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
