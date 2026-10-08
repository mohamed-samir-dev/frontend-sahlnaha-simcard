import { cache } from "react";

const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getCompany = cache(async () => {
  try {
    const res = await fetch(`${BACKEND}/api/admin/company`, {
      next: {
        revalidate: 86400, // 24 hours fallback ISR; invalidated on-demand via tag
        tags: ["company"],
      },
    });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
});
