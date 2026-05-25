"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  IoCartOutline, IoShieldCheckmark, IoCarOutline, IoStar,
  IoRemove, IoAdd, IoFlash, IoCheckmarkCircle, IoWifi,
  IoPhonePortraitOutline, IoSpeedometerOutline,
} from "react-icons/io5";
import { MdSimCard } from "react-icons/md";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("en-US");

interface ProductInfoProps {
  product: Product;
  addedToCart: boolean;
  onAddToCart: (qty: number) => void;
  onBuyNow: (qty: number) => void;
}

export default function ProductInfo({ product, addedToCart, onAddToCart, onBuyNow }: ProductInfoProps) {
  const [qty, setQty] = useState(1);

  const { name, brief, salePrice, taxIncluded, rating, network, simType, dataSpeed, storage, freeDelivery, deliveryTime, warrantyYears } = product;
  const originalPrice = product.originalPrice || product.price || 0;
  const hasDiscount = salePrice != null && salePrice > 0 && salePrice < originalPrice;
  const savingsPercent = hasDiscount ? Math.round(((originalPrice - salePrice!) / originalPrice) * 100) : 0;
  const finalPrice = hasDiscount ? salePrice! : originalPrice;

  const quickSpecs = [
    network && { icon: <IoWifi size={15} />, label: "الشبكة", value: network },
    simType && { icon: <MdSimCard size={15} />, label: "نوع الشريحة", value: simType },
    dataSpeed && { icon: <IoSpeedometerOutline size={15} />, label: "سرعة البيانات", value: dataSpeed },
    storage && { icon: <IoPhonePortraitOutline size={15} />, label: "التخزين", value: storage },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[];

  return (
    <div className="flex flex-col gap-5" dir="rtl">
      {/* Brand badge */}
      {product.brand && (
        <span className="text-xs font-bold text-[#FC0] bg-[#FC0]/10 border border-[#FC0]/30 px-3 py-1 rounded-full w-fit">
          {product.brand}
        </span>
      )}

      {/* Name */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">{name}</h1>

      {/* Rating */}
      {rating && rating.count > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IoStar key={i} size={14} className={i < Math.round(rating.average) ? "text-[#FC0]" : "text-white/20"} />
            ))}
          </div>
          <span className="text-sm font-bold text-white">{rating.average}</span>
          <span className="text-xs text-white/50">({rating.count} تقييم)</span>
        </div>
      )}

      {/* Price */}
      <div className="rounded-2xl border border-[#003160] p-4" style={{ background: "linear-gradient(135deg, #001F44, #00244F)" }}>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl sm:text-4xl font-black text-[#FC0]">{fmt(finalPrice)}</span>
          <span className="text-sm font-bold text-white/60">ر.س</span>
          {hasDiscount && (
            <>
              <span className="text-sm text-white/40 line-through">{fmt(originalPrice)} ر.س</span>
              <span className="text-xs font-black text-[#001331] bg-[#FC0] px-2 py-0.5 rounded-md">
                وفّر {savingsPercent}%
              </span>
            </>
          )}
        </div>
        {taxIncluded && <p className="text-[11px] text-white/40 mt-1">شامل ضريبة القيمة المضافة</p>}
      </div>

      {/* Brief */}
      {brief && <p className="text-sm text-white/70 leading-relaxed">{brief}</p>}

      {/* Quick Specs */}
      {quickSpecs.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {quickSpecs.map((spec, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-xl border border-[#003160] px-3 py-2.5" style={{ background: "#001F44" }}>
              <span className="text-[#FC0]">{spec.icon}</span>
              <div className="min-w-0">
                <p className="text-[10px] text-white/40">{spec.label}</p>
                <p className="text-xs font-bold text-white truncate">{spec.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stock */}
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-400" : "bg-red-400"}`} />
        <span className={`text-xs font-bold ${product.inStock ? "text-emerald-400" : "text-red-400"}`}>
          {product.inStock ? "متوفر في المخزون" : "غير متوفر حالياً"}
        </span>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-white/70">الكمية:</span>
        <div className="flex items-center rounded-xl overflow-hidden border border-[#003160]">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center text-white hover:bg-[#003160] transition"
          >
            <IoRemove size={14} />
          </button>
          <span className="w-10 text-center text-sm font-black text-[#FC0]">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-9 h-9 flex items-center justify-center text-white hover:bg-[#003160] transition"
          >
            <IoAdd size={14} />
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onAddToCart(qty)}
          disabled={!product.inStock}
          className="cart-btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoCartOutline size={18} />
          {addedToCart ? "تمت الإضافة ✓" : "أضف للسلة"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onBuyNow(qty)}
          disabled={!product.inStock}
          className="w-full border border-[#FC0]/40 text-[#FC0] font-bold text-sm py-3.5 rounded-2xl hover:bg-[#FC0]/10 transition disabled:opacity-50"
        >
          اشتري الآن
        </motion.button>
      </div>

      {/* Trust Bar */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: <IoCarOutline size={18} />, title: freeDelivery ? "شحن مجاني" : "شحن سريع", sub: deliveryTime || "خلال 24 ساعة" },
          { icon: <IoFlash size={18} />, title: "دفع آمن", sub: "100% مشفر" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 rounded-xl border border-[#003160] py-3 px-2" style={{ background: "#001F44" }}>
            <span className="text-[#FC0]">{item.icon}</span>
            <span className="text-[10px] font-bold text-white text-center">{item.title}</span>
            <span className="text-[9px] text-white/40 text-center">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Installment */}
      {product.installment?.available && (
        <div className="rounded-2xl border border-[#FC0]/40 overflow-hidden" style={{ background: "linear-gradient(135deg, #001F44, #00244F)" }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#FC0]/20" style={{ background: "#FC0]/10" }}>
            <IoFlash size={16} className="text-[#FC0]" />
            <span className="text-sm font-black text-[#FC0]">تقسيط متاح</span>
            {product.installment.months && (
              <span className="mr-auto text-[11px] bg-[#FC0] text-[#001331] px-2.5 py-0.5 rounded-full font-black">
                {product.installment.months} شهر
              </span>
            )}
          </div>
          <div className="p-4 space-y-3">
            {product.installment.downPayment && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">الدفعة الأولى</span>
                <span className="text-base font-black text-[#FC0]">{fmt(product.installment.downPayment)} <span className="text-xs text-white/60">ر.س</span></span>
              </div>
            )}
            {product.installment.note && (
              <p className="text-xs text-white/70 leading-relaxed">{product.installment.note}</p>
            )}
            {product.installment.conditions && product.installment.conditions.length > 0 && (
              <div className="space-y-1.5">
                {product.installment.conditions.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <IoCheckmarkCircle size={13} className="text-[#FC0] mt-0.5 shrink-0" />
                    <span className="text-xs text-white/70">{c}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
