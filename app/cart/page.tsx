"use client";

import { useRef, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ChevronRight, Home, Truck, Lock, MessageCircle, BadgeCheck, ShieldCheck, Zap, Package } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import type { CustomerInfo } from "../store/cartStore";
import CartItem from "./components/CartItem";
import CustomerForm from "./components/CustomerForm";
import AnimatedBackground from "../components/AnimatedBackground";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, totalPrice, totalItems, setCustomer, customer } = useCartStore();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const scrolled = useRef(false);

  useEffect(() => { if (!scrolled.current) { scrolled.current = true; window.scrollTo(0, 0); } }, []);

  const total = mounted ? totalPrice() : 0;
  const count = mounted ? totalItems() : 0;

  if (!mounted) return null;

  if (items.length === 0)
    return (
      <>
        <AnimatedBackground />
        <main className="min-h-[100dvh] flex flex-col items-center justify-center gap-6 px-4" dir="rtl">
          <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl border border-[#003160]" style={{ background: "linear-gradient(135deg, #001F44, #00244F)" }}>
            <ShoppingBag className="w-12 h-12 text-[#FC0]" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white">سلتك فارغة!</h2>
            <p className="text-white/50 text-sm max-w-xs mx-auto">ابدأ بإضافة المنتجات وارجع هنا لإتمام الطلب</p>
          </div>
          <button onClick={() => router.push("/")} className="cart-btn w-48">
            🛍️ تصفح المنتجات
          </button>
        </main>
      </>
    );

  return (
    <div className="min-h-[100dvh]" dir="rtl">
      <AnimatedBackground />

      {/* HEADER */}
      <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-[#003160]/60" style={{ background: "rgba(0,19,49,0.9)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-white/60 hover:text-white transition text-sm font-bold">
            <ChevronRight className="w-4 h-4" />
            <span className="hidden sm:inline">رجوع</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#FC0]" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FC0] text-[#001331] text-[9px] font-black rounded-full flex items-center justify-center">
                {count}
              </span>
            </div>
            <span className="text-base font-black text-white">السلة</span>
          </div>

          <Link href="/" className="w-9 h-9 rounded-xl border border-[#003160] hover:border-[#FC0]/40 flex items-center justify-center transition" style={{ background: "#001F44" }}>
            <Home className="w-4 h-4 text-white/70" />
          </Link>
        </div>
      </header>

      {/* BODY */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Summary Bar */}
        <div className="rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 relative overflow-hidden border border-[#003160]" style={{ background: "linear-gradient(135deg, #001F44 0%, #00244F 100%)" }}>
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #FC0 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white/40 text-xs mb-1">إجمالي الطلب</p>
              <p className="text-3xl sm:text-4xl font-black text-[#FC0]">
                {fmt(total)} <span className="text-sm font-medium text-white/40">ر.س</span>
              </p>
            </div>
            <div className="flex gap-5 sm:gap-6">
              <MiniStat icon={<ShieldCheck size={14} />} label="ضمان" value="سنتين" />
              <MiniStat icon={<Zap size={14} />} label="توصيل" value="مجاني" />
              <MiniStat icon={<Package size={14} />} label="منتجات" value={`${count}`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* RIGHT: Products + Form */}
          <div className="lg:col-span-8 space-y-6">

            {/* Products */}
            <section>
              <SectionHeader title="المنتجات" badge={`${count} منتج`} />
              <div className="space-y-3 mt-4">
                {items.map(({ product, qty }) => (
                  <CartItem key={product._id} product={product} qty={qty} onUpdateQty={updateQty} onRemove={removeItem} />
                ))}
              </div>
            </section>

            {/* Mobile Summary */}
            <section className="lg:hidden">
              <SectionHeader title="ملخص الطلب" />
              <div className="mt-3">
                <OrderSummaryMobile items={items} total={total} />
              </div>
            </section>

            {/* Customer Form */}
            <section>
              <SectionHeader title="بيانات الطلب" />
              <div className="mt-4">
                <CustomerForm
                  total={total}
                  itemCount={count}
                  initialData={customer}
                  onSubmit={(info: CustomerInfo) => {
                    setCustomer(info);
                    router.push("/checkout");
                  }}
                />
              </div>
            </section>
          </div>

          {/* LEFT: Sticky Summary (desktop) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="rounded-2xl border border-[#003160] overflow-hidden" style={{ background: "#001F44" }}>
                <div className="px-5 py-4 border-b border-[#003160]" style={{ background: "#001331" }}>
                  <h3 className="text-sm font-black text-white">ملخص الطلب</h3>
                </div>
                <div className="p-5 space-y-3">
                  {items.map(({ product, qty }) => {
                    const price = product.salePrice ?? product.originalPrice ?? product.price;
                    return (
                      <div key={product._id} className="flex justify-between items-start gap-2">
                        <p className="text-xs text-white/50 leading-relaxed line-clamp-1 flex-1">{product.name} <span className="text-white/30">×{qty}</span></p>
                        <span className="text-xs font-bold text-white/80 whitespace-nowrap">{fmt(price * qty)} ر.س</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-dashed border-[#003160] pt-3 flex justify-between text-xs">
                    <span className="text-white/40 flex items-center gap-1.5"><Truck size={12} /> التوصيل</span>
                    <span className="font-bold text-emerald-400">مجاني ✓</span>
                  </div>
                  <div className="border-t border-[#003160] pt-3 flex justify-between items-center">
                    <span className="text-sm font-bold text-white/60">الإجمالي</span>
                    <span className="text-2xl font-black text-[#FC0]">{fmt(total)} <span className="text-xs font-medium text-white/40">ر.س</span></span>
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div className="rounded-2xl border border-[#003160] p-4 grid grid-cols-2 gap-2" style={{ background: "#001F44" }}>
                <TrustBadge icon={<Lock size={13} />} text="دفع آمن" />
                <TrustBadge icon={<Truck size={13} />} text="شحن سريع" />
                <TrustBadge icon={<BadgeCheck size={13} />} text="ضمان رسمي" />
                <TrustBadge icon={<MessageCircle size={13} />} text="دعم واتساب" />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-1 h-5 rounded-full bg-[#FC0]" />
      <h2 className="text-sm sm:text-base font-black text-white">{title}</h2>
      {badge && <span className="text-[10px] font-bold text-[#FC0]/70 bg-[#FC0]/10 border border-[#FC0]/20 px-2 py-0.5 rounded-full">{badge}</span>}
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="w-7 h-7 rounded-full border border-[#003160] flex items-center justify-center mx-auto mb-1 text-[#FC0]" style={{ background: "#001331" }}>{icon}</div>
      <p className="text-white/40 text-[9px]">{label}</p>
      <p className="text-white text-[11px] font-bold">{value}</p>
    </div>
  );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#003160] px-3 py-2.5" style={{ background: "#001331" }}>
      <span className="text-[#FC0]">{icon}</span>
      <span className="text-[11px] font-bold text-white/60">{text}</span>
    </div>
  );
}

function OrderSummaryMobile({ items, total }: { items: { product: { _id: string; name: string; salePrice?: number; originalPrice?: number; price: number }; qty: number }[]; total: number }) {
  return (
    <div className="rounded-2xl border border-[#003160] p-4 space-y-2.5" style={{ background: "#001F44" }}>
      {items.map(({ product, qty }) => {
        const price = product.salePrice ?? product.originalPrice ?? product.price;
        return (
          <div key={product._id} className="flex justify-between items-center">
            <p className="text-xs text-white/50 line-clamp-1 flex-1 ml-3">{product.name} <span className="text-white/30">×{qty}</span></p>
            <span className="text-xs font-bold text-white/80 whitespace-nowrap">{fmt(price * qty)} ر.س</span>
          </div>
        );
      })}
      <div className="border-t border-dashed border-[#003160] pt-2.5 flex justify-between text-xs">
        <span className="text-white/40 flex items-center gap-1"><Truck size={11} /> التوصيل</span>
        <span className="font-bold text-emerald-400">مجاني</span>
      </div>
      <div className="border-t border-[#003160] pt-2.5 flex justify-between items-center">
        <span className="text-sm font-bold text-white/60">الإجمالي</span>
        <span className="text-xl font-black text-[#FC0]">{fmt(total)} <span className="text-xs text-white/40">ر.س</span></span>
      </div>
    </div>
  );
}
