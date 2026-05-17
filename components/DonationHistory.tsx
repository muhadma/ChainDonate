"use client";
import { timeAgoFrom, colorFromAddr, initialsFromAddress } from "@/lib/formatter";
import { useState } from "react";
import { useEffect } from "react";

// Types 


interface Donation {
  id: string;
  address: string;
  amount: number;
  timeAgo: string;
  txHash: string;
  avatarColor: string;
  avatarInitials: string;
}
 

// ── Sub-components ───────────────────────────────────────────────────────────

function Avatar({
  color,
  initials,
}: {
  color: string;
  initials: string;
}) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}

function DonationRow({ donation }: { donation: Donation }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 8,
        backgroundColor: hovered ? "rgba(255,255,255,0.04)" : "transparent",
        transition: "background-color 0.15s ease",
        cursor: "default",
      }}
    >
      {/* Avatar */}
      <Avatar color={donation.avatarColor} initials={donation.avatarInitials} />

      {/* Address + time */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#e2e8f0",
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {donation.address}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#64748b",
            marginTop: 2,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {donation.timeAgo}
        </div>
      </div>

      {/* Amount + tx */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#4ade80",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          +{donation.amount.toFixed(2)}{" "}
          <span style={{ fontSize: 10, opacity: 0.8 }}>₳</span>
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#475569",
            marginTop: 2,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {donation.txHash}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function DonationHistory() {
  const [filter, setFilter] = useState<"all" | "recent">("all");
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();

        console.log("RAW DATA:", data);
        
        const mapped: Donation[] = data.map((d: any) => ({
          id: d.id,
          address: d.address,
          amount: Number(d.amountAda),
          timeAgo: timeAgoFrom(d.createdAt),
          txHash: d.txHash,
          avatarColor: colorFromAddr(d.address),
          avatarInitials: initialsFromAddress(d.address),
        }));

        setDonations(mapped);
      } catch (err) {
        console.error("Failed to fetch donations", err);
      }
    };

    fetchDonations();

    const interval = setInterval(fetchDonations, 10000);

    return () => clearInterval(interval);
  }, []);

  const filtered =
    filter === "recent" ? donations.slice(0, 3) : donations;

  return (
    <div
      style={{ fontFamily: "'JetBrains Mono', monospace", }}>
      {/* Card */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#161b27",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.07)",
          overflow: "hidden",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#cbd5e1",
              letterSpacing: "0.01em",
            }}
          >
            Recent donations
          </span>

          {/* Filter pills */}
          <div
            style={{
              display: "flex",
              gap: 4,
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: 6,
              padding: 3,
            }}
          >
            {(["all", "recent"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? "rgba(255,255,255,0.12)" : "transparent",
                  border: "none",
                  borderRadius: 4,
                  color: filter === f ? "#e2e8f0" : "#64748b",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: "capitalize",
                  letterSpacing: "0.03em",
                }}
              >
                {f === "all" ? "View all" : "Recent"}
              </button>
            ))}
          </div>
        </div>

        {/* Donation list */}
        <div style={{ padding: "6px 6px 10px" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "32px 20px",
                textAlign: "center",
                color: "#475569",
                fontSize: 13,
              }}
            >
              No donations yet.
            </div>
          ) : (
            filtered.map((donation) => (
              <DonationRow key={donation.id} donation={donation} />
            ))
          )}
        </div>

        {/* Footer summary */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "#475569" }}>
            {donations.length} transactions total
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#4ade80",
            }}
          >
            {donations.reduce((s, d) => s + d.amount, 0).toFixed(2)}{" "}
            <span style={{ fontSize: 10, opacity: 0.8 }}>₳</span> raised
          </span>
        </div>
      </div>
    </div>
  );
}