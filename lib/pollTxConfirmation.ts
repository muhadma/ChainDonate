import { supabase } from "@/lib/supabase";

export const pollTxConfirmation = async (
  hash: string
): Promise<boolean> => {
  const maxAttempts = 20;
  const intervalMs = 15_000;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((res) => setTimeout(res, intervalMs));

    try {
      console.log("Polling hash:", hash);

      const res = await fetch("/api/poll-tx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash: hash }),
      });

      const data = await res.json();

      console.log("Poll response:", data);

      if (data.confirmed) {
        const { data: updated, error } = await supabase
          .from("transactions")
          .update({
            status: "confirmed",
            confirmed_at: new Date().toISOString(),
          })
          .eq("tx_hash", hash)
          .select();

        console.log("UPDATED ROW:", updated);
        console.log("UPDATE ERROR:", error);

        return true;
      }
    } catch (err) {
      console.warn("Poll attempt failed:", err);
    }
  }

  const { data: failedData, error: failedError } = await supabase
    .from("transactions")
    .update({ status: "failed" })
    .eq("tx_hash", hash)
    .select();

  console.log("FAILED UPDATE:", failedData);
  console.log("FAILED ERROR:", failedError);

  return false;
};