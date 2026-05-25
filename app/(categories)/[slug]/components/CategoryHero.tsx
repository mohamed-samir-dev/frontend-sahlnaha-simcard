"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IoHomeOutline, IoChevronBack, IoFlash, IoShieldCheckmarkOutline, IoRocketOutline, IoSparkles } from "react-icons/io5";

const features = [
  { icon: IoRocketOutline, text: "شحن سريع", color: "from-blue-400 to-cyan-400" },
  { icon: IoShieldCheckmarkOutline, text: "ضمان معتمد", color: "from-emerald-400 to-teal-400" },
  { icon: IoFlash, text: "تقسيط مريح", color: "from-amber-400 to-orange-400" },
];

interface Props {
  label: string;
  parentLabel: string;
  parentHref: string;
  productCount: number;
  loading: boolean;
}

export default function CategoryHero({ label, parentLabel, parentHref, productCount, loading }: Props) {
  return (
    <div className="relative overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-teal-400/20 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-400/15 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-emerald-400/10 blur-2xl pointer-events-none"
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i * 0.7, repeat: Infinity, delay: i * 0.5 }}
          className="absolute w-1 h-1 rounded-full bg-teal-300/60 pointer-events-none"
          style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
        />
      ))}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-14 sm:pb-18">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 text-[11px] sm:text-xs text-white/40 mb-8"
        >
          <Link href="/" className="hover:text-white/80 transition flex items-center gap-1">
            <IoHomeOutline size={12} />
            الرئيسية
          </Link>
          <IoChevronBack size={10} />
          <Link href={parentHref} className="hover:text-white/80 transition">{parentLabel}</Link>
          <IoChevronBack size={10} />
          <span className="text-white/70 font-semibold">{label}</span>
        </motion.nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Title block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 bg-teal-400/10 border border-teal-400/20 text-teal-300 text-[11px] font-bold px-3 py-1 rounded-full mb-3"
            >
              <IoSparkles size={11} />
              تسوق الآن
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {label}
            </h1>
            <p className="mt-1.5 text-lg sm:text-xl font-bold bg-gradient-to-l from-teal-300 to-cyan-200 bg-clip-text text-transparent">
              {parentLabel}
            </p>
          </motion.div>

          {/* Right side: counter + features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex items-center gap-4"
          >
            {/* Product count */}
            {!loading && productCount > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-white/10 bg-white/[.06] backdrop-blur-sm shrink-0 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent" />
                <span className="text-xl sm:text-2xl font-black text-white relative z-10">{productCount}</span>
                <span className="text-[10px] text-white/50 relative z-10">منتج</span>
              </motion.div>
            )}

            {/* Feature pills */}
            <div className="flex flex-row flex-wrap sm:flex-col gap-2">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-2 bg-white/[.06] border border-white/[.08] backdrop-blur-sm px-3 py-1.5 rounded-full"
                >
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${f.color} flex items-center justify-center shrink-0`}>
                    <f.icon size={9} className="text-white" />
                  </div>
                  <span className="text-white/75 text-[11px] font-medium">{f.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave */}
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full h-8 sm:h-14 block relative z-10">
        <path d="M0,56 L0,28 Q240,56 480,28 Q720,0 960,28 Q1200,56 1440,28 L1440,56 Z" fill="transparent" />
      </svg>
    </div>
  );
}
