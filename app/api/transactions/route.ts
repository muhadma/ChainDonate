import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET → fetch donation history
export async function GET() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // map to frontend format
  const mapped = (data || []).map((t) => ({
    id: t.id,
    txHash: t.tx_hash,
    address: t.address,
    amountAda: Number(t.amount),
    createdAt: t.created_at,
  }));

  return NextResponse.json(mapped);
}

// POST → save donation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { txHash, address, amount } = body;

    if (!txHash || !address || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          tx_hash: txHash,
          address,
          amount,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { id: data.id },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}