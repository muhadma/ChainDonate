"use client";

import Wallet from "@/components/wallet";
import CampaignHeroCard from "@/components/CampaignHero";
import DonateButton from "@/components/DonateButton";
import DonationStatsComponent from "@/components/DonationStats";
import DonationHistory from "@/components/DonationHistory";
import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState<string>("");

  return (
    <main className="min-h-screen bg-[#0f1117] text-white flex flex-col items-center py-10 px-4 gap-10">

      {/* Hero */}
      <CampaignHeroCard walletAddress={address} />

      {/* Wallet (temporary or header utility) */}
      <Wallet onAddressChange={setAddress} />

      {/* Placeholder sections (for structure only) */}
      <div className="w-full max-w-4xl space-y-6">

        {/* Stats Row Placeholder */}
        <div className="text-sm text-gray-500 border border-white/10 rounded-xl p-4">
          <DonationStatsComponent /> {/* To be implemented by teammate */}
        </div>

        {/* Donation Input Placeholder */}
        <div className="text-sm text-gray-500 border border-white/10 rounded-xl p-4">
          <DonateButton />
        </div>

        {/* Recent Donations Placeholder */}
        <div className="text-sm text-gray-500 border border-white/10 rounded-xl p-4">
          <DonationHistory /> {/* To be implemented by teammate */}
        </div>

      </div>

    </main>
  );
}