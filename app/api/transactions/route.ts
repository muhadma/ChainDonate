import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId");

  let query = supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (campaignId) {
    query = query.eq("campaign_id", campaignId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mapped = (data || []).map((t) => ({
    id: t.id,
    txHash: t.tx_hash,
    address: t.address,
    amountAda: Number(t.amount),
    createdAt: t.created_at,
    campaignId: t.campaign_id,
  }));

  return NextResponse.json(mapped);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { txHash, address, amount, campaignId } = body;

    if (!txHash || !address || typeof amount !== "number" || !campaignId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("transactions")
      .insert([{ tx_hash: txHash, address, amount, campaign_id: campaignId }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}