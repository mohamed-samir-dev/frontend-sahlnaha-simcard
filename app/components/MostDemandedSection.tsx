"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import type { Product } from "./products/types";
import ProductCard from "./products/ProductCard";

export default function MostDemandedSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/featured")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section dir="rtl" className="w-full px-3 sm:px-6 lg:px-8 py-8 sm:py-14">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full bg-[#FC0]" />
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-white">الأكثر طلباً</h2>
              <p className="text-white/40 text-xs sm:text-sm mt-0.5">منتجات يختارها عملاؤنا باستمرار</p>
            </div>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,205,0,0.1)", border: "1px solid rgba(255,205,0,0.2)" }}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#FC0]" />
            <span className="text-[#FC0] text-xs font-bold">الأعلى مبيعاً</span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.04)", height: "280px" }}
              />
            ))}
          </div>
        ) : products.length === 0 ? null : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {products.map((p, i) => (
              <ProductCard key={p._id} product={p} rank={i + 1} priority={i < 2} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
