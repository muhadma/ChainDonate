"use client";

import React, { useState, useEffect, useCallback } from "react";
import { timeAgoFrom, colorFromAddr, initialsFromAddress } from "@/lib/formatter";
import { supabase } from "@/lib/supabase";

interface Donation {
  id: string;
  address: string;
  amount: number;
  timeAgo: string;
  txHash: string;
  avatarColor: string;
  avatarInitials: string;
}

interface DonationHistoryProps {
  campaignAddress: string;
}

function Avatar({ color, initials }: { color: string; initials: string }) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 font-mono tracking-wide"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

function DonationRow({ donation }: { donation: Donation }) {
  return (
    <div className="flex items-center gap-3 p-2.5 px-3.5 rounded-lg hover:bg-white/[0.04] transition duration-150 cursor-default">
      <Avatar color={donation.avatarColor} initials={donation.avatarInitials} />
      <div className="flex-1 min-w-0">
        <div className="text-xs sm:text-sm font-medium text-slate-200 font-mono truncate select-all">
          {donation.address}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
          {donation.timeAgo}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">
          +{donation.amount.toFixed(2)} <span className="text-[10px] opacity-80">₳</span>
        </div>
        <div className="text-[10px] text-slate-600 mt-0.5 font-mono max-w-[120px] truncate select-all" title={donation.txHash}>
          {donation.txHash}
        </div>
      </div>
    </div>
  );
}

export default function DonationHistory({ campaignAddress }: DonationHistoryProps) {
  const [filter, setFilter] = useState<"all" | "recent">("all");
  const [donations, setDonations] = useState<Donation[]>([]);

  const fetchDonations = useCallback(async () => {
    if (!campaignAddress) return;
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("address", campaignAddress)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const mapped: Donation[] = data.map((d: any) => ({
          id: d.id,
          address: d.tx_hash ? `sender_${d.tx_hash.slice(0, 6)}` : "Anonymous",
          amount: Number(d.amount),
          timeAgo: timeAgoFrom(d.created_at),
          txHash: d.tx_hash,
          avatarColor: colorFromAddr(d.tx_hash || d.id),
          avatarInitials: initialsFromAddress(d.tx_hash || d.id),
        }));
        setDonations(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch donations:", err);
    }
  }, [campaignAddress]);

  useEffect(() => {
    if (!campaignAddress) return;

    fetchDonations();

    const channel = supabase
      .channel(`history-realtime-${campaignAddress}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `address=eq.${campaignAddress}`,
        },
        (payload) => {
          console.log("Realtime event:", payload.eventType, payload.new);
          const updated = payload.new as any;
          if (updated?.status !== "confirmed") return;
          fetchDonations();
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignAddress, fetchDonations]); 

  const filtered = filter === "recent" ? donations.slice(0, 3) : donations;

  return (
    <div className="w-full font-mono">
      <div className="w-full bg-[#161b27] rounded-xl border border-white/[0.07] overflow-hidden shadow-2xl">
        <div className="p-4 px-5 border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-slate-300 tracking-wide">
            Recent Contributions
          </span>
          <div className="flex gap-1 bg-white/5 rounded-md p-0.5 border border-white/5">
            {(["all", "recent"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`border-none rounded px-2.5 py-1 text-[11px] font-semibold transition duration-150 cursor-pointer capitalize tracking-wider ${
                  filter === f ? "bg-white/[0.12] text-slate-200" : "bg-transparent text-slate-500 hover:text-slate-400"
                }`}
              >
                {f === "all" ? "View all" : "Recent"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-2 space-y-1 max-h-[280px] overflow-y-auto custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs sm:text-sm">
              No contributions recorded yet.
            </div>
          ) : (
            filtered.map((donation) => (
              <DonationRow key={donation.id} donation={donation} />
            ))
          )}
        </div>

        <div className="border-t border-white/[0.06] p-3 px-5 flex justify-between items-center bg-[#111520]/50 text-xs">
          <span className="text-slate-500">
            {donations.length} {donations.length === 1 ? "transaction" : "transactions"} total
          </span>
          <span className="font-bold text-emerald-400">
            {donations.reduce((s, d) => s + d.amount, 0).toFixed(2)}{" "}
            <span className="text-[10px] opacity-80">₳</span> raised
          </span>
        </div>
      </div>
    </div>
  );
}