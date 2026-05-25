"use client";

import React, { useState } from "react";
import { Wallet, Copy, Check } from "lucide-react";

type Props = {
  title?: string;
  subtitle?: string;
  walletAddress?: string;
};

export function shortenAddress(address: string, size = 8) {
  if (!address) return "No address set";
  return `${address.slice(0, size)}...${address.slice(-size)}`;
}

export default function CampaignHeroCard({
  title = "",
  subtitle = "",
  walletAddress,
}: Props) {
  const [copied, setCopied] = useState(false);
  const displayAddress = walletAddress || process.env.NEXT_PUBLIC_DONATION_ADDRESS || "";

  const handleCopy = async () => {
    if (!displayAddress) return;
    try {
      await navigator.clipboard.writeText(displayAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address", err);
    }
  };

  return (
    <div className="w-full space-y-4 pb-2">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/10">
          Live on Cardano Preprod
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#0b0d12] p-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <Wallet className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="font-mono text-xs sm:text-sm text-indigo-400 truncate select-all">
            {displayAddress ? shortenAddress(displayAddress, 10) : "No address available"}
          </span>
        </div>
        
        {displayAddress && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-md transition duration-150 flex-shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}