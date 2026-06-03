import React from "react";
import { ShopSummary } from "@/lib/data";

interface SummaryCardsProps {
  shops: ShopSummary[];
  allShops: ShopSummary[];
}

const cardStyle = {
  background: 'hsl(217, 25%, 14%)',
  border: '1px solid hsla(0,0%,100%,0.10)',
};

export default function SummaryCards({ shops, allShops }: SummaryCardsProps) {
  const minScore = Math.min(...shops.map((s) => s.overall_rating_10));
  const maxScore = Math.max(...shops.map((s) => s.overall_rating_10));
  const avgPrice =
    shops.reduce((s, sh) => s + sh.avg_price, 0) / shops.length;
  const priceMin = Math.min(...shops.map((s) => s.avg_price));
  const priceMax = Math.max(...shops.map((s) => s.avg_price));

  const bestValue = shops.reduce((best, s) =>
    s.value_score > best.value_score ? s : best
  );
  const totalReviews = shops.reduce((s, sh) => s + sh.review_count, 0);

  // city avg price for positive delta indicator
  const cityAvgPrice =
    allShops.reduce((s, sh) => s + sh.avg_price, 0) / allShops.length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-5">
      {/* Overall Score Range */}
      <div className="rounded-lg p-4" style={cardStyle}>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'hsla(0,0%,100%,0.40)' }}>
          Overall Score Range
        </p>
        <p className="text-[22px] font-bold text-white leading-none">
          {minScore.toFixed(1)}–{maxScore.toFixed(1)}
        </p>
        <p className="text-[11px] mt-2" style={{ color: 'hsla(0,0%,100%,0.50)' }}>Out of 10 points</p>
      </div>

      {/* Average Price */}
      <div className="rounded-lg p-4" style={cardStyle}>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'hsla(0,0%,100%,0.40)' }}>
          Average Price
        </p>
        <p className="text-[22px] font-bold text-white leading-none">
          ${avgPrice.toFixed(2)}{" "}
          {avgPrice > cityAvgPrice && (
            <span className="text-good text-base font-semibold">▲</span>
          )}
        </p>
        <p className="text-[11px] mt-2" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
          ${priceMin.toFixed(2)} – ${priceMax.toFixed(2)} range
        </p>
      </div>

      {/* Best Value Score */}
      <div className="rounded-lg p-4" style={cardStyle}>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'hsla(0,0%,100%,0.40)' }}>
          Best Value Score
        </p>
        <p className="text-[22px] font-bold text-white leading-none truncate">
          {bestValue.shop_name}
        </p>
        <p className="text-[11px] mt-2" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
          Value Score: {bestValue.value_score.toFixed(2)}
        </p>
        <p className="text-[11px]" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
          {totalReviews.toLocaleString()} reviews total
        </p>
      </div>

      {/* Shops Analyzed */}
      <div className="rounded-lg p-4" style={cardStyle}>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'hsla(0,0%,100%,0.40)' }}>
          Shops Analyzed
        </p>
        <p className="text-[22px] font-bold text-white leading-none">
          {shops.length} Shops
        </p>
        <p className="text-[11px] mt-2" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
          {totalReviews.toLocaleString()} reviews total
        </p>
      </div>
    </div>
  );
}
