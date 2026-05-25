'use client';

interface ArchivedCampaignProps {
  campaignTitle: string;
  totalRaised: number;
  donationCount: number;
  explorerUrl: string;
}

export default function ArchivedCampaign({
  campaignTitle,
  totalRaised,
  donationCount,
  explorerUrl,
}: ArchivedCampaignProps) {
  return (
    <div className="rounded-xl border border-emerald-400/20 bg-[#141722] overflow-hidden">
      <div className="bg-emerald-400/5 border-b border-emerald-400/10 px-5 py-4 flex items-start gap-3">
        <span className="text-emerald-400 text-lg">&#10003;</span>
        <div>
          <p className="text-emerald-400 font-mono font-semibold text-sm">Campaign Completed</p>
          <p className="text-slate-400 font-mono text-xs mt-1">
            This campaign has reached its goal and is now closed to donations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-white/5 border-b border-white/5">
        <div className="px-5 py-4">
          <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-1">Total Raised</p>
          <p className="text-white font-mono font-bold text-lg">
            {totalRaised.toFixed(2)} <span className="text-emerald-400 text-sm">{'\u20B3'}</span>
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-1">Donations</p>
          <p className="text-white font-mono font-bold text-lg">
            {donationCount} <span className="text-gray-500 text-sm">transactions</span>
          </p>
        </div>
      </div>

      <div className="px-5 py-4">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-emerald-400 bg-white/5 hover:bg-emerald-400/10 border border-white/10 hover:border-emerald-400/30 px-3 py-2 rounded-lg transition-all duration-200"
        >
          View on CardanoScan &rarr;
        </a>
      </div>
    </div>
  );
}
