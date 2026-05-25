export interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAddress: string;
  goal: number;
  isVerified: boolean;
  treasuryEnabled: boolean; // feature to be added later
}

export interface Transaction {
  id: string;
  tx_hash: string;
  address: string;
  amount: number;
  created_at: string;
}

export interface TreasuryTransaction {
  id: string;
  tx_hash: string;
  campaign_address: string;
  treasury_address: string;
  donation_amount: number;
  treasury_fee: number;
  total_amount: number;
  created_at: string;
}
