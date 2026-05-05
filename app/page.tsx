import Wallet from "@/components/wallet";
import CampaignHeroCard from "@/components/CampaignHero";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f1117] text-white flex flex-col items-center py-10 px-4 gap-10">
      
      {/* Hero */}
      <CampaignHeroCard />
      
      {/* Wallet (temporary or header utility) */}
      <Wallet />

      {/* Placeholder sections (for structure only) */}
      <div className="w-full max-w-md space-y-6">
        
        {/* Stats Row Placeholder */}
        <div className="text-sm text-gray-500 border border-white/10 rounded-xl p-4">
          Stats Row (to be implemented by teammate)
        </div>

        {/* Goal Card Placeholder */}
        <div className="text-sm text-gray-500 border border-white/10 rounded-xl p-4">
          Goal Progress Card (to be implemented by teammate)
        </div>

        {/* Donation Input Placeholder */}
        <div className="text-sm text-gray-500 border border-white/10 rounded-xl p-4">
          Donation Input Card (to be implemented by teammate)
        </div>

        {/* Recent Donations Placeholder */}
        <div className="text-sm text-gray-500 border border-white/10 rounded-xl p-4">
          Recent Donations (to be implemented by teammate)
        </div>

      </div>

    </main>
  );
}