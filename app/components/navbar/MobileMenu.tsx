"use client";

import Link from "next/link";
import { NavItem } from "./data";
import { X, Wifi } from "lucide-react";

interface MobileMenuProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ items, isOpen, onClose }: MobileMenuProps) {
  return (
    <>
      <div
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`lg:hidden fixed top-0 right-0 w-[80vw] max-w-[340px] h-dvh z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: "#001331" }}
        dir="rtl"
      >
        <div className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl border-2 border-[#FC0] flex items-center justify-center">
              <Wifi className="w-4 h-4 text-[#FC0]" />
            </div>
            <div>
              <p className="text-white font-black text-lg tracking-tight">سهلناها</p>
              <p className="text-[#FC0]/70 text-[10px]">التقنية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {items.map((item) => (
            <div key={item.label} className="border-b border-white/5 last:border-0">
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-center px-5 py-3.5 text-sm font-semibold text-white/80 hover:text-[#FC0] hover:bg-white/5 transition-colors"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>

        <div className="shrink-0 px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/40 text-center">📞 +966 59 201 4922</p>
        </div>
      </div>
    </>
  );
}
