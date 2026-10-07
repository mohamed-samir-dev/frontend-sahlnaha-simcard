import { create } from "zustand";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const CACHE_KEY = "company_data_cache";

function loadCache() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveCache(data: Partial<CompanyStore>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

interface CompanyStore {
  logo: string;
  nameAr: string;
  nameEn: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  details: string;
  fetchCompany: () => Promise<void>;
  setLogo: (url: string) => void;
}

const cached = loadCache();

export const useCompanyStore = create<CompanyStore>((set) => ({
  logo: cached?.logo || "",
  nameAr: cached?.nameAr || "",
  nameEn: cached?.nameEn || "",
  phone: cached?.phone || "",
  whatsapp: cached?.whatsapp || "",
  email: cached?.email || "",
  website: cached?.website || "",
  details: cached?.details || "",
  fetchCompany: async () => {
    try {
      const res = await fetch(`/api/company`);
      const data = await res.json();
      const fullLogo = data.logo
        ? (data.logo.startsWith("http") ? data.logo : `${API}${data.logo}`)
        : "";
      const update = {
        logo: fullLogo,
        nameAr: data.nameAr || "",
        nameEn: data.nameEn || "",
        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        email: data.email || "",
        website: data.website || "",
        details: data.details || "",
      };
      set(update);
      saveCache(update);
    } catch (e) { console.error(e); }
  },
  setLogo: (url) => set({ logo: url }),
}));

// backward compat alias
export const useCompanyStoreLegacy = useCompanyStore;
