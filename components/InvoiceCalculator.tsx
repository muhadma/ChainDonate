"use client";

import { TrendingUp } from "lucide-react";

interface InvoiceCalculatorProps {
  donationAmount: string;
  treasuryEnabled: boolean;
}

export default function InvoiceCalculator({ donationAmount, treasuryEnabled }: InvoiceCalculatorProps) {
  const donation = parseFloat(donationAmount) || 0;
  const treasuryFee = treasuryEnabled ? 1 : 0;
  const total = donation + treasuryFee;

  return (
    <div className="bg-[#141722] border border-white/10 rounded-lg p-4 mb-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Invoice Summary</p>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">Donation Amount:</span>
        <span className={`font-mono font-semibold ${donation > 0 ? "text-emerald-400" : "text-gray-500"}`}>
          {donation > 0 ? `${donation.toFixed(2)} ₳` : "—"}
        </span>
      </div>

      {treasuryEnabled && (
        <div className="flex justify-between items-center text-sm border-t border-white/5 pt-3">
          <span className="text-amber-400/80 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Treasury Support Fee:
          </span>
          <span className="font-mono font-semibold text-amber-400">1.00 ₳</span>
        </div>
      )}

      <div className={`flex justify-between items-center text-sm font-semibold rounded-lg p-2.5 ${
        total > 0 
          ? "bg-emerald-500/10 border border-emerald-500/30" 
          : "bg-gray-900/50 border border-white/5"
      }`}>
        <span className="text-white">Total to Sign:</span>
        <span className={`font-mono text-base ${total > 0 ? "text-emerald-400" : "text-gray-500"}`}>
          {total > 0 ? `${total.toFixed(2)} ₳` : "—"}
        </span>
      </div>

      {total > 0 && (
        <p className="text-[11px] text-gray-500 pt-1">
          ✓ This amount will be sent to your wallet for signature
        </p>
      )}
    </div>
  );
}
