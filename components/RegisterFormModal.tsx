"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";

const SIGN_MESSAGE = "I certify that I own this wallet for ChainDonate Tracker.";

const toHex = (str: string) =>
  Array.from(new TextEncoder().encode(str))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

interface RegisterCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterCampaignModal({
  isOpen,
  onClose,
  onSuccess,
}: RegisterCampaignModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 state
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  const [selectedWalletName, setSelectedWalletName] = useState("Select Wallet");
  const [connectedWallet, setConnectedWallet] = useState<MeshCardanoBrowserWallet | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  // Step 2 state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("1000");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const wallets = MeshCardanoBrowserWallet.getInstalledWallets();
    setAvailableWallets(wallets.map((w) => w.name));
  }, [isOpen]);

  const reset = () => {
    setStep(1);
    setSelectedWalletName("Select Wallet");
    setConnectedWallet(null);
    setWalletAddress("");
    setTitle("");
    setDescription("");
    setGoal("1000");
    setDocFile(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleConnect = async () => {
    if (selectedWalletName === "Select Wallet") return;
    setIsConnecting(true);
    try {
      const wallet = await MeshCardanoBrowserWallet.enable(selectedWalletName);
      const addr = await wallet.getChangeAddressBech32();
      setConnectedWallet(wallet);
      setWalletAddress(addr);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignMessage = async () => {
    if (!connectedWallet || !walletAddress) return;
    setIsSigning(true);
    try {
      await connectedWallet.signData(walletAddress, toHex(SIGN_MESSAGE));
      setStep(2);
    } catch (err) {
      console.error("Signing rejected:", err);
      alert("Wallet signing was rejected. Please try again.");
    } finally {
      setIsSigning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !goal || !walletAddress) return;
    setIsSubmitting(true);
    try {
      
      const { error } = await supabase.from("campaigns").insert([
        {
          title,
          description,
          target_address: walletAddress,
          goal: parseFloat(goal),
          treasury_enabled: treasuryEnabled,
          is_verified: false,
        },
      ]);
      if (error) throw error;
      onSuccess();
      handleClose();
    } catch (err) {
      console.error("Error creating campaign:", err);
      alert("Failed to submit campaign. Check console logs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#141722] border border-white/10 w-full max-w-lg rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0f1117]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-200">Register New Campaign</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className={step === 1 ? "text-indigo-400 font-medium" : "text-gray-600"}>
                Step 1
              </span>
              <span className="text-gray-600">→</span>
              <span className={step === 2 ? "text-emerald-400 font-medium" : "text-gray-600"}>
                Step 2
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-xs bg-white/5 px-2 py-1 rounded transition"
          >
            ✕ Close
          </button>
        </div>

        {/* Step 1 — Wallet Ownership Proof */}
        {step === 1 && (
          <div className="p-6 space-y-5 text-sm font-mono">
            <div>
              <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
                Step 1 — Wallet Ownership Proof
              </p>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Connect your Cardano wallet and sign a message to prove ownership before registering a campaign.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 block">Select Wallet Extension</label>
              <div className="flex gap-2">
                <select
                  value={selectedWalletName}
                  onChange={(e) => setSelectedWalletName(e.target.value)}
                  disabled={!!connectedWallet}
                  className="flex-1 bg-[#0f1117] border border-white/10 text-sm text-gray-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50 transition disabled:opacity-40 cursor-pointer"
                >
                  <option value="Select Wallet">Select Wallet</option>
                  {availableWallets.map((w, i) => (
                    <option key={i} value={w}>{w}</option>
                  ))}
                </select>
                {!connectedWallet && (
                  <button
                    type="button"
                    onClick={handleConnect}
                    disabled={selectedWalletName === "Select Wallet" || isConnecting}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    {isConnecting ? "Connecting..." : "Connect"}
                  </button>
                )}
              </div>
            </div>

            {connectedWallet && walletAddress && (
              <>
                <div className="bg-[#0f1117] border border-emerald-500/20 rounded-lg p-3 space-y-1">
                  <p className="text-[10px] text-emerald-400">Connected Address</p>
                  <p className="text-xs text-gray-300 break-all">{walletAddress}</p>
                </div>

                <div className="bg-[#0f1117] border border-white/5 rounded-lg p-3 space-y-1">
                  <p className="text-[10px] text-gray-500">Message to sign:</p>
                  <p className="text-xs text-gray-400 italic">"{SIGN_MESSAGE}"</p>
                </div>

                <button
                  type="button"
                  onClick={handleSignMessage}
                  disabled={isSigning}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-semibold tracking-wide transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20 cursor-pointer"
                >
                  {isSigning ? "Waiting for signature..." : "Verify Wallet Ownership"}
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 2 — Campaign Details */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm font-mono">
            <div>
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                Step 2 — Campaign Details
              </p>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Wallet verified. Fill in your campaign details and upload supporting documents.
              </p>
            </div>

            <div className="bg-[#0f1117] border border-emerald-500/20 rounded-lg p-2.5">
              <p className="text-[10px] text-emerald-400 mb-0.5">Verified Wallet Address</p>
              <p className="text-xs text-gray-400 break-all">{walletAddress}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 block">Campaign Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Department Showcase 2026"
                className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-2.5 outline-none text-gray-200 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 block">Campaign Description</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide short details about the use of funding..."
                className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-2.5 outline-none text-gray-200 focus:border-indigo-500 resize-none font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 block">Funding Goal (ADA)</label>
              <input
                required
                type="number"
                min="1"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-2.5 outline-none text-gray-200 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 block">Verification Document</label>
              <label className="flex items-center gap-3 w-full bg-[#0f1117] border border-white/10 rounded-lg p-2.5 cursor-pointer hover:border-indigo-500/50 transition group">
                <span className="text-xs text-indigo-400 group-hover:text-indigo-300 whitespace-nowrap">
                  {docFile ? "Change File" : "Upload File"}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {docFile ? docFile.name : "School permit, org charter, student ID..."}
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-3 mt-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-semibold tracking-wide transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20 cursor-pointer"
            >
              {isSubmitting ? "Registering..." : "Register Campaign"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
