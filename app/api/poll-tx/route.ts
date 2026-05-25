import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { txHash } = await req.json();

  const res = await fetch(`https://cardano-preview.blockfrost.io/api/v0/txs/${txHash}`, {
    headers: {
      "project_id": process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID!,
    },
  });

  if (res.status === 404) return NextResponse.json({ confirmed: false });
  if (!res.ok) return NextResponse.json({ confirmed: false });

  return NextResponse.json({ confirmed: true });
}