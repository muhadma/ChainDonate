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
