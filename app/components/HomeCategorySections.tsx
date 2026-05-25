"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tag } from "lucide-react";
import type { Product } from "./products/types";
import ProductCard from "./products/ProductCard";

type BrandSetting = {
  brand: string;
  showInHome: boolean;
  order: number;
};

type BrandSection = {
  brand: string;
  products: Product[];
};

const BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function HomeCategorySections() {
  const [sections, setSections] = useState<BrandSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const settingsRes = await fetch(`${BASE}/api/admin/brands/home-settings`);
        if (!settingsRes.ok) return;
        const settings: BrandSetting[] = await settingsRes.json();

        const visible = settings
          .filter((s) => s.showInHome)
          .sort((a, b) => a.order - b.order);

        if (visible.length === 0) return;

        const results = await Promise.all(
          visible.map(async (s) => {
            const res = await fetch(
              `${BASE}/api/products?brand=${encodeURIComponent(s.brand)}&limit=4`
            );
            const data = res.ok ? await res.json() : [];
            const products: Product[] = Array.isArray(data)
              ? data
              : Array.isArray(data.products)
              ? data.products
              : [];
            return { brand: s.brand, products: products.slice(0, 4) };
          })
        );

        setSections(results.filter((s) => s.products.length > 0));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return null;
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((sec) => (
        <section key={sec.brand} dir="rtl" className="w-full px-3 sm:px-6 lg:px-8 py-8 sm:py-14">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-10">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 rounded-full bg-[#FC0]" />
                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-white">{sec.brand}</h2>
                  <p className="text-white/40 text-xs sm:text-sm mt-0.5">أفضل المنتجات في هذه الفئة</p>
                </div>
              </div>
              <Link
                href={`/all-products?brand=${encodeURIComponent(sec.brand)}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
                style={{ background: "rgba(255,205,0,0.1)", border: "1px solid rgba(255,205,0,0.2)" }}
              >
                <Tag className="w-3.5 h-3.5 text-[#FC0]" />
                <span className="text-[#FC0] text-xs font-bold">عرض الكل</span>
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {sec.products.map((p, i) => (
                <ProductCard key={p._id} product={p} priority={i < 2} />
              ))}
            </div>

          </div>
        </section>
      ))}
    </>
  );
}
