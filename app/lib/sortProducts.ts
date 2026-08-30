import type { Product } from "../components/products/types";

const COLOR_ORDER: string[] = [
  "برتقالي",
  "برتقالي كوني",
  "برتقالي تيتانيوم",
  "أزرق داكن",
  "أزرق",
  "ازرق",
  "سيلفر",
  "سيبفلر",
  "أزرق تيتانيوم",
  "أزرق فاتح",
  "أسود تيتانيوم",
  "أسود",
  "أبيض تيتانيوم",
  "أبيض",
  "بينك",
  "جولد",
  "رصاصي",
  "رمادي تيتانيوم",
  "صحراوي",
];

function colorPriority(color?: string, name?: string): number {
  const src = (color && color.trim()) ? color.trim() : "";
  if (!src) {
    const n = (name || "").toLowerCase();
    if (n.includes("برتقال") || n.includes("orange")) return 0;
    return 999;
  }
  // exact match first
  const exact = COLOR_ORDER.indexOf(src);
  if (exact !== -1) return exact;
  // partial match (e.g. "برتقالي كوني" matches "برتقالي")
  const partial = COLOR_ORDER.findIndex(c => src.includes(c) || c.includes(src));
  return partial !== -1 ? partial : COLOR_ORDER.length;
}

function parseStorage(s?: string, name?: string): number {
  const sources = [s, name].filter(Boolean) as string[];
  for (const raw of sources) {
    const clean = raw.replace(/\s+/g, "");
    // English: 256GB, GB256
    const en = clean.match(/(\d+)(tb|gb)/i) || clean.match(/(gb|tb)(\d+)/i);
    if (en) {
      const num = parseInt(en[1]) || parseInt(en[2]);
      const unit = (en[1].match(/\d/) ? en[2] : en[1]).toLowerCase();
      return unit === "tb" ? num * 1024 : num;
    }
    // Arabic: تيرابايت/تيرا = TB, جيجابايت/جيجا = GB
    const arNum = raw.match(/(\d+)/);
    if (arNum) {
      const num = parseInt(arNum[1]);
      if (/تيرا/.test(raw)) return num * 1024;
      if (/جيجا/.test(raw)) return num;
    }
  }
  return Infinity;
}

const BRAND_ORDER: string[] = ["stc", "موبايلي", "زين", "سلام", "فيرجن"];

function brandPriority(brand?: string): number {
  if (!brand) return BRAND_ORDER.length;
  const idx = BRAND_ORDER.findIndex(b => brand.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(brand.toLowerCase()));
  return idx !== -1 ? idx : BRAND_ORDER.length;
}

export function sortProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    // If both have explicit sortOrder, use it first
    const aOrder = a.sortOrder ?? 0;
    const bOrder = b.sortOrder ?? 0;
    if (aOrder !== bOrder) return aOrder - bOrder;

    const brandDiff = brandPriority(a.brand) - brandPriority(b.brand);
    if (brandDiff !== 0) return brandDiff;
    const priceA = a.price ?? 0;
    const priceB = b.price ?? 0;
    return priceB - priceA;
  });
}
