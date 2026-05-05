"use client";

import { Wallet } from "lucide-react";

type Props = {
  title?: string;
  subtitle?: string;
  walletAddress?: string;
};

export default function CampaignHeroCard({
  title = "Class Fund 2026",
  subtitle = "Raising funds for our department's capstone showcase: equipment, printing, and venue costs for all project teams.",
  walletAddress = "addr1q...f8k2",
}: Props) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1117] p-5 shadow-lg">
      
      {/* Status Badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
        </span>
        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
          Live on Cardano Preprod
        </span>
      </div>

      {/* Title */}
      <h1 className="mb-2 text-xl font-bold text-white">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="mb-6 text-sm text-gray-400 leading-relaxed">
        {subtitle}
      </p>

      {/* Wallet Status */}
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b0d12] px-3 py-2">
        <Wallet className="h-4 w-4 text-gray-400" />
        <span className="font-mono text-sm text-green-400">
          {walletAddress}
        </span>
      </div>

    </div>
  );
}