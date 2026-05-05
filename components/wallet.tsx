'use client';
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
import { useState, useEffect, ChangeEvent } from "react";

const Wallet = () => {
    const [availableWallets, setAvailableWallets] = useState<string[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<string>("Disconnected");
    const [wallet, setWallet] = useState<MeshCardanoBrowserWallet | null>(null);

    const connectWallet = async () => {
        try {
            if (selectedWallet === "Disconnected") return;

            const wallet = await MeshCardanoBrowserWallet.enable(selectedWallet);
            console.log("Available Balance: ", await wallet.getBalanceMesh());
            setWallet(wallet);
        } catch (error) {
            console.error("Error connecting to wallet:", error);
        }
    };

    useEffect(() => {
        const getAvailableWallets = async () => {
            const wallets = await MeshCardanoBrowserWallet.getInstalledWallets();
            const walletNames = wallets.map(wallet => wallet.name);
            setAvailableWallets(walletNames);
        }

        getAvailableWallets();
    }, []);

    const handleSelectedWalletChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedWallet(e.target.value);
        console.log(`Selected wallet: ${e.target.value}`);
    };

    return (
        <div>
            <h1>Wallet Component</h1>
            <select value={selectedWallet} onChange={handleSelectedWalletChange}  >
                <option value="Disconnected">Select Wallet</option>
                {availableWallets.map((w, i) => (
                    <option key={i} value={w}>{w}</option>
                ))}
            </select>
            <button onClick={connectWallet}>Connect Wallet</button>
        </div>
    );
}

export default Wallet;