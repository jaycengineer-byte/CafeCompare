"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShopSummary, Review } from "@/lib/data";
import FilterBar from "@/components/FilterBar";
import SummaryCards from "@/components/SummaryCards";
import SatisfactionChart from "@/components/SatisfactionChart";
import MetricsTable from "@/components/MetricsTable";
import ReviewsTab from "@/components/ReviewsTab";

type Tab = "comparison" | "reviews";

interface DashboardProps {
  allShops: ShopSummary[];
  allReviews: Review[];
  defaultShopNames: string[];
}

export default function Dashboard({ allShops, allReviews, defaultShopNames }: DashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableRef = useRef<HTMLDivElement>(null);

  // Resolve initial selection from URL or defaults
  const resolveInitial = useCallback((): string[] => {
    const param = searchParams.get("shops");
    if (param) {
      const names = param.split(",").map((n) => n.trim());
      const valid = names.filter((n) => allShops.some((s) => s.shop_name === n));
      if (valid.length > 0) return valid;
    }
    return defaultShopNames;
  }, [searchParams, allShops, defaultShopNames]);

  const [selectedNames, setSelectedNames] = useState<string[]>(resolveInitial);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [activeTab, setActiveTab] = useState<Tab>("comparison");

  // Sync URL when selectedNames changes
  useEffect(() => {
    const param = selectedNames.join(",");
    const current = searchParams.get("shops") ?? "";
    if (param !== current) {
      const url = `?shops=${encodeURIComponent(param)}`;
      router.replace(url);
    }
  }, [selectedNames, router, searchParams]);

  const selectedShops = allShops.filter((s) => selectedNames.includes(s.shop_name));

  const addShop = (name: string) =>
    setSelectedNames((prev) =>
      prev.includes(name) || prev.length >= 4 ? prev : [...prev, name]
    );

  const removeShop = (name: string) =>
    setSelectedNames((prev) =>
      prev.length <= 1 ? prev : prev.filter((n) => n !== name)
    );

  const scrollToTable = () =>
    tableRef.current?.scrollIntoView({ behavior: "smooth" });

  const saveComparison = () => {
    localStorage.setItem(
      "cafecompare_saved",
      JSON.stringify({ shops: selectedNames, savedAt: new Date().toISOString() })
    );
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  return (
    <main className="bg-base min-h-screen py-6">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-[22px] font-bold tracking-tight text-command">
            Coffee Shop Comparison Dashboard
          </h1>
          <p
            className="text-[10px] uppercase tracking-[0.15em] mt-0.5 font-medium"
            style={{ color: '#3a3226', opacity: 0.6 }}
          >
            Local Coffee Shop Analysis · December 2025
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          allShops={allShops}
          selectedNames={selectedNames}
          onAdd={addShop}
          onRemove={removeShop}
          onCompare={scrollToTable}
          onSave={saveComparison}
          saveStatus={saveStatus}
        />

        {/* Tab bar */}
        <div
          className="flex gap-0 mb-5 border-b"
          style={{ borderColor: 'hsla(0,0%,0%,0.15)' }}
        >
          {(["comparison", "reviews"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? "border-gold text-wealth"
                  : "border-transparent hover:text-foundation"
              }`}
              style={activeTab !== tab ? { color: 'rgba(58,50,38,0.40)' } : {}}
            >
              {tab === "comparison" ? "Comparison" : "Reviews"}
            </button>
          ))}
        </div>

        {activeTab === "comparison" && (
          <>
            {/* Summary Cards */}
            <SummaryCards shops={selectedShops} allShops={allShops} />

            {/* Chart */}
            <SatisfactionChart shops={selectedShops} />

            {/* Metrics Table */}
            <div ref={tableRef}>
              <MetricsTable shops={selectedShops} allShops={allShops} />
            </div>
          </>
        )}

        {activeTab === "reviews" && (
          <ReviewsTab selectedShops={selectedShops} allReviews={allReviews} />
        )}

        {/* Methodology */}
        <div
          className="rounded-lg p-6 mb-6 mt-5"
          style={{
            background: 'hsl(217, 25%, 14%)',
            border: '1px solid hsla(0,0%,100%,0.10)',
          }}
        >
          <h2 className="text-sm font-bold text-white mb-4">
            Comparison Methodology
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[11px] font-semibold mb-2" style={{ color: 'hsla(0,0%,100%,0.70)' }}>
                Rating System
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
                All ratings on 5-point scale based on aggregated customer reviews.
                Scores displayed out of 10 by multiplying by 2. Coffee Quality and
                Service scores are raw averages from{" "}
                {allShops.reduce((a, b) => a + b.review_count, 0).toLocaleString()}{" "}
                total reviews.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold mb-2" style={{ color: 'hsla(0,0%,100%,0.70)' }}>
                Comparison Modes
              </p>
              <ul className="text-[11px] space-y-1 list-disc pl-4 leading-relaxed" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
                <li>Direct comparison of selected shops by overall rating</li>
                <li>Average: Mean of the displayed shops</li>
                <li>City Average: Citywide data across all {allShops.length} shops</li>
                <li>
                  Color Coding: Green = favorable, Red = unfavorable, Grey = neutral
                </li>
                <li>
                  Data Sources: Customer reviews CSV,{" "}
                  {allShops.reduce((a, b) => a + b.review_count, 0).toLocaleString()}{" "}
                  total reviews
                </li>
              </ul>
            </div>
          </div>
          <p className="text-[10px] mt-5" style={{ color: 'hsla(0,0%,100%,0.30)' }}>
            Data collected from customer reviews and surveys. Last updated: December 2025
          </p>
        </div>
      </div>
    </main>
  );
}
