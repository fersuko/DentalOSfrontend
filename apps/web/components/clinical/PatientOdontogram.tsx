"use client";

import { useState } from "react";
import type { ClinicalRecord } from "@/types";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Smile, Info, Heart } from "lucide-react";

// Standard FDI notation rows for simplified mobile display (only main teeth 16-26, 46-36)
const upperTeeth = [16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26];
const lowerTeeth = [46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36];

interface PatientOdontogramProps {
  records: ClinicalRecord[];
}

export function PatientOdontogram({ records }: PatientOdontogramProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  // Get history of the tooth
  const getToothRecords = (toothNum: number) => {
    return records.filter(r => r.tooth_number === String(toothNum));
  };

  // Determine FDI tooth styling color
  const getToothColor = (toothNum: number) => {
    const history = getToothRecords(toothNum);
    if (history.length === 0) return "bg-slate-900 border-slate-800 text-slate-500";
    
    const latest = history[history.length - 1]!;
    const plan = latest.treatment_plan?.toLowerCase() ?? "";
    const diag = latest.diagnosis.toLowerCase();

    if (plan.includes("endodoncia")) {
      return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
    }
    if (plan.includes("corona") || plan.includes("prótesis")) {
      return "bg-purple-500/10 border-purple-500/30 text-purple-400";
    }
    if (diag.includes("caries")) {
      return "bg-rose-500/10 border-rose-500/30 text-rose-400";
    }
    return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
  };

  const selectedToothHistory = selectedTooth ? getToothRecords(selectedTooth) : [];

  return (
    <div className="space-y-4">
      <Card className="border-slate-900 bg-slate-900/40">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mi Mapa Dental</span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <Smile className="h-3.5 w-3.5" /> Interactivo
            </span>
          </div>

          {/* Superior row */}
          <div className="space-y-1">
            <span className="block text-[9px] text-slate-500 font-bold text-left uppercase">Superior</span>
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
              {upperTeeth.map((tooth) => (
                <button
                  key={tooth}
                  onClick={() => setSelectedTooth(tooth)}
                  className={`w-9 h-11 shrink-0 rounded-lg border-2 text-[10px] font-black flex flex-col items-center justify-center transition-all ${getToothColor(tooth)} ${
                    selectedTooth === tooth ? "ring-2 ring-emerald-400 border-emerald-400 scale-105" : ""
                  }`}
                >
                  <span>{tooth}</span>
                  {getToothRecords(tooth).length > 0 && (
                    <span className="h-1 w-1 rounded-full bg-current mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Inferior row */}
          <div className="space-y-1">
            <span className="block text-[9px] text-slate-500 font-bold text-left uppercase">Inferior</span>
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
              {lowerTeeth.map((tooth) => (
                <button
                  key={tooth}
                  onClick={() => setSelectedTooth(tooth)}
                  className={`w-9 h-11 shrink-0 rounded-lg border-2 text-[10px] font-black flex flex-col items-center justify-center transition-all ${getToothColor(tooth)} ${
                    selectedTooth === tooth ? "ring-2 ring-emerald-400 border-emerald-400 scale-105" : ""
                  }`}
                >
                  <span>{tooth}</span>
                  {getToothRecords(tooth).length > 0 && (
                    <span className="h-1 w-1 rounded-full bg-current mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected tooth details */}
      {selectedTooth && (
        <Card className="border-emerald-500/20 bg-emerald-500/5 transition-all">
          <CardContent className="p-4 text-xs text-left space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-1.5">
              <span className="font-bold text-emerald-400 text-sm">Pieza Dental #{selectedTooth}</span>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-[9px]">
                {selectedToothHistory.length > 0 ? "Con Tratamiento" : "Saludable"}
              </Badge>
            </div>

            {selectedToothHistory.length > 0 ? (
              <div className="space-y-3">
                {selectedToothHistory.map((h) => (
                  <div key={h.id} className="space-y-1">
                    <p className="font-bold text-white">{h.diagnosis}</p>
                    <p className="text-slate-400 text-[11px]">{h.notes}</p>
                    {h.treatment_plan && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold pt-1">
                        <Heart className="h-3 w-3" /> {h.treatment_plan}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-start gap-2 text-slate-400 py-1">
                <Info className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  No se registran diagnósticos ni restauraciones para la pieza #{selectedTooth}. ¡Se encuentra sana!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
