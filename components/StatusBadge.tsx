export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

const styles: Record<VerificationStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  VERIFIED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function StatusBadge({ status }: { status: VerificationStatus }) {
  return (
    <span className={`text-[10px] border px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}
