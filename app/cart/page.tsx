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
          <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl border border-[#80C78D]/40" style={{ background: "linear-gradient(135deg, #1A2E44, #243d56)" }}>
            <ShoppingBag className="w-12 h-12 text-[#80C78D]" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-[#1A2E44]">سلتك فارغة!</h2>
            <p className="text-[#1A2E44]/50 text-sm max-w-xs mx-auto">ابدأ بإضافة المنتجات وارجع هنا لإتمام الطلب</p>
          </div>
          <button onClick={() => router.push("/")} className="cart-btn w-48">
            🛍️ تصفح المنتجات
          </button>
        </main>
      </>
    );

  return (
    <div className="min-h-[100dvh] bg-[#f0f8f2]" dir="rtl">
      <AnimatedBackground />

      {/* HEADER */}
      <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-[#80C78D]/30" style={{ background: "rgba(255,255,255,0.95)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[#1A2E44]/60 hover:text-[#1A2E44] transition text-sm font-bold">
            <ChevronRight className="w-4 h-4" />
            <span className="hidden sm:inline">رجوع</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#47A557]" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#47A557] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {count}
              </span>
            </div>
            <span className="text-base font-black text-[#1A2E44]">السلة</span>
          </div>

          <Link href="/" className="w-9 h-9 rounded-xl border border-[#80C78D]/40 hover:border-[#47A557] flex items-center justify-center transition" style={{ background: "#DCEFE8" }}>
            <Home className="w-4 h-4 text-[#47A557]" />
          </Link>
        </div>
      </header>

      {/* BODY */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 bg-[#f0f8f2]">

        {/* Summary Bar */}
        <div className="rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 relative overflow-hidden border border-[#80C78D]/40" style={{ background: "linear-gradient(135deg, #DCEFE8 0%, #c8e8d4 100%)" }}>
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(circle, #47A557 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[#1A2E44]/50 text-xs mb-1">إجمالي الطلب</p>
              <p className="text-3xl sm:text-4xl font-black text-[#47A557]">
                {fmt(total)} <span className="text-sm font-medium text-[#1A2E44]/40">ر.س</span>
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

              {/* HIDDEN: Barcode notice — uncomment to restore
              <div className="mt-4 mb-4 rounded-2xl overflow-hidden border border-[#80C78D]/40 relative" style={{ background: "#DCEFE8" }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #47A557, #80C78D, #47A557, transparent)" }} />
                <div className="p-4 sm:p-5 flex gap-4 items-center" dir="rtl">
                  <div className="shrink-0 flex flex-col items-center gap-1.5">
                    <div className="w-14 h-14 rounded-2xl border border-[#47A557]/30 flex items-center justify-center" style={{ background: "white" }}>
                      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="#47A557" strokeWidth="1.8" fill="none"/>
                        <rect x="4.5" y="4.5" width="5" height="5" rx="0.5" fill="#47A557"/>
                        <rect x="22" y="2" width="10" height="10" rx="1.5" stroke="#47A557" strokeWidth="1.8" fill="none"/>
                        <rect x="24.5" y="4.5" width="5" height="5" rx="0.5" fill="#47A557"/>
                        <rect x="2" y="22" width="10" height="10" rx="1.5" stroke="#47A557" strokeWidth="1.8" fill="none"/>
                        <rect x="4.5" y="24.5" width="5" height="5" rx="0.5" fill="#47A557"/>
                        <rect x="15" y="2" width="2" height="5" rx="0.5" fill="#47A557"/>
                        <rect x="15" y="9" width="2" height="3" rx="0.5" fill="#47A557"/>
                        <rect x="19" y="2" width="2" height="3" rx="0.5" fill="#47A557"/>
                        <rect x="15" y="15" width="3" height="2" rx="0.5" fill="#47A557"/>
                        <rect x="20" y="15" width="2" height="3" rx="0.5" fill="#47A557"/>
                        <rect x="24" y="15" width="3" height="2" rx="0.5" fill="#47A557"/>
                        <rect x="29" y="15" width="3" height="3" rx="0.5" fill="#47A557"/>
                        <rect x="15" y="20" width="2" height="4" rx="0.5" fill="#47A557"/>
                        <rect x="19" y="19" width="3" height="2" rx="0.5" fill="#47A557"/>
                        <rect x="24" y="20" width="2" height="5" rx="0.5" fill="#47A557"/>
                        <rect x="28" y="20" width="4" height="2" rx="0.5" fill="#47A557"/>
                        <rect x="19" y="23" width="4" height="3" rx="0.5" fill="#47A557"/>
                        <rect x="28" y="24" width="4" height="4" rx="0.5" fill="#47A557"/>
                        <rect x="15" y="26" width="2" height="6" rx="0.5" fill="#47A557"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-black text-[#47A557]/70 tracking-widest">BARCODE</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#47A557] animate-pulse" />
                      <p className="text-[#47A557] font-black text-sm">باركود الشريحة يصلك فوراً على واتساب</p>
                    </div>
                    <p className="text-[#1A2E44]/60 text-xs leading-relaxed">
                      بعد إتمام الدفع مباشرةً، سيتم إرسال باركود الشريحة إلى رقم واتساب الذي ستدخله أدناه
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="#ef4444"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                      <p className="text-red-500/80 text-[10px] font-bold">تأكد من صحة رقم الواتساب — أي خطأ يؤخر وصول الشريحة</p>
                    </div>
                  </div>
                </div>
              </div>
              END HIDDEN */}

              {/* Delivery Notice */}
              <div className="mt-4 mb-4 rounded-2xl overflow-hidden border border-[#80C78D]/40 relative" style={{ background: "#DCEFE8" }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #47A557, #80C78D, #47A557, transparent)" }} />
                <div className="p-4 sm:p-5 flex gap-4 items-center" dir="rtl">
                  <div className="shrink-0 w-14 h-14 rounded-2xl border border-[#47A557]/30 flex items-center justify-center" style={{ background: "white" }}>
                    <Truck className="w-7 h-7 text-[#47A557]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#47A557] animate-pulse" />
                      <p className="text-[#47A557] font-black text-sm">التوصيل خلال 3 أيام عمل</p>
                    </div>
                    <p className="text-[#1A2E44]/60 text-xs leading-relaxed">
                      سيتم توصيل طلبك إلى عنوانك خلال 3 أيام عمل من تأكيد الطلب
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-0">
                <CustomerForm
                  total={total}
                  itemCount={count}
                  initialData={customer}
                  onSubmit={(info: CustomerInfo) => {
                    setCustomer(info);
                    // router.push("/checkout"); // HIDDEN: checkout page is temporarily disabled
                  }}
                />
              </div>
            </section>
          </div>

          {/* LEFT: Sticky Summary (desktop) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="rounded-2xl border border-[#80C78D]/40 overflow-hidden" style={{ background: "#ffffff" }}>
                <div className="px-5 py-4 border-b border-[#80C78D]/30" style={{ background: "#DCEFE8" }}>
                  <h3 className="text-sm font-black text-[#1A2E44]">ملخص الطلب</h3>
                </div>
                <div className="p-5 space-y-3">
                  {items.map(({ product, qty }) => {
                    const price = product.salePrice ?? product.originalPrice ?? product.price;
                    return (
                      <div key={product._id} className="flex justify-between items-start gap-2">
                        <p className="text-xs text-[#1A2E44]/60 leading-relaxed line-clamp-1 flex-1">{product.name} <span className="text-[#1A2E44]/30">×{qty}</span></p>
                        <span className="text-xs font-bold text-[#1A2E44] whitespace-nowrap">{fmt(price * qty)} ر.س</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-dashed border-[#80C78D]/40 pt-3 flex justify-between text-xs">
                    <span className="text-[#1A2E44]/50 flex items-center gap-1.5"><Truck size={12} /> التوصيل</span>
                    <span className="font-bold text-[#47A557]">مجاني ✓</span>
                  </div>
                  <div className="border-t border-[#80C78D]/30 pt-3 flex justify-between items-center">
                    <span className="text-sm font-bold text-[#1A2E44]/60">الإجمالي</span>
                    <span className="text-2xl font-black text-[#47A557]">{fmt(total)} <span className="text-xs font-medium text-[#1A2E44]/40">ر.س</span></span>
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div className="rounded-2xl border border-[#80C78D]/40 p-4 grid grid-cols-2 gap-2" style={{ background: "#ffffff" }}>
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
      <div className="w-1 h-5 rounded-full bg-[#47A557]" />
      <h2 className="text-sm sm:text-base font-black text-[#1A2E44]">{title}</h2>
      {badge && <span className="text-[10px] font-bold text-[#47A557] bg-[#47A557]/10 border border-[#47A557]/20 px-2 py-0.5 rounded-full">{badge}</span>}
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="w-7 h-7 rounded-full border border-[#47A557]/30 flex items-center justify-center mx-auto mb-1 text-[#47A557]" style={{ background: "rgba(71,165,87,0.15)" }}>{icon}</div>
      <p className="text-[#1A2E44]/50 text-[9px]">{label}</p>
      <p className="text-[#1A2E44] text-[11px] font-bold">{value}</p>
    </div>
  );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#80C78D]/40 px-3 py-2.5" style={{ background: "#DCEFE8" }}>
      <span className="text-[#47A557]">{icon}</span>
      <span className="text-[11px] font-bold text-[#1A2E44]/70">{text}</span>
    </div>
  );
}

function OrderSummaryMobile({ items, total }: { items: { product: { _id: string; name: string; salePrice?: number; originalPrice?: number; price: number }; qty: number }[]; total: number }) {
  return (
    <div className="rounded-2xl border border-[#80C78D]/40 p-4 space-y-2.5" style={{ background: "#ffffff" }}>
      {items.map(({ product, qty }) => {
        const price = product.salePrice ?? product.originalPrice ?? product.price;
        return (
          <div key={product._id} className="flex justify-between items-center">
            <p className="text-xs text-[#1A2E44]/60 line-clamp-1 flex-1 ml-3">{product.name} <span className="text-[#1A2E44]/30">×{qty}</span></p>
            <span className="text-xs font-bold text-[#1A2E44] whitespace-nowrap">{fmt(price * qty)} ر.س</span>
          </div>
        );
      })}
      <div className="border-t border-dashed border-[#80C78D]/40 pt-2.5 flex justify-between text-xs">
        <span className="text-[#1A2E44]/50 flex items-center gap-1"><Truck size={11} /> التوصيل</span>
        <span className="font-bold text-[#47A557]">مجاني</span>
      </div>
      <div className="border-t border-[#80C78D]/30 pt-2.5 flex justify-between items-center">
        <span className="text-sm font-bold text-[#1A2E44]/60">الإجمالي</span>
        <span className="text-xl font-black text-[#47A557]">{fmt(total)} <span className="text-xs text-[#1A2E44]/40">ر.س</span></span>
      </div>
    </div>
  );
}
