"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowForward, IoArrowBack } from "react-icons/io5";
import ProductCard from "../../../components/products/ProductCard";
import type { Product } from "../../../components/products/types";

const ITEMS_PER_PAGE = 12;

interface Props {
  products: Product[];
  loading: boolean;
  page: number;
  onPageChange: (p: number) => void;
  emoji?: string;
}

function SkeletonCard() {
  return (
    <div className="rounded-[20px] overflow-hidden" style={{ background: "linear-gradient(160deg, #00244F, #001331)", border: "1px solid rgba(255,205,0,0.08)" }}>
      <div className="w-full aspect-[3/2] animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
      <div className="p-3 space-y-2.5">
        <div className="h-3 animate-pulse rounded-full w-1/2" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-4 animate-pulse rounded-full w-3/4" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
      <div className="h-10 animate-pulse mx-3 mb-3 rounded-xl" style={{ background: "rgba(255,205,0,0.06)" }} />
    </div>
  );
}

export default function ProductsGrid({ products, loading, page, onPageChange, emoji = "📦" }: Props) {
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginated = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const goTo = (p: number) => {
    onPageChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!products.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 gap-5 text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center text-5xl border border-white/10"
        >
          {emoji}
        </motion.div>
        <div>
          <p className="text-white text-lg font-black mb-1.5">لا توجد منتجات مطابقة</p>
          <p className="text-white/40 text-sm">جرب تغيير الفلاتر أو مسحها</p>
        </div>
        <Link
          href="/"
          className="text-sm font-bold text-teal-300 hover:text-teal-200 flex items-center gap-1.5 bg-teal-500/10 border border-teal-400/20 px-5 py-2.5 rounded-full transition-all"
        >
          <IoArrowForward size={14} />
          العودة للرئيسية
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        <AnimatePresence mode="wait">
          {paginated.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center gap-2 mt-10"
          dir="rtl"
        >
          <button
            onClick={() => goTo(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-30"
            style={{ background: "rgba(255,205,0,0.08)", border: "1px solid rgba(255,205,0,0.2)", color: "#FC0" }}
          >
            <IoArrowForward size={13} />
            السابق
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => goTo(n)}
              className="w-10 h-10 rounded-xl text-xs font-black transition-all"
              style={
                page === n
                  ? { background: "linear-gradient(135deg, #FC0, #E3A800)", color: "#001331", boxShadow: "0 4px 14px rgba(255,205,0,0.35)", transform: "scale(1.1)" }
                  : { background: "rgba(0,31,68,0.8)", border: "1px solid rgba(255,205,0,0.15)", color: "rgba(255,255,255,0.6)" }
              }
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => goTo(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-30"
            style={{ background: "rgba(255,205,0,0.08)", border: "1px solid rgba(255,205,0,0.2)", color: "#FC0" }}
          >
            التالي
            <IoArrowBack size={13} />
          </button>
        </motion.div>
      )}
    </>
  );
}
