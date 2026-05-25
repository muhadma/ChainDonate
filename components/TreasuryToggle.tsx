"use client";

import React from "react";
import { Zap } from "lucide-react";

interface TreasuryToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function TreasuryToggle({ enabled, onChange }: TreasuryToggleProps) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-lg p-4 mb-4">
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled
            ? "bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/50"
            : "bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
      
      <div className="flex items-center gap-2 flex-1">
        <Zap className="w-4 h-4 text-amber-400" />
        <div>
          <p className="text-sm font-semibold text-white">
            Add 1 ADA to support the community platform treasury?
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Help maintain and improve ChainDonate infrastructure
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-xs font-mono text-amber-300 font-semibold">
          {enabled ? "+ 1 ₳" : "—"}
        </p>
      </div>
    </div>
  );
}
