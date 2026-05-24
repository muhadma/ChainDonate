"use client";

import React, { useState } from "react";
import CampaignHeroCard from "./CampaignHero";
import DonateButton from "./DonateButton";
import DonationStatsComponent from "./DonationStats";
import DonationHistory from "./DonationHistory";
import ArchivedCampaign from "./ArchivedCampaign";
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
import { Campaign } from "./types";
import StatusBadge from "./StatusBadge";

interface CampaignModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  wallet: MeshCardanoBrowserWallet | null;
}

export default function CampaignModal({ campaign, isOpen, onClose, wallet }: CampaignModalProps) {
  const [totalRaised, setTotalRaised] = useState(0);
  const [donationCount, setDonationCount] = useState(0);

  if (!isOpen || !campaign) return null;

  const isGoalMet = totalRaised >= campaign.goal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-[#0f1117] border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden z-10">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#141722]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400 px-2 py-1 bg-indigo-500/10 rounded">
              Campaign Detail View
            </span>
            <StatusBadge status={campaign.isVerified ? "VERIFIED" : "PENDING"} />
            {isGoalMet && (
              <span className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                Goal Reached
              </span>
            )}
            {campaign.isVerified && (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                Verified
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg p-2 text-xs transition"
          >
            Close Window
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          <CampaignHeroCard
            title={campaign.title}
            subtitle={campaign.description}
            walletAddress={campaign.targetAddress}
          />

          <div className="space-y-6">
            <div className="text-sm text-gray-500 border border-white/10 rounded-xl p-4 bg-[#141722]">
              <DonationStatsComponent
                campaignAddress={campaign.targetAddress}
                goal={campaign.goal}
                onTotalRaisedChange={setTotalRaised}
                onDonationCountChange={setDonationCount}
              />
            </div>

            <div className="text-sm text-gray-500 border border-white/10 rounded-xl p-4 bg-[#141722]">
              {isGoalMet ? (
                <ArchivedCampaign
                  campaignTitle={campaign.title}
                  totalRaised={totalRaised}
                  donationCount={donationCount}
                  explorerUrl={`https://preprod.cardanoscan.io/address/${campaign.targetAddress}`}
                />
              ) : (
                <>
                  <DonateButton
                    wallet={wallet}
                    fundAddress={campaign.targetAddress}
                    goal={campaign.goal}
                    totalRaised={totalRaised}
                  />
                  {campaign.treasuryEnabled && (
                    <p className="text-[11px] text-amber-400/70 mt-2 italic">
                      * 1 ADA Auto-Treasury protection routine is active for this target.
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="text-sm text-gray-500 border border-white/10 rounded-xl p-4 bg-[#141722]">
              <DonationHistory campaignAddress={campaign.targetAddress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
