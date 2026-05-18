'use client';

import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
import { useState, useEffect, ChangeEvent } from "react";

type WalletProps = {
  onWalletChange: (wallet: MeshCardanoBrowserWallet | null, address: string) => void;
};

export type WalletHandle = {
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  wallet: MeshCardanoBrowserWallet | null;
};

const Wallet = ({ onWalletChange }: WalletProps) => {
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>("Disconnected");
  const [wallet, setWallet] = useState<MeshCardanoBrowserWallet | null>(null);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const getAvailableWallets = async () => {
      const wallets = await MeshCardanoBrowserWallet.getInstalledWallets();
      setAvailableWallets(wallets.map(w => w.name));
    };
    getAvailableWallets();
  }, []);

  const connectWallet = async () => {
    try {
      if (selectedWallet === "Disconnected") return;
      const connected = await MeshCardanoBrowserWallet.enable(selectedWallet);
      const addr = await connected.getChangeAddressBech32();
      setWallet(connected);
      const shortened = addr.slice(0, 10) + "..." + addr.slice(-6);
      setAddress(shortened);
      onWalletChange(connected, addr);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const disconnect = () => {
    setWallet(null);
    setAddress("");
    setSelectedWallet("Disconnected");
    onWalletChange(null, "");
  };

  const handleSelectedWalletChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedWallet(e.target.value);
  };

  // ── Connected state ──────────────────────────────────────────
  if (wallet && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 bg-[#1a1d27] border border-white/10 rounded-full px-4 py-1.5 text-sm font-mono text-emerald-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {address}
        </div>
        <button
          onClick={disconnect}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // ── Disconnected state ───────────────────────────────────────
  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedWallet}
        onChange={handleSelectedWalletChange}
        className="bg-[#1a1d27] border border-white/10 text-sm text-gray-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500/50 transition-colors cursor-pointer assessment-select"
      >
        <option value="Disconnected">Select Wallet</option>
        {availableWallets.map((w, i) => (
          <option key={i} value={w}>{w}</option>
        ))}
      </select>
      <button
        onClick={connectWallet}
        disabled={selectedWallet === "Disconnected"}
        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-900/10"
      >
        Connect
      </button>
    </div>
  );
};

export default Wallet;