/**
 * RAJA'S WEAR — Live Catalog Sync
 * ---------------------------------------------------------------
 * Pulls the current product list from Supabase (the same database
 * the hidden /admin dashboard writes to) and merges it into the
 * RAJA_PRODUCTS array defined in products.js.
 *
 * If Supabase can't be reached for any reason, this fails silently
 * and the site keeps using the built-in RAJA_PRODUCTS catalog, so
 * the site never breaks because of a network hiccup.
 */

const SUPABASE_URL = "https://dlflincjaeygmtdbbjwo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Opj1y1WsXF1CcCzBTP56uA_EKlvjrU4";

function getRajaSupabaseClient() {
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    return null;
  }
  if (!window._rajaSupabaseClient) {
    window._rajaSupabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return window._rajaSupabaseClient;
}

window.PRODUCTS_READY = (async function loadLiveProducts() {
  try {
    const client = getRajaSupabaseClient();
    if (!client) return;

    const { data, error } = await client
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) return;

    const mapped = data.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      subCategory: p.sub_category,
      price: Number(p.price),
      oldPrice: p.old_price !== null && p.old_price !== undefined ? Number(p.old_price) : null,
      rating: p.rating !== null && p.rating !== undefined ? Number(p.rating) : 0,
      reviewCount: p.review_count || 0,
      isBestseller: !!p.is_bestseller,
      isNew: !!p.is_new,
      badge: p.badge || "",
      images: Array.isArray(p.images) ? p.images : [],
      colors: Array.isArray(p.colors) ? p.colors : [],
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
      shortDesc: p.short_desc || "",
      fabric: p.fabric || "",
      fit: p.fit || "",
      construction: p.construction || "",
      care: p.care || "",
      details: Array.isArray(p.details) ? p.details : [],
    }));

    if (typeof RAJA_PRODUCTS !== "undefined" && Array.isArray(RAJA_PRODUCTS)) {
      RAJA_PRODUCTS.length = 0;
      RAJA_PRODUCTS.push(...mapped);
    }
  } catch (e) {
    console.warn("[RAJA'S WEAR] Live catalog unavailable — using built-in catalog.", e);
  }
})();
