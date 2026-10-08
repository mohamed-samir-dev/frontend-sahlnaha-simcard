"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState, useMemo } from "react";
import {
  IoArrowForward,
  IoDownloadOutline,
  IoOpenOutline,
  IoDocumentTextOutline,
  IoImageOutline,
  IoShieldCheckmarkOutline,
  IoAddOutline,
  IoRemoveOutline,
  IoRefreshOutline,
} from "react-icons/io5";

function FileViewerContent() {
  const params = useSearchParams();
  const rawUrl = params.get("url") || "";
  const docTitle = params.get("title") || "عرض الوثيقة الرسمية";

  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<"google" | "direct">("google");
  const [imgError, setImgError] = useState(false);

  // Clean URL to prevent forced download attachments
  const cleanUrl = useMemo(() => {
    if (!rawUrl) return "";
    return rawUrl.replace(/\/fl_attachment(:[^/]+)?\//, "/");
  }, [rawUrl]);

  // Determine file type
  const isPdf = useMemo(() => {
    if (!cleanUrl) return false;
    const lower = cleanUrl.toLowerCase();
    return (
      lower.endsWith(".pdf") ||
      lower.includes(".pdf?") ||
      lower.includes("/raw/upload/") ||
      lower.includes("/docs/")
    );
  }, [cleanUrl]);

  const isImage = useMemo(() => {
    if (!cleanUrl) return false;
    if (isPdf) return false;
    return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(cleanUrl) || cleanUrl.includes("/image/upload/");
  }, [cleanUrl, isPdf]);

  if (!cleanUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4" dir="rtl">
        <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center text-3xl">
            <IoDocumentTextOutline />
          </div>
          <h2 className="text-xl font-bold">لم يتم العثور على وثيقة</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            الرابط المطلوب لا يحتوي على ملف متاح للعرض حالياً.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#47A557] hover:bg-[#129928] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-green-900/30"
          >
            <IoArrowForward size={16} />
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(cleanUrl)}&embedded=true`;
  const downloadUrl = `/api/file-proxy?url=${encodeURIComponent(cleanUrl)}&download=true`;

  return (
    <div className="min-h-screen flex flex-col bg-[#0b140e] text-white select-none" dir="rtl">
      {/* ── Top Bar ── */}
      <header className="bg-[#071f0d]/90 backdrop-blur-md border-b border-[#47A557]/20 px-3 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 hover:text-white text-xs sm:text-sm font-semibold transition shrink-0"
          >
            <IoArrowForward size={14} />
            <span className="hidden sm:inline">العودة للمتجر</span>
            <span className="sm:hidden">الرئيسية</span>
          </Link>

          <div className="h-5 w-px bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-[#47A557]/20 border border-[#47A557]/40 text-[#80C78D] flex items-center justify-center shrink-0">
              {isImage ? <IoImageOutline size={18} /> : <IoDocumentTextOutline size={18} />}
            </span>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[180px] sm:max-w-md">
                {docTitle}
              </h1>
              <p className="text-[10px] text-[#80C78D] flex items-center gap-1">
                <IoShieldCheckmarkOutline size={12} />
                وثيقة رسمية معتمدة
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Zoom Controls for Images */}
          {isImage && (
            <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                title="تصغير"
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition"
              >
                <IoRemoveOutline size={16} />
              </button>
              <button
                onClick={() => setZoom(1)}
                title="إعادة ضبط الحجم"
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white text-xs font-mono transition"
              >
                <IoRefreshOutline size={16} />
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
                title="تكبير"
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition"
              >
                <IoAddOutline size={16} />
              </button>
            </div>
          )}

          {/* Viewer Mode Toggle for PDFs */}
          {isPdf && (
            <div className="hidden md:flex items-center gap-1 bg-white/10 rounded-xl p-1 border border-white/10 text-xs">
              <button
                onClick={() => setViewMode("google")}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === "google" ? "bg-[#47A557] text-white font-bold" : "text-white/70 hover:text-white"
                }`}
              >
                Google Docs
              </button>
              <button
                onClick={() => setViewMode("direct")}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === "direct" ? "bg-[#47A557] text-white font-bold" : "text-white/70 hover:text-white"
                }`}
              >
                مباشر
              </button>
            </div>
          )}

          {/* Open Raw / New Tab */}
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="فتح في نافذة كاملة"
            className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition border border-white/10"
          >
            <IoOpenOutline size={14} />
            <span className="hidden sm:inline">نافذة جديدة</span>
          </a>

          {/* Download */}
          <a
            href={downloadUrl}
            download
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#47A557] hover:bg-[#129928] text-white rounded-xl text-xs font-bold transition shadow-md shadow-green-900/40"
          >
            <IoDownloadOutline size={15} />
            <span>تحميل</span>
          </a>
        </div>
      </header>

      {/* ── Main Viewer Body ── */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        {/* If Image Document */}
        {isImage && !imgError ? (
          <div className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 bg-[#0b140e]">
            <div
              className="relative transition-transform duration-200 ease-out max-w-full flex justify-center"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cleanUrl}
                alt={docTitle}
                onError={() => setImgError(true)}
                className="max-h-[85vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border-4 border-white/90 bg-white"
              />
            </div>
          </div>
        ) : (
          /* If PDF or Fallback Document */
          <div className="flex-1 w-full h-full relative flex flex-col bg-[#141a16]">
            {viewMode === "google" ? (
              <iframe
                src={googleViewerUrl}
                className="w-full h-full border-0 flex-1"
                title={docTitle}
                allowFullScreen
              />
            ) : (
              <object
                data={cleanUrl}
                type="application/pdf"
                className="w-full h-full border-0 flex-1"
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                  <p className="text-gray-300 text-sm">
                    يتعذر على متصفحك عرض ملف PDF مباشرة داخل الصفحة.
                  </p>
                  <a
                    href={cleanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-[#47A557] hover:bg-[#129928] text-white rounded-xl text-sm font-bold shadow"
                  >
                    فتح ملف PDF مباشرة
                  </a>
                </div>
              </object>
            )}

            {/* Bottom helper notification bar */}
            <div className="bg-[#071f0d]/95 border-t border-[#47A557]/20 px-4 py-2 flex items-center justify-between text-xs text-white/70 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#80C78D] animate-pulse" />
                إذا لم يظهر الملف تلقائياً على جهازك، يمكنك النقر على &quot;نافذة جديدة&quot; أو &quot;تحميل&quot;.
              </span>
              <a
                href={cleanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#80C78D] hover:underline font-bold"
              >
                رابط مباشر للملف ↗
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function FileViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0b140e] text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#47A557] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-300 font-medium">جاري فتح الوثيقة...</p>
          </div>
        </div>
      }
    >
      <FileViewerContent />
    </Suspense>
  );
}
