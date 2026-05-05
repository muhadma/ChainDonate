import { useState } from "react";

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

// ── Mock Data ────────────────────────────────────────────────────────────────

const DONATIONS: Donation[] = [
  {
    id: "1",
    address: "addr1q...a3f9",
    amount: 8.5,
    timeAgo: "Just now",
    txHash: "tx: a9fe...c1d8",
    avatarColor: "#4f8ef7",
    avatarInitials: "a7",
  },
  {
    id: "2",
    address: "addr1q...k7e1",
    amount: 1.0,
    timeAgo: "2 minutes ago",
    txHash: "tx: 3f6c...c1d8",
    avatarColor: "#38b2ac",
    avatarInitials: "b7",
  },
  {
    id: "3",
    address: "addr1q...c1d8",
    amount: 8.25,
    timeAgo: "1 hour ago",
    txHash: "tx: d812...c6e8",
    avatarColor: "#e07b39",
    avatarInitials: "c4",
  },
  {
    id: "4",
    address: "addr1q...f2a1",
    amount: 2.0,
    timeAgo: "3 hours ago",
    txHash: "tx: 7c3b...a1f2",
    avatarColor: "#9f7aea",
    avatarInitials: "d2",
  },
  {
    id: "5",
    address: "addr1q...b9c3",
    amount: 5.0,
    timeAgo: "5 hours ago",
    txHash: "tx: 2e9d...b3c4",
    avatarColor: "#48bb78",
    avatarInitials: "e5",
  },
  {
    id: "6",
    address: "addr1q...e4d7",
    amount: 0.5,
    timeAgo: "1 day ago",
    txHash: "tx: 8f1a...d7e4",
    avatarColor: "#f6ad55",
    avatarInitials: "f9",
  },
];

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

  const filtered =
    filter === "recent" ? DONATIONS.slice(0, 3) : DONATIONS;

  return (
    <div
      style={{
        backgroundColor: "#0f1117",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
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
            {DONATIONS.length} transactions total
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#4ade80",
            }}
          >
            {DONATIONS.reduce((s, d) => s + d.amount, 0).toFixed(2)}{" "}
            <span style={{ fontSize: 10, opacity: 0.8 }}>₳</span> raised
          </span>
        </div>
      </div>
    </div>
  );
}