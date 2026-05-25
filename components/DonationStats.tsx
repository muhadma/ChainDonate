'use client';

import React, { useEffect, useState } from 'react';
import { Coins, Users, Target } from 'lucide-react';
import { supabase } from "@/lib/supabase";

interface DonationStatsProps {
  campaignAddress: string;
  goal: number;
  onTotalRaisedChange?: (amount: number) => void;
  onDonationCountChange?: (count: number) => void;
}

const DonationStatsComponent: React.FC<DonationStatsProps> = ({
  campaignAddress,
  goal,
  onTotalRaisedChange,
  onDonationCountChange,
}) => {
  const [stats, setStats] = useState({
    totalRaised: 0,
    donorCount: 0,
  });

  useEffect(() => {
    if (!campaignAddress) return;

    const fetchStats = async () => {
      const { data: transactions, error: txError } = await supabase
        .from("transactions")
        .select("address, amount")
        .eq("address", campaignAddress)
        .eq("status", "confirmed");

      if (txError) {
        console.error("Failed to fetch transactions:", txError);
        return;
      }

      const total = (transactions ?? []).reduce(
        (sum: number, d: any) => sum + Number(d.amount), 0
      );

      const donors = new Set((transactions ?? []).map((d: any) => d.address));

      setStats({
        totalRaised: total,
        donorCount: donors.size,
      });

      onTotalRaisedChange?.(total);
      onDonationCountChange?.(donors.size);
    };

    fetchStats();

    const channel = supabase
      .channel(`stats-realtime-${campaignAddress}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "transactions",
        filter: `address=eq.${campaignAddress}`,
      }, () => fetchStats())
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "transactions",
        filter: `address=eq.${campaignAddress}`,
      }, () => fetchStats())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [campaignAddress]);

  const progressPercentage = goal > 0
    ? Math.min((stats.totalRaised / goal) * 100, 100)
    : 0;

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold text-white tracking-wide">Donation Statistics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Raised"
          value={`₳ ${stats.totalRaised.toLocaleString()}`}
          icon={<Coins className="h-5 w-5 text-emerald-400" />}
        />
        <StatCard
          title="Donors"
          value={stats.donorCount.toString()}
          icon={<Users className="h-5 w-5 text-blue-400" />}
        />
        <StatCard
          title="Goal Progress"
          value={`₳ ${stats.totalRaised.toLocaleString()} / ₳ ${goal.toLocaleString()}`}
          icon={<Target className="h-5 w-5 text-indigo-400" />}
        />
      </div>

      <div className="bg-[#1a1d27] border border-white/5 p-5 rounded-xl space-y-3">
        <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-gray-400">
          <span>Campaign Progress</span>
          <span
            className={`text-xs font-mono font-semibold ${
              progressPercentage >= 100 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {progressPercentage.toFixed(1)}% Completed
          </span>
        </div>
        <div className="w-full bg-[#2d313e] rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progressPercentage >= 100 ? 'bg-amber-400' : 'bg-emerald-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {progressPercentage >= 100 && (
          <div className="flex justify-center pt-1">
            <span className="text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
              Goal Reached
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-[#1a1d27] p-4.5 rounded-xl border border-white/5 flex justify-between items-center transition hover:border-white/10">
    <div className="space-y-1 min-w-0">
      <p className="text-xs font-medium text-gray-400 tracking-wide uppercase">
        {title}
      </p>
      <p className="text-lg font-bold text-white font-mono truncate">
        {value}
      </p>
    </div>
    <div className="bg-[#2d313e] p-2.5 rounded-xl flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
  </div>
);

export default DonationStatsComponent;
