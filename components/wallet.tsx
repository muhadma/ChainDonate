'use client';
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
import { useState, useEffect, ChangeEvent } from "react";

type WalletProps = {
    onAddressChange: (address: string) => void;
};

const Wallet = ({ onAddressChange }: WalletProps) => {
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
            onAddressChange(shortened);  // ← notify page.tsx
        } catch (error) {
            console.error("Error connecting to wallet:", error);
        }
    };

    const disconnect = () => {
        setWallet(null);
        setAddress("");
        setSelectedWallet("Disconnected");
        onAddressChange("");  // ← clear address in page.tsx
    };

    const handleSelectedWalletChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedWallet(e.target.value);
    };

    // ── Connected state ──────────────────────────────────────────
    if (wallet && address) {
        return (
            <button
                onClick={disconnect}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
                Disconnect
            </button>
        );
    }

    // ── Disconnected state ───────────────────────────────────────
    return (
        <div className="flex items-center gap-2">
            <select
                value={selectedWallet}
                onChange={handleSelectedWalletChange}
                className="bg-[#1a1d27] border border-white/10 text-sm text-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-500/50 transition-colors cursor-pointer"
            >
                <option value="Disconnected">Select Wallet</option>
                {availableWallets.map((w, i) => (
                    <option key={i} value={w}>{w}</option>
                ))}
            </select>
            <button
                onClick={connectWallet}
                disabled={selectedWallet === "Disconnected"}
                className="bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
                Connect
            </button>
        </div>
    );
};

export default Wallet;