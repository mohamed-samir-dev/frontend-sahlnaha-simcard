import { IoWalletOutline } from "react-icons/io5";
import { Truck } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("en-US");

interface OrderSummaryProps {
  total: number;
  downPayment?: number;
  installmentType?: "full" | "installment";
  months?: number;
}

export default function OrderSummary({ total }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-[#003160] overflow-hidden" style={{ background: "#001F44" }}>
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-white/50">مجموع السلة</span>
          <span className="font-bold text-white">{fmt(total)} ر.س</span>
        </div>
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-white/50 flex items-center gap-1.5"><Truck size={12} /> التوصيل</span>
          <span className="font-bold text-emerald-400">مجاني 🚀</span>
        </div>
        <div className="border-t border-[#003160] pt-3 flex justify-between items-center">
          <span className="text-sm font-bold text-white/60">الإجمالي</span>
          <span className="text-2xl font-black text-[#FC0]">{fmt(total)} <span className="text-xs font-medium text-white/40">ر.س</span></span>
        </div>
      </div>

      {/* Pay Banner */}
      <div className="mx-3 mb-3 rounded-xl p-4 border border-[#FC0]/30" style={{ background: "linear-gradient(135deg, #001331, #001F44)" }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <IoWalletOutline size={15} className="text-[#FC0]" />
            <span className="text-white font-black text-sm">المبلغ الإجمالي</span>
          </div>
          <div className="text-left">
            <span className="text-[#FC0] text-2xl font-black">{fmt(total)}</span>
            <span className="text-white/40 text-xs font-medium mr-1">ر.س</span>
          </div>
        </div>
        <p className="text-white/40 text-[11px] mt-2">دفع كامل بالبطاقة الائتمانية</p>
      </div>
    </div>
  );
}
