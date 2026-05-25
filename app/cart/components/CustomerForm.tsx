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
    <div ref={formRef} className="rounded-2xl border border-[#003160] overflow-hidden" style={{ background: "#001F44" }}>

      {/* Header */}
      <div className="px-5 py-4 border-b border-[#003160] flex items-center gap-3" style={{ background: "#001331" }}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${allDone ? "bg-emerald-500" : "bg-[#FC0]"}`}>
          {allDone
            ? <CheckCircle2 size={16} className="text-white" />
            : <span className="text-[#001331] text-xs font-black">1</span>
          }
        </div>
        <div>
          <h3 className="text-sm font-black text-white">معلوماتك الشخصية</h3>
          <p className="text-[10px] text-white/40 mt-0.5">الاسم والهوية والتواصل والعنوان</p>
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
          className="w-full py-4 rounded-xl text-[#001331] font-black text-sm transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #FC0 0%, #e6b800 100%)" }}
        >
          متابعة للدفع
          <ArrowLeft size={16} />
        </button>
        <p className="text-center text-[10px] text-white/40 flex items-center justify-center gap-1">
          <Lock size={10} /> بياناتك محمية ومشفرة بالكامل
        </p>
      </div>
    </div>
  );
}

function Field({ label, icon, value, error, placeholder, maxLength, dir, onChange, fieldName }: {
  label: string; icon: React.ReactNode; value: string; error?: string;
  placeholder?: string; maxLength?: number; dir?: string;
  onChange: (v: string) => void; fieldName?: string;
}) {
  return (
    <div data-field={fieldName}>
      <label className="flex items-center gap-1.5 text-xs font-bold text-white/60 mb-1.5">
        <span className="text-[#FC0]">{icon}</span>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        dir={dir}
        className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-white border-2 transition-all focus:outline-none placeholder:text-white/20 ${
          error
            ? "border-red-400/50 bg-red-500/10 focus:border-red-400"
            : "border-[#003160] bg-[#001331] focus:border-[#FC0]/60 focus:bg-[#001F44]"
        }`}
      />
      {error && <p className="text-red-400 text-[10px] font-bold mt-1">⚠ {error}</p>}
    </div>
  );
}
