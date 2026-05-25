"use client";
import { useEffect, useState } from "react";
import { IoStar, IoStarOutline, IoAdd, IoCheckmarkCircle, IoChatbubbleOutline } from "react-icons/io5";

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
        <button
          key={s}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(s)}
          className={interactive ? "transition-transform hover:scale-125" : "cursor-default"}
        >
          {s <= rating
            ? <IoStar size={interactive ? 22 : 14} className="text-[#FC0]" />
            : <IoStarOutline size={interactive ? 22 : 14} className="text-white/20" />}
        </button>
      ))}
    </div>
  );
}

function Avatar({ name, gender }: { name: string; gender: string }) {
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-[#001331] font-black text-base shrink-0"
      style={{ background: gender === "female" ? "linear-gradient(135deg,#FC0,#f59e0b)" : "linear-gradient(135deg,#FC0,#e6b800)" }}
    >
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", comment: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
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

  const avgRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  return (
    <section dir="rtl" className="w-full py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-4 text-[#FC0] border border-[#FC0]/30 bg-[#FC0]/10">
            <IoStar size={13} />
            آراء عملاءنا
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            ماذا يقول
            <span className="block text-[#FC0]">زبايننا عنّا؟</span>
          </h2>

          {reviews.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              <div className="flex flex-col items-center gap-1">
                <span className="text-5xl font-black text-[#FC0]">{avgRating}</span>
                <Stars rating={Math.round(avgRating)} />
                <span className="text-white/40 text-xs mt-1">{reviews.length} تقييم</span>
              </div>
              <div className="hidden sm:block w-px h-16 bg-[#003160]" />
              <div className="flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-white/40 text-xs w-3">{star}</span>
                      <IoStar size={11} className="text-[#FC0]" />
                      <div className="w-28 h-1.5 bg-[#003160] rounded-full overflow-hidden">
                        <div className="h-full bg-[#FC0] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-white/40 text-xs w-7">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Cards */}
        {reviews.length > 0 ? (
          <>
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="relative rounded-2xl border border-[#003160] p-5 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300 hover:border-[#FC0]/40"
                  style={{ background: "#001F44" }}
                >
                  <IoChatbubbleOutline size={28} className="absolute top-4 left-4 text-[#FC0]/10" />
                  <Stars rating={r.rating} />
                  <p className={`text-white/70 text-sm leading-relaxed flex-1 ${expanded !== r._id ? "line-clamp-3" : ""}`}>
                    {r.comment}
                  </p>
                  {r.comment.length > 100 && (
                    <button
                      onClick={() => setExpanded(expanded === r._id ? null : r._id)}
                      className="text-xs font-semibold text-[#FC0] text-right"
                    >
                      {expanded === r._id ? "أقل ▲" : "المزيد ▼"}
                    </button>
                  )}
                  <div className="flex items-center gap-3 pt-3 border-t border-[#003160]">
                    <Avatar name={r.name} gender={r.gender} />
                    <div>
                      <p className="text-white font-bold text-sm">{r.name}</p>
                      <p className="text-white/40 text-xs">عميل موثوق</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile carousel */}
            <div className="md:hidden mb-8">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(${activeIdx * -100}%)` }}
                >
                  {reviews.map((r) => (
                    <div key={r._id} className="w-full shrink-0 px-1">
                      <div className="rounded-2xl border border-[#003160] p-5 flex flex-col gap-4" style={{ background: "#001F44" }}>
                        <Stars rating={r.rating} />
                        <p className="text-white/70 text-sm leading-relaxed">{r.comment}</p>
                        <div className="flex items-center gap-3 pt-3 border-t border-[#003160]">
                          <Avatar name={r.name} gender={r.gender} />
                          <div>
                            <p className="text-white font-bold text-sm">{r.name}</p>
                            <p className="text-white/40 text-xs">عميل موثوق</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-1.5 mt-4">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`rounded-full transition-all duration-300 ${i === activeIdx ? "w-6 h-2 bg-[#FC0]" : "w-2 h-2 bg-[#003160] hover:bg-[#FC0]/40"}`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl border border-[#003160] flex items-center justify-center mx-auto mb-4" style={{ background: "#001F44" }}>
              <IoChatbubbleOutline size={28} className="text-white/20" />
            </div>
            <p className="text-white/40 text-sm">لا توجد آراء بعد — كن أول من يشارك تجربته!</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          {submitted ? (
            <div className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-[#FC0] border border-[#FC0]/30 bg-[#FC0]/10">
              <IoCheckmarkCircle size={18} />
              تم إرسال تعليقك وسيظهر بعد المراجعة
            </div>
          ) : (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-[#001331] bg-[#FC0] hover:-translate-y-0.5 transition-all duration-300"
              style={{ boxShadow: "0 8px 20px rgba(255,204,0,0.25)" }}
            >
              <IoAdd size={18} />
              {showForm ? "إلغاء" : "شارك تجربتك"}
            </button>
          )}

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-lg rounded-2xl border border-[#003160] p-6 flex flex-col gap-4"
              style={{ background: "#001F44" }}
            >
              <input
                type="text"
                placeholder="اسمك"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-[#001331] border border-[#003160] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#FC0]/60 transition-all"
                required
              />
              <textarea
                placeholder="اكتب تجربتك مع المتجر..."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows={3}
                className="bg-[#001331] border border-[#003160] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#FC0]/60 transition-all resize-none"
                required
              />
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm">تقييمك:</span>
                <Stars rating={form.rating} interactive onRate={(s) => setForm({ ...form, rating: s })} />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="text-[#001331] font-bold py-3 rounded-xl transition-all disabled:opacity-50 text-sm bg-[#FC0] hover:bg-[#e6b800]"
              >
                {submitting ? "جاري الإرسال..." : "إرسال التعليق"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
