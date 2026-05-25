"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoListOutline, IoDocumentTextOutline } from "react-icons/io5";
import type { Product } from "../../../components/products/types";

interface ProductDetailsProps {
  description?: string;
  specs?: Product["specs"];
  gallery?: Product["gallery"];
  specifications?: Product["specifications"];
  rating?: Product["rating"];
  reviews?: Product["reviews"];
}

const TABS = [
  { key: "overview", label: "الوصف", icon: <IoDocumentTextOutline size={15} /> },
  { key: "specs", label: "المواصفات", icon: <IoListOutline size={15} /> },
];

export default function ProductDetails({ description, specifications }: ProductDetailsProps) {
  const [active, setActive] = useState("overview");

  return (
    <div className="mt-12 border-t border-[#003160] pt-10">
      {/* Tab Bar */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
              active === tab.key
                ? "bg-[#FC0] text-[#001331] border-[#FC0]"
                : "text-white/60 border-[#003160] hover:border-[#FC0]/40 hover:text-white"
            }`}
            style={active === tab.key ? {} : { background: "#001F44" }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overview */}
          {active === "overview" && (
            <div>
              {description ? (
                <p className="text-sm text-white/75 leading-loose">{description}</p>
              ) : (
                <p className="text-sm text-white/30">لا يوجد وصف متاح.</p>
              )}
            </div>
          )}

          {/* Specs */}
          {active === "specs" && (
            <div>
              {specifications && specifications.length > 0 ? (
                <div className="space-y-4">
                  {specifications.map((group, gi) => (
                    <div key={gi} className="rounded-2xl overflow-hidden border border-[#003160]">
                      <div className="px-4 py-2.5 border-b border-[#003160]" style={{ background: "#003160" }}>
                        <h3 className="text-xs font-black text-[#FC0] uppercase tracking-wider">{group.groupName}</h3>
                      </div>
                      <div style={{ background: "#001F44" }}>
                        {group.items.map((item, ii) => (
                          <div
                            key={ii}
                            className={`flex items-center justify-between px-4 py-3 ${ii < group.items.length - 1 ? "border-b border-[#003160]/60" : ""}`}
                          >
                            <span className="text-xs text-white/50">{item.label}</span>
                            <span className="text-xs font-bold text-white">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/30">لا توجد مواصفات متاحة.</p>
              )}
            </div>
          )}


        </motion.div>
      </AnimatePresence>
    </div>
  );
}
