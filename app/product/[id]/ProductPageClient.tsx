"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowForward, IoShareSocial, IoHomeOutline, IoChevronBack, IoCartOutline } from "react-icons/io5";
import Link from "next/link";
import type { Product } from "../../components/products/types";
import { useCartStore } from "../../store/cartStore";
import ProductImages from "./components/ProductImages";
import ProductInfo from "./components/ProductInfo";
import ProductDetails from "./components/ProductDetails";
import AnimatedBackground from "../../components/AnimatedBackground";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductPageClient({ id }: { id: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch(`${API}/api/products/${id}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <>
        <AnimatedBackground />
        <main className="min-h-screen" dir="rtl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square rounded-2xl animate-pulse" style={{ background: "#001F44" }} />
              <div className="space-y-4 pt-4">
                {[80, 60, 40, 90, 50].map((w, i) => (
                  <div key={i} className="h-4 rounded-full animate-pulse" style={{ width: `${w}%`, background: "#001F44" }} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </>
    );

  if (!product)
    return (
      <>
        <AnimatedBackground />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white/40 text-lg">المنتج غير موجود</p>
        </div>
      </>
    );

  const resolveImg = (src: string) =>
    src.startsWith("http") ? src : `${API}${src}`;
  const merged = [...(product.images || []), ...(product.image ? [product.image] : [])];
  const allImages = [...new Set(merged)].map(resolveImg);

  const handleShare = async () => {
    try { await navigator.share({ title: product.name, url: window.location.href }); } catch {}
  };

  const finalPrice = product.salePrice ?? product.originalPrice ?? 0;

  return (
    <>
      <AnimatedBackground />
      <main className="min-h-screen pb-28 lg:pb-16" dir="rtl">

        {/* Top Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 border-b border-[#003160] backdrop-blur-xl"
          style={{ background: "rgba(0,19,49,0.85)" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#003160] text-white hover:border-[#FC0] hover:text-[#FC0] transition"
                style={{ background: "#001F44" }}
              >
                <IoArrowForward size={17} />
              </button>
              <nav className="hidden sm:flex items-center gap-1.5 text-xs text-white/40">
                <Link href="/" className="hover:text-[#FC0] transition flex items-center gap-1">
                  <IoHomeOutline size={12} />
                  الرئيسية
                </Link>
                <IoChevronBack size={10} />
                {product.category && (
                  <>
                    <span>{product.category}</span>
                    <IoChevronBack size={10} />
                  </>
                )}
                <span className="text-[#FC0] font-bold truncate max-w-[180px]">{product.name}</span>
              </nav>
            </div>
            <button
              onClick={handleShare}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#003160] text-white hover:border-[#FC0] hover:text-[#FC0] transition"
              style={{ background: "#001F44" }}
            >
              <IoShareSocial size={15} />
            </button>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductImages images={allImages} name={product.name} discountPercent={product.discountPercent} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProductInfo
                product={product}
                addedToCart={addedToCart}
                onAddToCart={(qty) => { addItem(product, qty); setAddedToCart(true); }}
                onBuyNow={(qty) => { addItem(product, qty); router.push("/cart"); }}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <ProductDetails
              description={product.description}
              specs={product.specs}
              gallery={product.gallery}
              specifications={product.specifications}
              rating={product.rating}
              reviews={product.reviews}
            />
          </motion.div>
        </div>

        {/* Mobile Floating CTA */}
        <AnimatePresence>
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 280, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-[#003160]"
            style={{ background: "rgba(0,19,49,0.95)", backdropFilter: "blur(20px)" }}
          >
            <div className="px-4 py-3" dir="rtl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-white/40 truncate flex-1 ml-3">{product.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-[#FC0]">{finalPrice.toLocaleString("en-US")}</span>
                  <span className="text-xs text-white/40">ر.س</span>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (addedToCart) router.push("/cart");
                  else { addItem(product, 1); setAddedToCart(true); }
                }}
                className="cart-btn w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-black"
              >
                <IoCartOutline size={20} />
                {addedToCart ? "عرض السلة ✓" : "أضف للسلة"}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
