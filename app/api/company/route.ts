import { NextResponse } from "next/server";
import { getBackend } from "../admin/_lib";

export async function GET() {
  try {
    const res = await fetch(`${getBackend()}/api/admin/company`, {
      next: { revalidate: 86400, tags: ["company"] },
    });
    const data = await res.json();
    return NextResponse.json(data, {
      status: res.status,
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Backend unavailable";
    return NextResponse.json({ error: errorMsg }, { status: 502 });
  }
}
