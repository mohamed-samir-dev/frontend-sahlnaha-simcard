"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  IoGridOutline, IoSparkles
} from "react-icons/io5";
import type { Product } from "../components/products/types";
import { sortProducts } from "../lib/sortProducts";
import { useProductFilters } from "../(categories)/[slug]/components/useProductFilters";
import ProductsGrid from "../(categories)/[slug]/components/ProductsGrid";
import AnimatedBackground from "../components/AnimatedBackground";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AllProductsClient() {
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY     = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity  = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { filters, filtered } = useProductFilters(rawProducts);

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then((r) => r.json())
      .then((data: Product[]) => setRawProducts(sortProducts(data)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const [prevFilters, setPrevFilters] = useState(filters);
  if (prevFilters !== filters) { setPrevFilters(filters); if (page !== 1) setPage(1); }

  return (
    <>
      <AnimatedBackground />
      <main className="min-h-screen" dir="rtl">

        {/* ═══════════════ HERO ═══════════════ */}
        <div ref={heroRef} className="relative h-[320px] sm:h-[360px] md:h-[400px] overflow-hidden">

          <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
            <Image
              src="/hero1.webp"
              alt="جميع المنتجات"
              fill
              className="object-cover object-center"
              priority
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-950/50 via-transparent to-orange-950/30" />
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Glowing orbs */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-yellow-500/15 blur-[100px] pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[80px] pointer-events-none"
          />

          {/* Floating particles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -30, 0], opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, delay: i * 0.35 }}
              className="absolute rounded-full bg-yellow-300/30 pointer-events-none"
              style={{
                width: i % 3 === 0 ? 3 : 2,
                height: i % 3 === 0 ? 3 : 2,
                left: `${8 + i * 9}%`,
                top: `${20 + (i % 5) * 14}%`,
              }}
            />
          ))}

          {/* Hero Content */}
          <motion.div
            style={{ y: contentY, opacity }}
            className="relative z-10 h-full flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 w-fit mb-5"
            >
              <span className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/25 text-yellow-300 text-[11px] sm:text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-sm">
                <IoSparkles size={12} />
                تسوق الآن
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[2.6rem] sm:text-6xl md:text-7xl font-black text-white leading-[1.1] mb-4"
            >
              جميع
              <br />
              <span className="bg-gradient-to-l from-yellow-300 via-amber-200 to-orange-300 bg-clip-text text-transparent">
                المنتجات
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="text-white/65 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed mb-7"
            >
              تصفح جميع منتجاتنا من شرائح اتصال وراوترات وأجهزة إنترنت
              بأفضل الأسعار وأعلى جودة
            </motion.p>

            {/* Live counter */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
                className="flex items-center gap-2 w-fit"
              >
                <span className="flex items-center gap-2 bg-white/10 border border-white/15 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl backdrop-blur-sm">
                  <span className="text-yellow-300 font-black text-base sm:text-lg">{rawProducts.length}</span>
                  منتج متاح
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-10 sm:h-16 md:h-20 block">
              <path
                d="M0,80 L0,40 Q180,80 360,40 Q540,0 720,40 Q900,80 1080,40 Q1260,0 1440,40 L1440,80 Z"
                fill="#001331"
              />
            </svg>
          </div>
        </div>

        {/* ═══════════════ FEATURES STRIP ═══════════════ */}
        <div className="relative z-10 -mt-1 bg-[#001331]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        {/* ═══════════════ PRODUCTS SECTION ═══════════════ */}
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center mb-5 sm:mb-7"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/25">
                <IoGridOutline size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-white leading-tight">جميع المنتجات</h2>
                {!loading && (
                  <p className="text-[11px] text-white/50 flex items-center gap-1.5 mt-0.5">
                    <span className="font-bold text-yellow-400">{filtered.length}</span>
                    <span>منتج متاح</span>
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <ProductsGrid
            products={filtered}
            loading={loading}
            page={page}
            onPageChange={setPage}
            emoji="🛍️"
          />
        </div>
      </main>
    </>
  );
}
