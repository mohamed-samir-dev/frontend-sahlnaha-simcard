"use client";

import { useState, useRef } from "react";
import { User, Phone, MapPin, IdCard, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import type { CustomerInfo } from "../../store/cartStore";

interface CustomerFormProps {
  total: number;
  itemCount: number;
  initialData?: CustomerInfo | null;
  installmentMonths?: number;
  onSubmit: (info: CustomerInfo) => void;
}

export default function CustomerForm({ initialData, onSubmit }: CustomerFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [nationalId, setNationalId] = useState(initialData?.nationalId ?? "");
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "الاسم مطلوب";
    if (!nationalId.trim()) e.nationalId = "رقم الهوية مطلوب";
    else if (!/^[12]\d{9}$/.test(nationalId.trim())) e.nationalId = "هوية سعودية: 10 أرقام تبدأ بـ 1 أو 2";
    if (!whatsapp.trim()) e.whatsapp = "رقم الواتساب مطلوب";
    else if (!/^05\d{8}$/.test(whatsapp.trim())) e.whatsapp = "يبدأ بـ 05 ويتكون من 10 أرقام";
    if (!address.trim()) e.address = "العنوان مطلوب";
    setErrors(e);
    if (Object.keys(e).length) {
      const firstKey = Object.keys(e)[0];
      const el = formRef.current?.querySelector(`[data-field="${firstKey}"]`) as HTMLElement | null;
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
      return;
    }
    onSubmit({ name, nationalId, whatsapp, address, installmentType: "full", months: 0, downPayment: 0 });
  };

  const allDone = !!(name.trim() && nationalId.trim() && whatsapp.trim() && address.trim() && !Object.values(errors).some(Boolean));

  return (
    <div ref={formRef} className="rounded-2xl border border-[#80C78D]/40 overflow-hidden" style={{ background: "#ffffff" }}>

      {/* Header */}
      <div className="px-5 py-4 border-b border-[#80C78D]/30 flex items-center gap-3" style={{ background: "#DCEFE8" }}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${allDone ? "bg-[#47A557]" : "bg-[#5B6187]"}`}>
          {allDone
            ? <CheckCircle2 size={16} className="text-white" />
            : <span className="text-white text-xs font-black">1</span>
          }
        </div>
        <div>
          <h3 className="text-sm font-black text-[#1A2E44]">معلوماتك الشخصية</h3>
          <p className="text-[10px] text-[#1A2E44]/50 mt-0.5">الاسم والهوية والتواصل والعنوان</p>
        </div>
      </div>

      {/* Fields */}
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            fieldName="name"
            label="الاسم الكامل"
            icon={<User size={14} />}
            value={name}
            error={errors.name}
            placeholder="محمد أحمد العلي"
            onChange={(v) => { setName(v.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "")); setErrors(p => ({ ...p, name: "" })); }}
          />
          <Field
            fieldName="nationalId"
            label="رقم الهوية / الإقامة"
            icon={<IdCard size={14} />}
            value={nationalId}
            error={errors.nationalId}
            placeholder="1XXXXXXXXX"
            maxLength={10}
            inputMode="numeric"
            onChange={(v) => { setNationalId(v.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, nationalId: "" })); }}
          />
          <Field
            fieldName="whatsapp"
            label="رقم الواتساب"
            icon={<Phone size={14} />}
            value={whatsapp}
            error={errors.whatsapp}
            placeholder="05XXXXXXXX"
            maxLength={10}
            dir="ltr"
            inputMode="numeric"
            hint="📲 سيصلك باركود الشريحة على هذا الرقم"
            onChange={(v) => { setWhatsapp(v.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, whatsapp: "" })); }}
          />
          <Field
            fieldName="address"
            label="عنوان التوصيل"
            icon={<MapPin size={14} />}
            value={address}
            error={errors.address}
            placeholder="المدينة - الحي - الشارع"
            onChange={(v) => { setAddress(v); setErrors(p => ({ ...p, address: "" })); }}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6 space-y-3">
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-xl text-white font-black text-sm transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #47A557 0%, #129928 100%)" }}
        >
          متابعة للدفع
          <ArrowLeft size={16} />
        </button>
        <p className="text-center text-[10px] text-[#1A2E44]/40 flex items-center justify-center gap-1">
          <Lock size={10} /> بياناتك محمية ومشفرة بالكامل
        </p>
      </div>
    </div>
  );
}

function Field({ label, icon, value, error, placeholder, maxLength, dir, inputMode, onChange, fieldName, hint }: {
  label: string; icon: React.ReactNode; value: string; error?: string;
  placeholder?: string; maxLength?: number; dir?: string; hint?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onChange: (v: string) => void; fieldName?: string;
}) {
  return (
    <div data-field={fieldName}>
      <label className="flex items-center gap-1.5 text-xs font-bold text-[#1A2E44]/70 mb-1.5">
        <span className="text-[#47A557]">{icon}</span>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        dir={dir}
        inputMode={inputMode}
        className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-[#1A2E44] border-2 transition-all focus:outline-none placeholder:text-[#1A2E44]/25 ${
          error
            ? "border-red-400/50 bg-red-50 focus:border-red-400"
            : "border-[#80C78D]/40 bg-[#DCEFE8]/40 focus:border-[#47A557] focus:bg-white"
        }`}
      />
      {hint && !error && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <svg width="12" height="12" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="#47A557" strokeWidth="2" fill="none"/>
            <rect x="4.5" y="4.5" width="5" height="5" rx="0.5" fill="#47A557"/>
            <rect x="22" y="2" width="10" height="10" rx="1.5" stroke="#47A557" strokeWidth="2" fill="none"/>
            <rect x="24.5" y="4.5" width="5" height="5" rx="0.5" fill="#47A557"/>
            <rect x="2" y="22" width="10" height="10" rx="1.5" stroke="#47A557" strokeWidth="2" fill="none"/>
            <rect x="4.5" y="24.5" width="5" height="5" rx="0.5" fill="#47A557"/>
            <rect x="15" y="2" width="2" height="5" rx="0.5" fill="#47A557"/>
            <rect x="15" y="15" width="3" height="2" rx="0.5" fill="#47A557"/>
            <rect x="20" y="15" width="2" height="3" rx="0.5" fill="#47A557"/>
            <rect x="15" y="20" width="2" height="4" rx="0.5" fill="#47A557"/>
            <rect x="19" y="19" width="3" height="2" rx="0.5" fill="#47A557"/>
            <rect x="24" y="20" width="2" height="5" rx="0.5" fill="#47A557"/>
          </svg>
          <p className="text-[#47A557] text-[10px] font-bold">{hint}</p>
        </div>
      )}
      {error && <p className="text-red-500 text-[10px] font-bold mt-1">⚠ {error}</p>}
    </div>
  );
}
