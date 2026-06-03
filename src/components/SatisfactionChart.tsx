"use client";

import React, { useState } from "react";
import { ShopSummary } from "@/lib/data";

interface SatisfactionChartProps {
  shops: ShopSummary[];
}

const CHART_H = 200; // px — represents the 0–10 scale

function TooltipRow({ label, value, accent }: { label: string; value: number; accent?: string }) {
  const stars = Math.min(Math.round(value), 5);
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px]" style={{ color: "hsla(0,0%,100%,0.50)" }}>{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] leading-none" style={{ color: accent ?? "#fdcc6a" }}>
          {"★".repeat(stars)}{"☆".repeat(5 - stars)}
        </span>
        <span className="text-[11px] font-semibold text-white">{value.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default function SatisfactionChart({ shops }: SatisfactionChartProps) {
  const [hoveredShop, setHoveredShop] = useState<string | null>(null);

  return (
    <div
      className="rounded-lg p-6 mb-5"
      style={{ background: "hsl(217,25%,14%)", border: "1px solid hsla(0,0%,100%,0.10)" }}
    >
      <h2 className="text-sm font-bold text-white mb-0.5">Customer Satisfaction Breakdown</h2>
      <p className="text-[10px] uppercase tracking-wide mb-6" style={{ color: "hsla(0,0%,100%,0.40)" }}>
        Coffee Quality + Service &amp; Experience = Total Score | Total Score (out of 10)
      </p>

      <div className="flex gap-2">
        {/* Rotated Y-axis label */}
        <div className="flex items-center justify-center" style={{ width: 18, height: CHART_H }}>
          <span
            className="text-[10px] font-medium whitespace-nowrap"
            style={{
              color: "hsla(0,0%,100%,0.30)",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              letterSpacing: "0.05em",
            }}
          >
            Customer Rating Score (out of 5)
          </span>
        </div>

        {/* Y-axis numbers — height matches CHART_H exactly */}
        <div
          className="flex flex-col justify-between text-right text-[10px] pr-2"
          style={{ height: CHART_H, minWidth: 18, color: "hsla(0,0%,100%,0.30)" }}
        >
          <span>10</span>
          <span>8</span>
          <span>6</span>
          <span>4</span>
          <span>2</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="flex-1 relative">
          {/* Gridlines — span exactly CHART_H */}
          <div className="absolute left-0 right-0 pointer-events-none" style={{ top: 0, height: CHART_H }}>
            {[0, 20, 40, 60, 80].map((pct) => (
              <div
                key={pct}
                style={{
                  position: "absolute",
                  top: `${pct}%`,
                  left: 0,
                  right: 0,
                  borderTop: `1px solid ${pct === 0 ? "hsla(0,0%,100%,0.10)" : "hsla(0,0%,100%,0.06)"}`,
                }}
              />
            ))}
            {/* Baseline at bottom */}
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                borderTop: "2px solid hsla(0,0%,100%,0.20)",
              }}
            />
          </div>

          {/* ── Bars only, no labels — height = CHART_H so bottoms align with baseline ── */}
          <div className="flex items-end justify-around" style={{ height: CHART_H }}>
            {shops.map((shop) => {
              const coffeeVal = shop.coffee_quality;
              const serviceVal = shop.service_quality;
              const total = coffeeVal + serviceVal; // max 10
              const barHeightPx = (total / 10) * CHART_H;
              const isHovered = hoveredShop === shop.shop_name;

              return (
                <div
                  key={shop.shop_name}
                  className="relative"
                  onMouseEnter={() => setHoveredShop(shop.shop_name)}
                  onMouseLeave={() => setHoveredShop(null)}
                >
                  {/* Tooltip — anchored above the bar */}
                  {isHovered && (
                    <div
                      className="absolute z-50 rounded-lg p-3 pointer-events-none"
                      style={{
                        bottom: "calc(100% + 10px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "hsl(216,26%,11%)",
                        border: "1px solid hsla(0,0%,100%,0.15)",
                        boxShadow: "0 4px 20px hsla(0,0%,0%,0.50)",
                        minWidth: 190,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {/* Shop name */}
                      <p className="text-[12px] font-bold text-white mb-2 pb-2" style={{ borderBottom: "1px solid hsla(0,0%,100%,0.10)" }}>
                        {shop.shop_name}
                      </p>

                      {/* Rating rows */}
                      <div className="space-y-1 mb-2">
                        <TooltipRow label="Coffee Quality" value={coffeeVal} accent="#986e2e" />
                        <TooltipRow label="Service Quality" value={serviceVal} accent="#fdcc6a" />
                        <TooltipRow label="Atmosphere" value={shop.atmosphere} />
                        <TooltipRow label="Value Score" value={shop.value_score} />
                      </div>

                      {/* Divider + summary */}
                      <div className="space-y-1 pt-2" style={{ borderTop: "1px solid hsla(0,0%,100%,0.10)" }}>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[10px]" style={{ color: "hsla(0,0%,100%,0.50)" }}>Total Score</span>
                          <span className="text-[13px] font-bold" style={{ color: "#fdcc6a" }}>
                            {total.toFixed(1)}<span className="text-[10px] font-normal" style={{ color: "hsla(0,0%,100%,0.40)" }}>/10</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[10px]" style={{ color: "hsla(0,0%,100%,0.50)" }}>Avg Price</span>
                          <span className="text-[11px] font-semibold text-white">${shop.avg_price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[10px]" style={{ color: "hsla(0,0%,100%,0.50)" }}>Avg Wait</span>
                          <span className="text-[11px] font-semibold text-white">{Math.round(shop.avg_wait_time)} min</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[10px]" style={{ color: "hsla(0,0%,100%,0.50)" }}>Reviews</span>
                          <span className="text-[11px] font-semibold text-white">{shop.review_count.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bar itself */}
                  <div
                    className="flex flex-col rounded-t overflow-hidden transition-opacity"
                    style={{
                      width: 80,
                      height: barHeightPx,
                      opacity: hoveredShop && !isHovered ? 0.5 : 1,
                    }}
                  >
                    {/* Service segment — top, gold */}
                    <div
                      className="flex items-center justify-center font-bold text-[11px]"
                      style={{ flex: Math.round(serviceVal * 100), background: "#fdcc6a", color: "#191816" }}
                    >
                      {serviceVal.toFixed(2)}
                    </div>
                    {/* Coffee segment — bottom, wealth */}
                    <div
                      className="flex items-center justify-center font-bold text-white text-[11px]"
                      style={{ flex: Math.round(coffeeVal * 100), background: "#986e2e" }}
                    >
                      {coffeeVal.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Labels row — completely separate from the bars ── */}
          <div className="flex justify-around mt-3">
            {shops.map((shop) => {
              const total = shop.coffee_quality + shop.service_quality;
              return (
                <div key={shop.shop_name} className="flex flex-col items-center" style={{ width: 80 }}>
                  <p className="text-[11px] font-semibold text-center leading-tight" style={{ color: "hsla(0,0%,100%,0.80)" }}>
                    {shop.shop_name}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "hsla(0,0%,100%,0.50)" }}>
                    {total.toFixed(1)}/10
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4" style={{ paddingLeft: 52 }}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#986e2e" }} />
          <span className="text-[11px]" style={{ color: "hsla(0,0%,100%,0.50)" }}>Coffee Quality</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#fdcc6a" }} />
          <span className="text-[11px]" style={{ color: "hsla(0,0%,100%,0.50)" }}>Service &amp; Experience</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "hsla(0,0%,100%,0.20)" }} />
          <span className="text-[11px]" style={{ color: "hsla(0,0%,100%,0.50)" }}>Total Score (out of 10)</span>
        </div>
      </div>
    </div>
  );
}
