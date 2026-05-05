"use client";

import { useState } from "react";

interface DonateButtonProps {
  onDonate?: (amount: number) => void;
}

const PRESET_AMOUNTS = [0.1, 0.5, 1.0, 2.0];

// ── Validation ───────────────────────────────────────────────────────────────

function isValidAmountInput(val: string): boolean {
  // Allow empty string (user clearing input)
  if (val === "") return true;
  // Allow digits with optional single decimal point
  if (!/^\d*\.?\d*$/.test(val)) return false;
  // Prevent leading zeros like "007" (but allow "0" and "0.5")
  if (/^0\d/.test(val)) return false;
  return true;
}

function isConfirmable(val: string): boolean {
  const parsed = parseFloat(val);
  return !isNaN(parsed) && parsed > 0 && isFinite(parsed);
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function DonateButton({ onDonate }: DonateButtonProps) {
  const [amount, setAmount] = useState<string>("0.5");
  const [selected, setSelected] = useState<number | null>(0.5);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePreset = (value: number) => {
    setSelected(value);
    setAmount(value.toString());
    setConfirmed(false);
    setError(null);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isValidAmountInput(val)) return; // silently reject invalid chars
    setSelected(null);
    setConfirmed(false);
    setAmount(val);

    // Show error only if user has typed something non-empty but invalid
    if (val !== "" && !isConfirmable(val)) {
      setError("Enter a valid amount greater than 0");
    } else {
      setError(null);
    }
  };

  const handleConfirm = async () => {
    if (!isConfirmable(amount)) {
      setError("Enter a valid amount greater than 0");
      return;
    }

    setConfirming(true);
    setError(null);

    // This is just a fake wait — no real tx happens 
    // CHANGE THIS SECTION for real TX !!!!!
    try {
      // ─────────────────────────────────────────────────────────────
      // TODO (backend)
      // ─────────────────────────────────────────────────────────────
      await new Promise((res) => setTimeout(res, 1200));

      setConfirmed(true);
      onDonate?.(parseFloat(amount));
      setTimeout(() => setConfirmed(false), 3000);

    } catch (err: any) {
      setError(err?.message ?? "Transaction failed. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#161b27",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "18px 20px",
        boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
        fontFamily: "'JetBrains Mono', monospace",
        boxSizing: "border-box",
      }}
    >
      {/* Label */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#cbd5e1",
          marginBottom: 12,
          letterSpacing: "0.01em",
        }}
      >
        Make a donation
      </div>

      {/* Input Row */}
      <div style={{ display: "flex", gap: 8, marginBottom: error ? 6 : 12 }}>
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={handleInput}
          placeholder="0.0"
          style={{
            flex: 1,
            backgroundColor: "#0f1117",
            border: `1px solid ${error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 8,
            color: "#e2e8f0",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
            padding: "10px 14px",
            outline: "none",
            transition: "border-color 0.15s ease",
          }}
          onFocus={(e) =>
          (e.target.style.borderColor = error
            ? "rgba(248,113,113,0.7)"
            : "rgba(74,222,128,0.4)")
          }
          onBlur={(e) =>
          (e.target.style.borderColor = error
            ? "rgba(248,113,113,0.5)"
            : "rgba(255,255,255,0.1)")
          }
        />

        <button
          onClick={handleConfirm}
          disabled={!isConfirmable(amount) || confirming}
          style={{
            backgroundColor: confirmed ? "#166534" : confirming ? "#14532d" : "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
            padding: "10px 16px",
            cursor: !isConfirmable(amount) || confirming ? "not-allowed" : "pointer",
            opacity: !isConfirmable(amount) ? 0.5 : 1,
            transition: "background-color 0.2s ease, opacity 0.2s ease",
            whiteSpace: "nowrap",
            letterSpacing: "0.02em",
          }}
        >
          {confirming ? "Sending..." : confirmed ? "✓ Sent!" : "Confirm donation"}
        </button>
      </div>

      {/* Inline validation error */}
      {error && (
        <div
          style={{
            fontSize: 11,
            color: "#f87171",
            marginBottom: 10,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.01em",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Preset Buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        {PRESET_AMOUNTS.map((value) => (
          <button
            key={value}
            onClick={() => handlePreset(value)}
            style={{
              flex: 1,
              backgroundColor:
                selected === value ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.05)",
              border:
                selected === value
                  ? "1px solid rgba(74,222,128,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 7,
              color: selected === value ? "#4ade80" : "#94a3b8",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
              padding: "7px 0",
              cursor: "pointer",
              transition: "all 0.15s ease",
              letterSpacing: "0.02em",
            }}
          >
            {value.toFixed(1)} ADA
          </button>
        ))}
      </div>
    </div>
  );
}