import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../../admin/_lib";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${getBackend()}/api/products/featured`, {
      ...forwardCookies(req, { method: "GET" }),
      next: { revalidate: 86400, tags: ["products"] },
    });
    if (!res.ok) return NextResponse.json([], { status: 200 });
    const data: unknown[] = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : [], {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
