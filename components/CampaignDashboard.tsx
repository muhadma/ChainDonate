"use client";

import React from "react";
import { Campaign } from "./types";

interface CampaignDashboardProps {
  campaigns: Campaign[];
  loading: boolean;
  onSelectCampaign: (campaign: Campaign) => void;
  onOpenRegister: () => void;
}

export default function CampaignDashboard({
  campaigns,
  loading,
  onSelectCampaign,
  onOpenRegister,
}: CampaignDashboardProps) {
  return (
    <div className="w-full max-w-6xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-wide text-gray-200">
          Active Campaigns
        </h2>
        <button
            onClick={onOpenRegister}
            className="px-4 py-2 bg-gradient-to-r bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-medium transition shadow-md shadow-emerald-900/20 text-white"
            >
            + Register Campaign
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500 py-12 text-center font-mono">
          Loading dynamic listings from Supabase...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-sm text-gray-500 py-12 text-center border border-dashed border-white/10 rounded-xl">
          No active campaigns found in database. Click Register above to launch one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => onSelectCampaign(campaign)}
              className="group border border-white/10 rounded-xl p-6 bg-[#141722] hover:border-indigo-500/50 cursor-pointer transition flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-lg font-medium group-hover:text-indigo-400 transition truncate">
                    {campaign.title}
                  </h3>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {campaign.isVerified && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                    {campaign.treasuryEnabled && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        Treasury
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {campaign.description}
                </p>
              </div>
              <div className="text-[11px] font-mono text-gray-500 bg-[#0f1117] p-2 rounded border border-white/5 truncate">
                Target Address: {campaign.targetAddress}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}