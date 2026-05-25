"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp } from "lucide-react";

interface TreasuryWidgetProps {
  treasuryAddress?: string;
}

export default function TreasuryWidget({ treasuryAddress }: TreasuryWidgetProps) {
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchTreasuryBalance = async () => {
      try {
        setLoading(true);
        
        const address = treasuryAddress || process.env.NEXT_PUBLIC_TREASURY_ADDRESS;
        
        if (!address) {
          setError("Treasury address not configured");
          setBalance(0);
          return;
        }

        const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;
        if (!apiKey) {
          setError("Blockfrost API not configured");
          setBalance(0);
          return;
        }

        const response = await fetch(
          `https://cardano-preview.blockfrost.io/api/v0/addresses/${address}`,
          {
            headers: { 
              project_id: apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 400 || response.status === 404) {
          setBalance(0);
          setError(null);
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Blockfrost API response:", errorText);
          throw new Error(`Blockfrost API Error: ${response.status}`);
        }

        const data = await response.json();
        const lovelaceAmount = data.amount?.find((coin: any) => coin.unit === "lovelace")?.quantity || "0";
        const balanceInAda = parseInt(lovelaceAmount) / 1_000_000;
        setBalance(balanceInAda);
        setError(null);
      } catch (err) {
        console.error("Treasury balance fetch error:", err);
        setBalance(0);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTreasuryBalance();
    const interval = setInterval(fetchTreasuryBalance, 30000);

    return () => clearInterval(interval);
  }, [mounted, treasuryAddress]);

  if (!mounted) {
    return (
      <div className="w-full bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/30 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Treasury Fund</p>
              <p className="text-[11px] text-gray-400">Platform Health</p>
            </div>
          </div>
        </div>
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-3/4 mb-1"></div>
          <div className="h-4 bg-white/5 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/30 rounded-xl p-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Treasury Fund</p>
            <p className="text-[11px] text-gray-400">Platform Health</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-white/5 rounded w-1/2"></div>
          </div>
        ) : error ? (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded p-2">
            {error}
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-amber-300">
                {balance?.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-amber-400">₳</span>
            </div>
            <p className="text-[11px] text-gray-400">
              {balance === 0
                ? "Treasury pool initializing..."
                : `${Math.floor(balance!)} ADA secured • ${((balance! % 1) * 1_000_000).toFixed(0)} Lovelace`}
            </p>
          </>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-amber-500/20 grid grid-cols-2 gap-2">
        <div className="bg-amber-500/10 rounded p-2">
          <p className="text-[10px] text-gray-500 uppercase font-semibold">Status</p>
          <p className="text-xs font-bold text-emerald-400 mt-1">Active</p>
        </div>
        <div className="bg-amber-500/10 rounded p-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Growth</p>
            <p className="text-xs font-bold text-amber-300 mt-1">+donations</p>
          </div>
          <TrendingUp className="w-3 h-3 text-amber-400" />
        </div>
      </div>

      <p className="text-[10px] text-gray-500 mt-3 text-center">
        Updates every 30 seconds • Powered by Blockfrost
      </p>
    </div>
  );
}
