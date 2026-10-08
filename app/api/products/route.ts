import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../admin/_lib";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();
  const backendUrl = query
    ? `${getBackend()}/api/products?${query}`
    : `${getBackend()}/api/products`;

  try {
    const res = await fetch(backendUrl, forwardCookies(req, { method: "GET" }));
    const data = await res.json();
    return NextResponse.json(data, {
      status: res.status,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Backend unavailable";
    return NextResponse.json({ error: errorMsg }, { status: 502 });
  }
}
