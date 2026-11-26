// Public API calls. The real endpoints live in apps/api (Fastify) — see MASTER_PLAN §2.
// Until the API exists, requests are simulated so the site can be shown and tested.
export type RequestKind = "table" | "private" | "event";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function submitRequest(kind: RequestKind, data: Record<string, string>): Promise<{ ok: true; ref: string } | { ok: false; error: string }> {
  if (API) {
    try {
      const r = await fetch(`${API}/public/${kind === "event" ? "event-bookings" : kind === "private" ? "private-inquiries" : "reservations"}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!r.ok) return { ok: false, error: `HTTP ${r.status}` };
      return (await r.json()) as { ok: true; ref: string };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }
  await new Promise((r) => setTimeout(r, 700));
  return { ok: true, ref: `KA-${Math.random().toString(36).slice(2, 7).toUpperCase()}` };
}
