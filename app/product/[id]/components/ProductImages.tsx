"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface ProductImagesProps {
  images: string[];
  name: string;
  discountPercent?: number;
}

export default function ProductImages({ images: rawImages, name, discountPercent = 0 }: ProductImagesProps) {
  const images = rawImages.filter((img) => {
    try { return !!img && !!new URL(img); } catch { return false; }
  });
  const [selected, setSelected] = useState(0);
  const touchStart = useRef(0);
  const goTo = (i: number) => setSelected((i + images.length) % images.length);

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-[80px]">
      {/* Main Image */}
      <div className="relative rounded-2xl overflow-hidden border border-[#003160]" style={{ background: "linear-gradient(135deg, #001F44, #00244F)" }}>
        {discountPercent > 0 && (
          <div className="absolute z-10 top-3 right-3">
            <span className="bg-[#FC0] text-[#001331] text-xs font-black px-3 py-1 rounded-full shadow-lg">
              خصم {discountPercent}%
            </span>
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute z-10 top-3 left-3 bg-black/50 text-white/80 px-2.5 py-1 rounded-full text-[11px] font-bold border border-white/10">
            {selected + 1} / {images.length}
          </div>
        )}

        <div
          className="relative aspect-square"
          onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchStart.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50 && images.length > 1) goTo(selected + (diff > 0 ? 1 : -1));
          }}
        >
          <AnimatePresence mode="wait">
            {images.length > 0 ? (
              <motion.div
                key={selected}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[selected]}
                  alt={name}
                  fill
                  className="object-contain p-8"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">لا توجد صورة</div>
            )}
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button
                onClick={() => goTo(selected - 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:bg-[#003160] transition"
              >
                <IoChevronBack size={16} />
              </button>
              <button
                onClick={() => goTo(selected + 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:bg-[#003160] transition"
              >
                <IoChevronForward size={16} />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`rounded-full transition-all duration-300 ${i === selected ? "w-5 h-2 bg-[#FC0]" : "w-2 h-2 bg-white/20"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                i === selected ? "border-[#FC0]" : "border-[#003160] opacity-50 hover:opacity-80"
              }`}
              style={{ background: "#001F44" }}
            >
              <Image src={img} alt="" fill className="object-contain p-1.5" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
