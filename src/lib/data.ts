import { readFileSync } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export interface CsvRow {
  review_id: string;
  shop_name: string;
  address: string;
  city: string;
  neighborhood: string;
  review_date: string;
  reviewer_id: string;
  overall_rating: string;
  coffee_quality: string;
  service_quality: string;
  atmosphere: string;
  value_score: string;
  avg_price: string;
  wait_time_minutes: string;
  has_wifi: string;
  power_outlets: string;
  outdoor_seating: string;
  parking: string;
  mobile_ordering: string;
  review_text: string;
}

export interface ShopSummary {
  shop_name: string;
  address: string;
  city: string;
  neighborhood: string;
  review_count: number;
  // All ratings stored as raw 1-5 scale averages
  overall_rating: number;
  coffee_quality: number;
  service_quality: number;
  atmosphere: number;
  value_score: number;
  // Derived 10-pt scale (×2)
  overall_rating_10: number;
  coffee_quality_10: number;
  service_quality_10: number;
  atmosphere_10: number;
  value_score_10: number;
  avg_price: number;
  avg_wait_time: number;
  has_wifi: boolean;
  power_outlets: string;
  outdoor_seating: boolean;
  parking: string;
  mobile_ordering: boolean;
}

function mode<T>(arr: T[]): T {
  const freq = new Map<T, number>();
  for (const v of arr) freq.set(v, (freq.get(v) ?? 0) + 1);
  let best = arr[0];
  let bestCount = 0;
  for (const [k, c] of freq.entries()) {
    if (c > bestCount) { bestCount = c; best = k; }
  }
  return best;
}

let _cache: ShopSummary[] | null = null;

export function getShopSummaries(): ShopSummary[] {
  if (_cache) return _cache;

  const csvPath = path.join(process.cwd(), "data", "coffee_shop_reviews.csv");
  const content = readFileSync(csvPath, "utf-8");
  const rows: CsvRow[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  // Group by shop_name
  const groups = new Map<string, CsvRow[]>();
  for (const row of rows) {
    const g = groups.get(row.shop_name) ?? [];
    g.push(row);
    groups.set(row.shop_name, g);
  }

  const summaries: ShopSummary[] = [];
  for (const [shop_name, shopRows] of groups.entries()) {
    const avg = (field: keyof CsvRow) =>
      shopRows.reduce((s, r) => s + parseFloat(r[field] as string), 0) / shopRows.length;

    const boolAvg = (field: keyof CsvRow) =>
      shopRows.filter((r) => (r[field] as string).toLowerCase() === "true").length / shopRows.length > 0.5;

    const modeStr = (field: keyof CsvRow) =>
      mode(shopRows.map((r) => r[field] as string));

    const overall_rating = avg("overall_rating");
    const coffee_quality = avg("coffee_quality");
    const service_quality = avg("service_quality");
    const atmosphere = avg("atmosphere");
    const value_score = avg("value_score");

    summaries.push({
      shop_name,
      address: shopRows[0].address,
      city: shopRows[0].city,
      neighborhood: mode(shopRows.map((r) => r.neighborhood)),
      review_count: shopRows.length,
      overall_rating,
      coffee_quality,
      service_quality,
      atmosphere,
      value_score,
      overall_rating_10: overall_rating * 2,
      coffee_quality_10: coffee_quality * 2,
      service_quality_10: service_quality * 2,
      atmosphere_10: atmosphere * 2,
      value_score_10: value_score * 2,
      avg_price: avg("avg_price"),
      avg_wait_time: avg("wait_time_minutes"),
      has_wifi: boolAvg("has_wifi"),
      power_outlets: modeStr("power_outlets"),
      outdoor_seating: boolAvg("outdoor_seating"),
      parking: modeStr("parking"),
      mobile_ordering: boolAvg("mobile_ordering"),
    });
  }

  // Sort by overall_rating descending
  summaries.sort((a, b) => b.overall_rating - a.overall_rating);

  _cache = summaries;
  return summaries;
}

export function getAllShopNames(): string[] {
  return getShopSummaries().map((s) => s.shop_name);
}

export interface Review {
  review_id: number;
  shop_name: string;
  reviewer_id: string;
  review_date: string;
  overall_rating: number;
  coffee_quality: number;
  service_quality: number;
  atmosphere: number;
  value_score: number;
  avg_price: number;
  wait_time_minutes: number;
  has_wifi: boolean;
  power_outlets: string;
  outdoor_seating: boolean;
  parking: string;
  mobile_ordering: boolean;
  review_text: string;
}

let _reviewCache: Review[] | null = null;

export function getReviews(): Review[] {
  if (_reviewCache) return _reviewCache;

  const csvPath = path.join(process.cwd(), "data", "coffee_shop_reviews.csv");
  const content = readFileSync(csvPath, "utf-8");
  const rows: CsvRow[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  _reviewCache = rows.map((r) => ({
    review_id: parseInt(r.review_id),
    shop_name: r.shop_name,
    reviewer_id: r.reviewer_id,
    review_date: r.review_date,
    overall_rating: parseFloat(r.overall_rating),
    coffee_quality: parseFloat(r.coffee_quality),
    service_quality: parseFloat(r.service_quality),
    atmosphere: parseFloat(r.atmosphere),
    value_score: parseFloat(r.value_score),
    avg_price: parseFloat(r.avg_price),
    wait_time_minutes: parseInt(r.wait_time_minutes),
    has_wifi: r.has_wifi.toLowerCase() === "true",
    power_outlets: r.power_outlets,
    outdoor_seating: r.outdoor_seating.toLowerCase() === "true",
    parking: r.parking,
    mobile_ordering: r.mobile_ordering.toLowerCase() === "true",
    review_text: r.review_text,
  }));

  return _reviewCache;
}
