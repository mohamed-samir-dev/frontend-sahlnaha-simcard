import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("missing url", { status: 400 });

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return new NextResponse("invalid url", { status: 400 });
  }

  const isDownload = req.nextUrl.searchParams.get("download") === "true";

  // Clean attachments for inline view
  const cleanUrl = url.replace(/\/fl_attachment(:[^/]+)?\//, "/");

  // If download is requested and it's Cloudinary, insert fl_attachment
  if (isDownload && cleanUrl.includes("cloudinary.com") && cleanUrl.includes("/upload/")) {
    const downloadUrl = cleanUrl.replace("/upload/", "/upload/fl_attachment/");
    return NextResponse.redirect(downloadUrl, 302);
  }

  return NextResponse.redirect(cleanUrl, 302);
}
