"use client";
import { useEffect, useState } from "react";
import { IoStar, IoStarOutline, IoAdd, IoCheckmarkCircle } from "react-icons/io5";

interface Review {
  _id: string;
  name: string;
  comment: string;
  rating: number;
  gender: string;
  createdAt: string;
}

function Stars({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (n: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" disabled={!interactive} onClick={() => onRate?.(s)}
          className={interactive ? "transition-transform hover:scale-110" : "cursor-default"}>
          {s <= rating
            ? <IoStar size={interactive ? 20 : 13} className="text-[#FC0]" />
            : <IoStarOutline size={interactive ? 20 : 13} className="text-white/20" />}
        </button>
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", comment: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setReviews(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % reviews.length), 4500);
    return () => clearInterval(t);
  }, [reviews.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      setShowForm(false);
      setForm({ name: "", comment: "", rating: 5 });
    } catch {}
    setSubmitting(false);
  }

  const avg = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  return (
    <section dir="rtl" className="w-full py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[#FC0] text-xs font-bold tracking-widest mb-2">آراء العملاء</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white">ماذا يقولون عنّا؟</h2>
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-3xl font-black text-[#FC0]">{avg}</span>
              <div>
                <Stars rating={Math.round(avg)} />
                <p className="text-white/40 text-[11px] mt-0.5">{reviews.length} تقييم</p>
              </div>
            </div>
          )}
        </div>

        {/* Cards */}
        {reviews.length > 0 ? (
          <>
            {/* Desktop */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {reviews.map((r) => (
                <div key={r._id} className="rounded-2xl border border-[#003160] p-4 flex flex-col gap-3 hover:border-[#FC0]/30 transition-colors duration-200" style={{ background: "#001F44" }}>
                  <div className="flex items-start justify-between gap-2">
                    <Stars rating={r.rating} />
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[#001331] font-black text-xs shrink-0 bg-[#FC0]">
                      {r.name.trim().charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <p className="text-white/65 text-xs leading-relaxed line-clamp-3 flex-1">{r.comment}</p>
                  <p className="text-white/80 text-xs font-semibold">{r.name}</p>
                </div>
              ))}
            </div>

            {/* Mobile carousel */}
            <div className="sm:hidden mb-6">
              <div className="overflow-hidden rounded-2xl">
                <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(${activeIdx * -100}%)` }}>
                  {reviews.map((r) => (
                    <div key={r._id} className="w-full shrink-0">
                      <div className="border border-[#003160] p-4 flex flex-col gap-3 rounded-2xl" style={{ background: "#001F44" }}>
                        <div className="flex items-start justify-between gap-2">
                          <Stars rating={r.rating} />
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[#001331] font-black text-xs shrink-0 bg-[#FC0]">
                            {r.name.trim().charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <p className="text-white/65 text-xs leading-relaxed">{r.comment}</p>
                        <p className="text-white/80 text-xs font-semibold">{r.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-1.5 mt-3">
                {reviews.map((_, i) => (
                  <button key={i} onClick={() => setActiveIdx(i)}
                    className={`rounded-full transition-all duration-300 ${i === activeIdx ? "w-5 h-1.5 bg-[#FC0]" : "w-1.5 h-1.5 bg-[#003160]"}`} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-white/30 text-sm">لا توجد آراء بعد</div>
        )}

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 mt-2">
          {submitted ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FC0]">
              <IoCheckmarkCircle size={15} />
              تم إرسال تعليقك وسيظهر بعد المراجعة
            </div>
          ) : (
            <button onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-[#001331] bg-[#FC0] hover:bg-[#e6b800] transition-colors">
              <IoAdd size={14} />
              {showForm ? "إلغاء" : "شارك تجربتك"}
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit}
              className="w-full max-w-sm rounded-2xl border border-[#003160] p-4 flex flex-col gap-3"
              style={{ background: "#001F44" }}>
              <input type="text" placeholder="اسمك" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-[#001331] border border-[#003160] rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-[#FC0]/50 transition-colors"
                required />
              <textarea placeholder="اكتب تجربتك..." value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows={3}
                className="bg-[#001331] border border-[#003160] rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-[#FC0]/50 transition-colors resize-none"
                required />
              <div className="flex items-center gap-2">
                <span className="text-white/50 text-xs">تقييمك:</span>
                <Stars rating={form.rating} interactive onRate={(s) => setForm({ ...form, rating: s })} />
              </div>
              <button type="submit" disabled={submitting}
                className="bg-[#FC0] text-[#001331] font-bold py-2.5 rounded-xl text-xs hover:bg-[#e6b800] transition-colors disabled:opacity-50">
                {submitting ? "جاري الإرسال..." : "إرسال"}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
