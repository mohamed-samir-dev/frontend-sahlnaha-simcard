import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("missing url", { status: 400 });

  const targetUrl = url
    .replace("/image/upload/", "/raw/upload/")
    .replace(/\/fl_attachment:[^/]+\//, "/");

  // Redirect directly to the storage provider (e.g. Cloudinary) to avoid
  // proxying heavy binaries through Vercel Serverless Function and Fast Origin Transfer.
  if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
    return NextResponse.redirect(targetUrl, 302);
  }

  return new NextResponse("invalid url", { status: 400 });
}
