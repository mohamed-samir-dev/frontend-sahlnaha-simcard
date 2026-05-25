"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCartOutline,
  IoCheckmarkCircle,
  IoFlash,
  IoCarOutline,
  IoShieldCheckmarkOutline,
  IoWifiOutline,
} from "react-icons/io5";
import type { Product } from "./types";
import { useCartStore } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) =>
  src.startsWith("http") ? src : `${API}${src.startsWith("/") ? src : "/" + src}`;

export default function ProductCard({
  product,
  priority = false,
  rank,
}: {
  product: Product;
  priority?: boolean;
  rank?: number;
}) {
  const {
    name,
    discountPercent = 0,
    brand,
    inStock,
    installment,
    freeDelivery,
    warrantyYears,
    network,
  } = product;

  const image = product.images?.[0] || product.image;
  const resolvedImage = image ? resolveImg(image) : undefined;
  const originalPrice = product.originalPrice || product.price || 0;
  const salePrice =
    product.salePrice && product.salePrice > 0 ? product.salePrice : undefined;
  const hasDiscount = salePrice != null && salePrice < originalPrice;
  const displayPrice = hasDiscount ? salePrice : originalPrice;
  const savings = hasDiscount ? originalPrice - salePrice : 0;

  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (added) return;
    addItem(product);
    setAdded(true);
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setAdded(false);
      window.scrollTo(0, 0);
      router.push("/cart");
    }, 1100);
  };

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center gap-2.5 text-sm font-bold"
          >
            <IoCheckmarkCircle size={20} />
            تمت إضافة المنتج للسلة
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative h-full"
      >
        <Link
          href={`/product/${product._id}`}
          dir="rtl"
          className="group relative flex flex-col h-full rounded-[20px] overflow-hidden transition-transform duration-300 hover:-translate-y-1"
          style={{
            background: "linear-gradient(160deg, #00244F 0%, #001331 100%)",
            border: "1px solid rgba(255,205,0,0.12)",
            boxShadow:
              "0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(255,205,0,0.08) inset",
          }}
        >
          {/* Glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[20px]"
            style={{
              boxShadow: "0 0 0 1px rgba(255,205,0,0.25), 0 8px 32px rgba(255,205,0,0.08)",
            }}
          />

          {/* ══ IMAGE ZONE ══ */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3/2" }}>
            {/* Dark gradient bg */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #001F44 0%, #003160 100%)",
              }}
            />

            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,205,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,205,0,0.06) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Bottom gradient fade */}
            <div
              className="absolute bottom-0 inset-x-0 h-1/3 z-10"
              style={{
                background:
                  "linear-gradient(to top, #001331 0%, transparent 100%)",
              }}
            />

            {/* Rank badge */}
            {rank != null && (
              <div
                className="absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-lg"
                style={
                  rank === 1
                    ? {
                        background: "linear-gradient(135deg, #FC0 0%, #E3A800 100%)",
                        color: "#001331",
                        boxShadow: "0 2px 10px rgba(255,205,0,0.5)",
                      }
                    : {
                        background: "rgba(0,49,96,0.8)",
                        color: "#FC0",
                        border: "1px solid rgba(255,205,0,0.3)",
                      }
                }
              >
                {rank}
              </div>
            )}

            {/* Top-left badges */}
            <div
              className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5"
              style={{ maxWidth: "calc(100% - 3rem)" }}
            >
              {discountPercent > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                  className="flex items-center gap-0.5 text-white text-[10px] font-black px-2 py-1 rounded-lg leading-none"
                  style={{
                    background: "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
                    boxShadow: "0 2px 8px rgba(229,62,62,0.4)",
                  }}
                >
                  <IoFlash size={8} />
                  خصم {discountPercent}%
                </motion.div>
              )}
              {installment?.available && (
                <div
                  className="flex items-center gap-0.5 text-[9px] font-black px-2 py-1 rounded-lg leading-none"
                  style={{
                    background: "linear-gradient(135deg, #E3A800 0%, #FC0 100%)",
                    color: "#001331",
                  }}
                >
                  <IoFlash size={8} />
                  تقسيط
                </div>
              )}
            </div>

            {/* Stock badge */}
            <div
              className={`absolute top-2.5 z-20 flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold leading-none ${
                rank != null ? "right-10" : "right-2.5"
              } ${inStock ? "" : ""}`}
              style={
                inStock
                  ? {
                      background: "rgba(16,185,129,0.15)",
                      border: "1px solid rgba(16,185,129,0.35)",
                      color: "#6ee7b7",
                    }
                  : {
                      background: "rgba(239,68,68,0.15)",
                      border: "1px solid rgba(239,68,68,0.35)",
                      color: "#fca5a5",
                    }
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  inStock ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                }`}
              />
              {inStock ? "متوفر" : "نفذ"}
            </div>

            {/* Product image */}
            {resolvedImage ? (
              <div className="absolute inset-0 flex items-center justify-center z-[5]">
                <Image
                  src={resolvedImage}
                  alt={name}
                  fill
                  className="object-contain p-2 sm:p-3 scale-110 transition-transform duration-500 group-hover:scale-125"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={priority}
                  loading={priority ? "eager" : "lazy"}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-5xl z-[5]">
                📱
              </div>
            )}
          </div>

          {/* ══ CONTENT ZONE ══ */}
          <div className="flex flex-col flex-1 px-3.5 pt-3 pb-3.5 gap-2">

            {/* Brand + network row */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {brand && (
                <span
                  className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider leading-none"
                  style={{
                    background: "rgba(255,205,0,0.12)",
                    border: "1px solid rgba(255,205,0,0.25)",
                    color: "#FC0",
                  }}
                >
                  {brand}
                </span>
              )}
              {network && (
                <span
                  className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none"
                  style={{
                    background: "rgba(0,49,96,0.6)",
                    border: "1px solid rgba(0,100,180,0.4)",
                    color: "#93c5fd",
                  }}
                >
                  <IoWifiOutline size={8} />
                  {network}
                </span>
              )}
            </div>

            {/* Product name */}
            <h3 className="text-[13px] sm:text-[14px] font-bold text-white leading-[1.5] line-clamp-2 flex-1">
              {name}
            </h3>

            {/* Divider */}
            <div
              className="h-px"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,205,0,0.2), rgba(255,205,0,0.05) 60%, transparent)",
              }}
            />

            {/* Price block */}
            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                {hasDiscount && (
                  <span className="text-[11px] line-through leading-none text-white/30">
                    {fmt(originalPrice)} ر.س
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-[20px] sm:text-[26px] font-black leading-none tracking-tight"
                    style={{ color: hasDiscount ? "#FC0" : "#fff" }}
                  >
                    {fmt(displayPrice!)}
                  </span>
                  <span className="text-[9px] sm:text-[11px] font-bold text-white/40 mb-0.5">
                    ر.س
                  </span>
                </div>
              </div>

              {hasDiscount && savings > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="shrink-0 text-center"
                >
                  <div className="text-[8px] text-white/30 leading-none mb-0.5">وفّرت</div>
                  <div
                    className="text-[10px] font-black px-2 py-0.5 rounded-lg leading-none whitespace-nowrap"
                    style={{
                      background: "rgba(239,68,68,0.15)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#fca5a5",
                    }}
                  >
                    {fmt(savings)} ر.س
                  </div>
                </motion.div>
              )}
            </div>

            {/* Cart button */}
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.97 }}
              className={`cart-btn ${added ? "added" : ""}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-2"
                  >
                    <IoCheckmarkCircle size={16} />
                    تمت الإضافة
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-2"
                  >
                    <IoCartOutline size={16} />
                    أضف للسلة
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </Link>
      </motion.div>
    </>
  );
}
