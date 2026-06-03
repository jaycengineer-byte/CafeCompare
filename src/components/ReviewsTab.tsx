"use client";

import React, { useState } from "react";
import { Review, ShopSummary } from "@/lib/data";

interface ReviewsTabProps {
  selectedShops: ShopSummary[];
  allReviews: Review[];
}

const PAGE_SIZE = 10;

function StarRow({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="leading-none text-sm" style={{ color: '#fdcc6a' }}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

function RatingPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px]">
      <span className="font-medium" style={{ color: 'hsla(0,0%,100%,0.40)' }}>{label}</span>
      <span className="font-semibold" style={{ color: 'hsla(0,0%,100%,0.80)' }}>{value.toFixed(1)}</span>
    </span>
  );
}

function AmenityPill({ label, value }: { label: string; value: boolean | string }) {
  const isGood =
    value === true || value === "Plenty" || value === "Lot" || value === "Valet";
  const isBad = value === false || value === "None";
  const text =
    typeof value === "boolean"
      ? value
        ? "✓"
        : "✗"
      : value;

  const style = isGood
    ? { background: 'hsla(151,63%,48%,0.15)', color: 'hsl(151,63%,48%)' }
    : isBad
    ? { background: 'hsla(0,77%,58%,0.15)', color: 'hsl(0,77%,58%)' }
    : { background: 'hsla(0,0%,100%,0.06)', color: 'hsla(0,0%,100%,0.50)' };

  return (
    <span
      className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded font-medium"
      style={style}
    >
      {label}: {text}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.review_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: 'hsl(216,21%,19%)',
        border: '1px solid hsla(0,0%,100%,0.06)',
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span className="text-[11px] font-semibold" style={{ color: 'hsla(0,0%,100%,0.80)' }}>{review.reviewer_id}</span>
          <span className="text-[10px] ml-2" style={{ color: 'hsla(0,0%,100%,0.40)' }}>{date}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <StarRow value={review.overall_rating} />
          <span className="text-[11px] font-bold text-white">{review.overall_rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Review text */}
      {review.review_text && (
        <p
          className="text-[11px] leading-relaxed mb-3 italic border-l-2 pl-2"
          style={{ color: 'hsla(0,0%,100%,0.60)', borderColor: '#fdcc6a' }}
        >
          &ldquo;{review.review_text}&rdquo;
        </p>
      )}

      {/* Sub-ratings */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
        <RatingPill label="Coffee" value={review.coffee_quality} />
        <span style={{ color: 'hsla(0,0%,100%,0.10)' }}>·</span>
        <RatingPill label="Service" value={review.service_quality} />
        <span style={{ color: 'hsla(0,0%,100%,0.10)' }}>·</span>
        <RatingPill label="Atmosphere" value={review.atmosphere} />
        <span style={{ color: 'hsla(0,0%,100%,0.10)' }}>·</span>
        <RatingPill label="Value" value={review.value_score} />
      </div>

      {/* Amenities + wait */}
      <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t" style={{ borderColor: 'hsla(0,0%,100%,0.10)' }}>
        <span className="text-[10px]" style={{ color: 'hsla(0,0%,100%,0.40)' }}>Wait: {review.wait_time_minutes} min</span>
        <span style={{ color: 'hsla(0,0%,100%,0.10)' }}>·</span>
        <AmenityPill label="WiFi" value={review.has_wifi} />
        <AmenityPill label="Outlets" value={review.power_outlets} />
        <AmenityPill label="Outdoor" value={review.outdoor_seating} />
        <AmenityPill label="Parking" value={review.parking === "None" ? false : review.parking} />
      </div>
    </div>
  );
}

function ShopReviews({ shop, reviews }: { shop: ShopSummary; reviews: Review[] }) {
  const [page, setPage] = useState(0);

  // Sort by overall_rating desc for "top" reviews
  const sorted = [...reviews].sort((a, b) => b.overall_rating - a.overall_rating);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageReviews = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const start = page * PAGE_SIZE + 1;
  const end = Math.min((page + 1) * PAGE_SIZE, sorted.length);

  const darkCard = {
    background: 'hsl(217,25%,14%)',
    border: '1px solid hsla(0,0%,100%,0.10)',
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Shop header */}
      <div className="rounded-lg px-4 py-3 mb-3 flex items-center justify-between" style={darkCard}>
        <div>
          <h3 className="text-sm font-bold text-white">{shop.shop_name}</h3>
          <p className="text-[10px] mt-0.5" style={{ color: 'hsla(0,0%,100%,0.40)' }}>
            {shop.neighborhood} · {sorted.length} reviews total
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <StarRow value={shop.overall_rating} />
            <span className="text-xs font-bold text-white ml-1">{shop.overall_rating.toFixed(2)}</span>
          </div>
          <span className="text-[10px]" style={{ color: 'hsla(0,0%,100%,0.40)' }}>avg overall rating</span>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-2 mb-3">
        {pageReviews.map((r) => (
          <ReviewCard key={r.review_id} review={r} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="rounded-lg px-4 py-3 flex items-center justify-between" style={darkCard}>
          <span className="text-[11px]" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
            Showing {start}–{end} of {sorted.length} reviews
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-[11px] font-medium px-3 py-1.5 rounded text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{
                background: 'hsla(0,0%,100%,0.05)',
                border: '1px solid hsla(0,0%,100%,0.10)',
              }}
            >
              ← Prev
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-6 h-6 rounded text-[11px] font-medium transition-colors ${
                    i === page
                      ? "bg-gold text-command"
                      : "hover:bg-white/5"
                  }`}
                  style={i !== page ? { color: 'hsla(0,0%,100%,0.50)' } : {}}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="text-[11px] font-medium px-3 py-1.5 rounded text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{
                background: 'hsla(0,0%,100%,0.05)',
                border: '1px solid hsla(0,0%,100%,0.10)',
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewsTab({ selectedShops, allReviews }: ReviewsTabProps) {
  return (
    <div className="flex gap-4 items-start">
      {selectedShops.map((shop) => {
        const shopReviews = allReviews.filter((r) => r.shop_name === shop.shop_name);
        return (
          <ShopReviews key={shop.shop_name} shop={shop} reviews={shopReviews} />
        );
      })}
    </div>
  );
}
