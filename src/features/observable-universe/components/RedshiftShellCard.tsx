"use client";

import React from "react";
import { RedshiftShell } from "@/domain/observable-universe/types";

interface RedshiftShellCardProps {
  shells: RedshiftShell[];
  selectedShellSlug?: string;
  onSelectShell?: (shell: RedshiftShell) => void;
}

export const RedshiftShellCard: React.FC<RedshiftShellCardProps> = ({
  shells,
  selectedShellSlug,
  onSelectShell,
}) => {
  return (
    <div
      className="flex flex-col gap-2.5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md font-mono"
      data-testid="redshift-shells-card"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          REDSHIFT DISTANCE SHELLS
        </span>
        <span className="text-xs text-slate-400">{shells.length} Layers</span>
      </div>

      <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-1">
        {shells.map((shell) => {
          const isSelected = selectedShellSlug === shell.slug;

          return (
            <button
              key={shell.slug}
              onClick={() => onSelectShell?.(shell)}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? "bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-950/30"
                  : "bg-slate-950/50 border-slate-800/60 hover:bg-slate-800/40 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: shell.colorHex }}
                />
                <div>
                  <span className="text-xs font-bold text-slate-200 block">{shell.name}</span>
                  <span className="text-[10px] text-slate-400">
                    z = {shell.minRedshiftZ} – {shell.maxRedshiftZ} • Lookback:{" "}
                    {shell.minLookbackTimeGyr.toFixed(1)} – {shell.maxLookbackTimeGyr.toFixed(1)}{" "}
                    Gyr
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-bold text-slate-300">
                {(shell.maxComovingDistanceMpc * 0.00326).toFixed(1)} Gly
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
