import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../../_lib";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${getBackend()}/api/admin/brands/home-settings`, forwardCookies(req, {}));
    const data = await res.json();
    return NextResponse.json(data, {
      status: res.status,
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Backend unavailable";
    return NextResponse.json({ error: errorMsg }, { status: 502 });
  }
}
