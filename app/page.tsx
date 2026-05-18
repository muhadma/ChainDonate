"use client";

import Wallet from "@/components/wallet";
import RegisterCampaignModal from "@/components/RegisterFormModal"; 
import CampaignDashboard from "@/components/CampaignDashboard"; 
import CampaignModal from "@/components/CampaignModal"; 
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAddress: string;
  goal: number;
  isVerified: boolean;
  treasuryEnabled: boolean;
}

export default function Home() {
  const [wallet, setWallet] = useState<MeshCardanoBrowserWallet | null>(null);
  const [address, setAddress] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const mapped = data.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          targetAddress: c.target_address,
          goal: Number(c.goal),
          isVerified: c.is_verified,
          treasuryEnabled: c.treasury_enabled,
        }));
        setCampaigns(mapped);
      }
    } catch (err) {
      console.error("Error downloading campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();

    const channel = supabase
      .channel("schema-db-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "campaigns" }, () => {
        fetchCampaigns();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = (selectedCampaign || isRegisterOpen) ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedCampaign, isRegisterOpen]);

  return (
    <main className="min-h-screen bg-[#0f1117] text-white flex flex-col items-center py-10 px-4 gap-10 relative">
      
      {/* Top Utilities Navbar */}
      <div className="w-full max-w-6xl flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            ChainDonate Tracker
          </h1>
          <p className="text-xs text-gray-400">Cardano Decentralized Crowdfunding</p>
        </div>
        <Wallet onWalletChange={(wallet, addr) => { setWallet(wallet); setAddress(addr); }} />
      </div>

      {/* RENDER SEPARATED DASHBOARD GRID VIEW */}
      <CampaignDashboard 
        campaigns={campaigns}
        loading={loading}
        onSelectCampaign={(campaign) => setSelectedCampaign(campaign)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* REUSABLE SEPARATED REGISTRATION MODAL */}
      <RegisterCampaignModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onSuccess={fetchCampaigns}
      />

      {/* DYNAMIC DETAIL MODAL VIEW */}
      <CampaignModal 
        campaign={selectedCampaign}
        isOpen={selectedCampaign !== null}
        onClose={() => setSelectedCampaign(null)}
        wallet={wallet}
      />
    </main>
  );
}