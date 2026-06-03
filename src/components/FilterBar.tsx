"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShopSummary } from "@/lib/data";

interface FilterBarProps {
  allShops: ShopSummary[];
  selectedNames: string[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
  onCompare: () => void;
  onSave: () => void;
  saveStatus: "idle" | "saved";
}

export default function FilterBar({
  allShops,
  selectedNames,
  onAdd,
  onRemove,
  onCompare,
  onSave,
  saveStatus,
}: FilterBarProps) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowDropdown(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const unselected = allShops.filter((s) => !selectedNames.includes(s.shop_name));
  const filtered = unselected.filter((s) =>
    s.shop_name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelect(name: string) {
    onAdd(name);
    setSearch("");
    setShowDropdown(false);
  }

  return (
    <div
      className="rounded-lg border mb-5 flex items-center gap-3 flex-wrap px-4 py-3"
      style={{
        background: 'hsl(217,25%,14%)',
        borderColor: 'hsla(0,0%,100%,0.10)',
      }}
    >
      {/* Search box with dropdown */}
      <div ref={containerRef} className="relative flex-1 min-w-[160px]">
        <div
          className="rounded px-3 py-2 flex items-center gap-2 border"
          style={{
            background: 'hsla(0,0%,100%,0.05)',
            borderColor: 'hsla(0,0%,100%,0.10)',
          }}
        >
          <svg
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: 'hsla(0,0%,100%,0.30)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            className="flex-1 text-sm text-white placeholder:text-white/30 outline-none bg-transparent"
            placeholder={
              selectedNames.length >= 4
                ? "Max 4 shops selected"
                : "Search and add coffee shops..."
            }
            value={search}
            disabled={selectedNames.length >= 4}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />
        </div>

        {showDropdown && filtered.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 z-50 mt-1 rounded shadow-lg max-h-56 overflow-y-auto border"
            style={{
              background: 'hsl(217,25%,14%)',
              borderColor: 'hsla(0,0%,100%,0.10)',
            }}
          >
            {filtered.map((shop) => (
              <button
                key={shop.shop_name}
                className="w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 border-b last:border-0 transition-colors"
                style={{ borderColor: 'hsla(0,0%,100%,0.06)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'hsla(0,0%,100%,0.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur before click
                  handleSelect(shop.shop_name);
                }}
              >
                <span className="text-xs font-medium text-white truncate">
                  {shop.shop_name}
                </span>
                <span className="text-[10px] shrink-0" style={{ color: 'hsla(0,0%,100%,0.40)' }}>
                  {shop.neighborhood} · ★ {shop.overall_rating.toFixed(1)}
                </span>
              </button>
            ))}
          </div>
        )}

        {showDropdown && search.length > 0 && filtered.length === 0 && (
          <div
            className="absolute top-full left-0 right-0 z-50 mt-1 rounded shadow-lg border"
            style={{
              background: 'hsl(217,25%,14%)',
              borderColor: 'hsla(0,0%,100%,0.10)',
            }}
          >
            <p className="px-4 py-3 text-xs" style={{ color: 'hsla(0,0%,100%,0.40)' }}>No shops found</p>
          </div>
        )}
      </div>

      {/* Selected shop pills */}
      {selectedNames.map((name) => (
        <span
          key={name}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap text-white"
          style={{ background: 'hsla(0,0%,100%,0.10)' }}
        >
          {name}
          <button
            onClick={() => onRemove(name)}
            className="leading-none transition-colors"
            style={{ color: 'hsla(0,0%,100%,0.40)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'hsla(0,0%,100%,0.40)'; }}
            aria-label={`Remove ${name}`}
          >
            ×
          </button>
        </span>
      ))}

      {/* Action buttons */}
      <button
        onClick={onCompare}
        className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-4 py-2 rounded text-white"
        style={{
          background: 'hsla(0,0%,100%,0.05)',
          border: '1px solid hsla(0,0%,100%,0.15)',
        }}
      >
        Compare Ratings
      </button>
      <button
        onClick={onSave}
        className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-4 py-2 rounded transition-colors ${
          saveStatus === "saved"
            ? "bg-good text-command"
            : "bg-gold text-command"
        }`}
      >
        {saveStatus === "saved" ? "Saved! ✓" : "Save Comparison"}
      </button>
    </div>
  );
}
