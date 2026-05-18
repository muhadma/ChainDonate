"use client";

import React, { useState } from "react";
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
import { sendLovelace } from "@/lib/transaction";
import { supabase } from "@/lib/supabase";

interface DonateButtonProps {
  wallet: MeshCardanoBrowserWallet | null;
  fundAddress: string; // This is the campaign's target address passed from the modal
  onDonate?: (amount: number, txHash: string) => void;
}

const PRESET_AMOUNTS = [1.0, 2.0, 5.0, 10.0];
const MIN_ADA_REQUIRED = 1.0;

function isValidAmountInput(val: string): boolean {
  if (val === "") return true;
  if (!/^\d*\.?\d*$/.test(val)) return false;
  if (/^0\d/.test(val)) return false;
  return true;
}

function isConfirmable(val: string): boolean {
  const parsed = parseFloat(val);
  return !isNaN(parsed) && parsed >= MIN_ADA_REQUIRED && isFinite(parsed);
}

export default function DonateButton({ wallet, fundAddress, onDonate }: DonateButtonProps) {
  const [amount, setAmount] = useState<string>("1.0");
  const [selected, setSelected] = useState<number | null>(1.0);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handlePreset = (value: number) => {
    setSelected(value);
    setAmount(value.toString());
    setConfirmed(false);
    setError(null);
    setStatus("idle");
    setTxHash(null);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isValidAmountInput(val)) return;
    setSelected(null);
    setConfirmed(false);
    setAmount(val);

    if (val !== "" && parseFloat(val) < MIN_ADA_REQUIRED) {
      setError(`Minimum donation is ${MIN_ADA_REQUIRED} ADA to prevent network UTXO dust rejections.`);
    } else {
      setError(null);
    }
  };

  const handleConfirm = async () => {
    if (!wallet) {
      setError("Wallet not connected");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < MIN_ADA_REQUIRED) {
      setError(`Transaction blocked: Amount must be at least ${MIN_ADA_REQUIRED} ADA.`);
      return;
    }

    try {
      // Ensure wallet is unlocked before generating payload
      await wallet.getChangeAddressBech32();
    } catch (err) {
      setError("⚠ Wallet is locked. Please unlock or reconnect your wallet.");
      return;
    }

    setConfirming(true);
    setError(null);
    setStatus("idle");

    try {
      const lovelace = Math.floor(parsedAmount * 1_000_000).toString();

      // Submit direct peer-to-peer payload via Mesh SDK to the destination wallet
      const minedTxHash = await sendLovelace(wallet, {
        address: fundAddress,
        amount: lovelace,
      });

      // Insert transaction history straight into Supabase using the campaign's address
      const { error: dbError } = await supabase
        .from("transactions")
        .insert([
          {
            tx_hash: minedTxHash,
            address: fundAddress, // Maps perfectly to your transaction schema's address column
            amount: parsedAmount,
          },
        ]);

      if (dbError) throw dbError;

      setTxHash(minedTxHash);
      setStatus("success");
      setConfirmed(true);

      onDonate?.(parsedAmount, minedTxHash);
      setTimeout(() => setConfirmed(false), 3000);

    } catch (err: any) {
      console.error("Cardano Pipeline Failure:", err);
      setStatus("error");

      if (err?.message?.includes("BabbageOutputTooSmallUTxO")) {
        setError("Cardano Ledger Exception: Target amount is below the network's protocol dust limits.");
      } else {
        setError(err?.message ?? "Transaction payload writing failed");
      }
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="w-full bg-[#161b27] rounded-xl border border-white/[0.07] p-5 shadow-2xl font-mono box-border space-y-3">
      
      {/* Label */}
      <div className="text-xs sm:text-sm font-semibold text-slate-300 tracking-wide">
        Make a donation
      </div>

      {/* Input Row */}
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={handleInput}
          placeholder="0.0"
          className={`flex-1 bg-[#0f1117] rounded-lg text-sm font-semibold font-mono p-2.5 px-3.5 text-slate-200 outline-none transition duration-150 ${
            error 
              ? "border border-red-500/50 focus:border-red-500/70" 
              : "border border-white/10 focus:border-emerald-500/40"
          }`}
        />

        <button
          onClick={handleConfirm}
          disabled={!isConfirmable(amount) || confirming}
          className={`text-white border-none rounded-lg text-xs sm:text-sm font-bold font-mono p-2.5 px-4 whitespace-nowrap tracking-wide transition-all duration-200 ${
            confirmed 
              ? "bg-green-800 cursor-default" 
              : confirming 
                ? "bg-green-900 cursor-not-allowed" 
                : !isConfirmable(amount)
                  ? "bg-emerald-600 opacity-50 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
          }`}
        >
          {confirming ? "Sending..." : confirmed ? "✓ Sent!" : "Confirm donation"}
        </button>
      </div>

      {/* Inline validation error info */}
      {error && (
        <div className="text-[11px] text-red-400 tracking-wide leading-relaxed">
          ⚠ {error}
        </div>
      )}

      {/* Preset Amount Grid Utilities */}
      <div className="flex gap-2 w-full">
        {PRESET_AMOUNTS.map((value) => (
          <button
            key={value}
            onClick={() => handlePreset(value)}
            className={`flex-1 rounded-md text-[11px] font-semibold font-mono py-2 transition duration-150 tracking-wide border cursor-pointer ${
              selected === value
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                : "bg-white/5 border-white/[0.08] text-slate-400 hover:text-slate-300 hover:bg-white/10"
            }`}
          >
            {value.toFixed(1)} ADA
          </button>
        ))}
      </div>

      {/* Hash Receipts Feed */}
      {status === "success" && txHash && (
        <div className="mt-3 text-[11px] text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 p-3 rounded-lg space-y-1 break-all">
          <div className="font-bold">✅ Donation successful!</div>
          <div className="text-slate-400 text-[10px]">TX Hash:</div>
          <div className="select-all font-mono text-[10px] bg-black/30 p-1.5 rounded border border-white/5">{txHash}</div>
        </div>
      )}
    </div>
  );
}