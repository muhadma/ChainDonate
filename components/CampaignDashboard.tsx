"use client";

import { Campaign } from "./types";
import StatusBadge from "./StatusBadge";

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
  const activeCampaigns = campaigns.filter((c) => !(c as any).isArchived);
  const completedCampaigns = campaigns.filter((c) => !!(c as any).isArchived);

  return (
    <div className="w-full max-w-6xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-wide text-gray-200">
          Campaigns
        </h2>
        <button
          onClick={onOpenRegister}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-medium transition shadow-md shadow-emerald-900/20 text-white"
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
        <>
          <div>
            <h2 className="text-xs font-mono font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Active Campaigns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeCampaigns.map((campaign) => (
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
                        <StatusBadge status={campaign.isVerified ? "VERIFIED" : "PENDING"} />
                        {campaign.treasuryEnabled && (
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                            Treasury
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {campaign.description}
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-gray-600 bg-[#0f1117] p-2 rounded border border-white/5 truncate">
                    Target: {campaign.targetAddress.slice(0, 14)}...
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-mono font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Completed Campaigns
            </h2>
            {completedCampaigns.length === 0 ? (
              <p className="text-sm font-mono text-gray-600">No completed campaigns yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
                {completedCampaigns.map((campaign) => (
                  <div key={campaign.id} className="relative">
                    <span className="absolute top-3 right-3 z-10 text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                      Closed
                    </span>
                    <div
                      onClick={() => onSelectCampaign(campaign)}
                      className="group border border-white/5 rounded-xl p-6 bg-[#131722] hover:border-amber-500/30 cursor-pointer transition flex flex-col justify-between space-y-4 shadow-lg"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-lg font-medium text-gray-400 group-hover:text-amber-400 transition truncate">
                            {campaign.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                          {campaign.description}
                        </p>
                      </div>
                      <div className="text-[11px] font-mono text-gray-600 bg-[#0f1117] p-2 rounded border border-white/5 truncate">
                        Target: {campaign.targetAddress.slice(0, 14)}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}