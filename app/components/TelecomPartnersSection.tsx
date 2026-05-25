"use client";

import Image from "next/image";
import { useRef } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const logos = [
  { src: "/stc.webp", alt: "STC" },
  { src: "/mobilay.webp", alt: "Mobily" },
  { src: "/zein.webp", alt: "Zain" },
  { src: "/vergin.webp", alt: "Virgin" },
  { src: "/sslam.webp", alt: "Salam" },
];

export default function TelecomPartnersSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <section className="py-10 sm:py-14 md:py-16" dir="rtl">
      <div className="text-center mb-8 sm:mb-10 px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 sm:mb-3">
          شركات الاتصالات
        </h2>
        <p className="text-xs sm:text-sm text-white/60 max-w-xs sm:max-w-md mx-auto leading-relaxed">
          جميع الشرائح تعمل على شركات الاتصالات السعودية
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-6">
        {/* سهم يمين */}
        <button
          onClick={() => scroll("right")}
          className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full border border-[#003160] text-[#FC0] hover:bg-[#003160] transition"
          style={{ background: "#001F44" }}
        >
          <IoChevronForward size={18} />
        </button>

        {/* اللوجوز */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-5 overflow-x-auto scrollbar-hide flex-1"
          style={{ direction: "ltr" }}
        >
          {logos.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded-xl sm:rounded-2xl border border-[#003160] shrink-0"
              style={{
                background: "linear-gradient(135deg, #001F44, #00244F)",
                padding: "clamp(14px, 2.5vw, 24px) clamp(20px, 4vw, 40px)",
                minWidth: "clamp(110px, 22vw, 160px)",
              }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={50}
                className="object-contain opacity-85 hover:opacity-100 transition-opacity duration-300"
                style={{ width: "clamp(65px, 12vw, 100px)", height: "auto" }}
              />
            </div>
          ))}
        </div>

        {/* سهم يسار */}
        <button
          onClick={() => scroll("left")}
          className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full border border-[#003160] text-[#FC0] hover:bg-[#003160] transition"
          style={{ background: "#001F44" }}
        >
          <IoChevronBack size={18} />
        </button>
      </div>
    </section>
  );
}
