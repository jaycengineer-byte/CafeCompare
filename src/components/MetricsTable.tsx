import React from "react";
import { ShopSummary } from "@/lib/data";

interface MetricsTableProps {
  shops: ShopSummary[];
  allShops: ShopSummary[];
}

function Badge({
  value,
  type,
}: {
  value: string;
  type: "yes" | "no" | "lim" | "neu" | "plen";
}) {
  const cls = {
    yes: "b-yes",
    no: "b-no",
    lim: "b-lim",
    neu: "b-neu",
    plen: "b-plen",
  }[type];
  return <span className={`badge ${cls}`}>{value}</span>;
}

function StarRating({ score10 }: { score10: number }) {
  const stars = Math.round(score10 / 2);
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm leading-none" style={{ color: '#fdcc6a' }}>
        {"★".repeat(Math.min(stars, 5))}
        {"☆".repeat(Math.max(5 - stars, 0))}
      </span>
      <span className="font-semibold text-white mt-0.5">
        {score10.toFixed(1)}
      </span>
    </div>
  );
}

function SectionHeader({ label, colSpan }: { label: string; colSpan: number }) {
  return (
    <tr style={{ background: 'hsl(216, 26%, 11%)' }}>
      <td
        colSpan={colSpan}
        className="py-1.5 px-5 text-[10px] font-bold uppercase tracking-[0.12em]"
        style={{ color: 'hsla(0,0%,100%,0.30)' }}
      >
        {label}
      </td>
    </tr>
  );
}

// City-wide averages across all shops
function cityAvg(allShops: ShopSummary[], field: keyof ShopSummary): number {
  const vals = allShops.map((s) => s[field] as number);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function avg(shops: ShopSummary[], field: keyof ShopSummary): number {
  const vals = shops.map((s) => s[field] as number);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function numDiff(a: number, b: number, fmt?: (v: number) => string) {
  const diff = b - a;
  const f = fmt ?? ((v: number) => v.toFixed(2));
  if (Math.abs(diff) < 0.005) return <span style={{ color: 'hsla(0,0%,100%,0.30)' }}>—</span>;
  return (
    <span className={diff > 0 ? "diff-pos font-semibold" : "diff-neg"}>
      {diff > 0 ? "+" : ""}
      {f(diff)}
    </span>
  );
}

function wifiBadge(v: boolean) {
  return v ? <Badge value="YES" type="yes" /> : <Badge value="NO" type="no" />;
}

function outletsBadge(v: string) {
  if (v === "Plenty") return <Badge value="PLENTY" type="plen" />;
  if (v === "Limited") return <Badge value="LIMITED" type="lim" />;
  return <Badge value="NONE" type="neu" />;
}

function outdoorBadge(v: boolean) {
  return v ? <Badge value="YES" type="yes" /> : <Badge value="NO" type="no" />;
}

function parkingBadge(v: string) {
  if (v === "None") return <Badge value="NONE" type="neu" />;
  if (v === "Lot") return <Badge value="LOT" type="neu" />;
  if (v === "Valet") return <Badge value="VALET" type="neu" />;
  return <Badge value={v.toUpperCase()} type="neu" />;
}

function mobileBadge(v: boolean) {
  return v ? <Badge value="YES" type="yes" /> : <Badge value="NO" type="no" />;
}

export default function MetricsTable({ shops, allShops }: MetricsTableProps) {
  const showDiff = shops.length === 2;
  const [shopA, shopB] = shops;

  const avgOverall = avg(shops, "overall_rating_10");
  const avgCoffee = avg(shops, "coffee_quality");
  const avgService = avg(shops, "service_quality");
  const avgAtmosphere = avg(shops, "atmosphere");
  const avgPrice = avg(shops, "avg_price");
  const avgValueScore = avg(shops, "value_score_10");
  const avgWait = avg(shops, "avg_wait_time");

  const cityOverall = cityAvg(allShops, "overall_rating_10");
  const cityCoffee = cityAvg(allShops, "coffee_quality");
  const cityService = cityAvg(allShops, "service_quality");
  const cityAtmosphere = cityAvg(allShops, "atmosphere");
  const cityPrice = cityAvg(allShops, "avg_price");
  const cityValue = cityAvg(allShops, "value_score_10");
  const cityWait = cityAvg(allShops, "avg_wait_time");

  // Total columns: 1 (metric) + shops.length + 2 (avg, city) + (showDiff ? 1 : 0)
  const totalCols = 1 + shops.length + 2 + (showDiff ? 1 : 0);

  const rowBorder = { borderColor: 'hsla(0,0%,100%,0.06)' };

  const diffCell = (a: number, b: number, fmt?: (v: number) => string) =>
    showDiff ? (
      <td className="py-3 px-5 text-right">{numDiff(a, b, fmt)}</td>
    ) : null;

  const dashCell = () =>
    showDiff ? (
      <td className="py-3 px-5 text-right" style={{ color: 'hsla(0,0%,100%,0.30)' }}>—</td>
    ) : null;

  return (
    <div
      className="rounded-lg overflow-hidden mb-5"
      style={{
        background: 'hsl(217, 25%, 14%)',
        border: '1px solid hsla(0,0%,100%,0.10)',
      }}
    >
      <div className="px-5 py-4" style={{ borderBottom: '1px solid hsla(0,0%,100%,0.10)' }}>
        <h2 className="text-sm font-bold text-white">
          Coffee Shop Metrics Comparison
        </h2>
      </div>
      <table className="w-full text-[11px]">
        <thead>
          <tr
            className="text-[10px] uppercase tracking-wider"
            style={{ background: 'hsl(216, 26%, 11%)', borderBottom: '1px solid hsla(0,0%,100%,0.10)' }}
          >
            <th className="text-left py-3 px-5 font-semibold w-44" style={{ color: 'hsla(0,0%,100%,0.40)' }}>
              Metric
            </th>
            {shops.map((s) => (
              <th
                key={s.shop_name}
                className="text-center py-3 px-4 font-bold"
                style={{ color: 'hsla(0,0%,100%,0.80)' }}
              >
                {s.shop_name}
              </th>
            ))}
            <th className="text-center py-3 px-4 font-semibold" style={{ color: 'hsla(0,0%,100%,0.40)' }}>
              Average
            </th>
            <th className="text-center py-3 px-4 font-semibold" style={{ color: 'hsla(0,0%,100%,0.40)' }}>
              City Avg
            </th>
            {showDiff && (
              <th className="text-right py-3 px-5 font-semibold" style={{ color: 'hsla(0,0%,100%,0.40)' }}>
                Difference
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {/* OVERALL RATINGS */}
          <SectionHeader label="Overall Ratings" colSpan={totalCols} />
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5 font-medium" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Overall Score</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center">
                <StarRating score10={s.overall_rating_10} />
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {avgOverall.toFixed(1)}
            </td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {cityOverall.toFixed(1)}
            </td>
            {showDiff
              ? diffCell(shopA.overall_rating_10, shopB.overall_rating_10, (v) =>
                  v.toFixed(1)
                )
              : null}
          </tr>
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Coffee Quality</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center text-white">
                {s.coffee_quality.toFixed(1)}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {avgCoffee.toFixed(1)}
            </td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {cityCoffee.toFixed(1)}
            </td>
            {showDiff
              ? diffCell(shopA.coffee_quality, shopB.coffee_quality, (v) =>
                  v.toFixed(2)
                )
              : null}
          </tr>
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Service Speed</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center text-white">
                {s.service_quality.toFixed(1)}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {avgService.toFixed(1)}
            </td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {cityService.toFixed(1)}
            </td>
            {showDiff
              ? diffCell(shopA.service_quality, shopB.service_quality, (v) =>
                  v.toFixed(2)
                )
              : null}
          </tr>
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Atmosphere</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center text-white">
                {s.atmosphere.toFixed(1)}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {avgAtmosphere.toFixed(1)}
            </td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {cityAtmosphere.toFixed(1)}
            </td>
            {showDiff
              ? diffCell(shopA.atmosphere, shopB.atmosphere, (v) => v.toFixed(2))
              : null}
          </tr>

          {/* PRICING & VALUE */}
          <SectionHeader label="Pricing &amp; Value" colSpan={totalCols} />
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Avg Price</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center text-white">
                ${s.avg_price.toFixed(2)}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              ${avgPrice.toFixed(2)}
            </td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              ${cityPrice.toFixed(2)}
            </td>
            {showDiff
              ? diffCell(shopA.avg_price, shopB.avg_price, (v) =>
                  `$${Math.abs(v).toFixed(2)}`
                )
              : null}
          </tr>
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Value Score (1–10)</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center text-white">
                {s.value_score_10.toFixed(1)}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {avgValueScore.toFixed(1)}
            </td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {cityValue.toFixed(1)}
            </td>
            {showDiff
              ? diffCell(shopA.value_score_10, shopB.value_score_10, (v) =>
                  v.toFixed(1)
                )
              : null}
          </tr>

          {/* AMENITIES & FEATURES */}
          <SectionHeader label="Amenities &amp; Features" colSpan={totalCols} />
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Free WiFi</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center">
                {wifiBadge(s.has_wifi)}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {Math.round(
                (shops.filter((s) => s.has_wifi).length / shops.length) * 100
              )}
              %
            </td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {Math.round(
                (allShops.filter((s) => s.has_wifi).length / allShops.length) *
                  100
              )}
              %
            </td>
            {dashCell()}
          </tr>
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Power Outlets</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center">
                {outletsBadge(s.power_outlets)}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>Mixed</td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>Mixed</td>
            {dashCell()}
          </tr>
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Outdoor Seating</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center">
                {outdoorBadge(s.outdoor_seating)}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {Math.round(
                (shops.filter((s) => s.outdoor_seating).length / shops.length) *
                  100
              )}
              %
            </td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {Math.round(
                (allShops.filter((s) => s.outdoor_seating).length /
                  allShops.length) *
                  100
              )}
              %
            </td>
            {dashCell()}
          </tr>
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Parking</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center">
                {parkingBadge(s.parking)}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>Mixed</td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>Mixed</td>
            {dashCell()}
          </tr>
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Mobile Order</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center">
                {mobileBadge(s.mobile_ordering)}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {Math.round(
                (shops.filter((s) => s.mobile_ordering).length / shops.length) *
                  100
              )}
              %
            </td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {Math.round(
                (allShops.filter((s) => s.mobile_ordering).length /
                  allShops.length) *
                  100
              )}
              %
            </td>
            {dashCell()}
          </tr>

          {/* OPERATING HOURS & TRAFFIC */}
          <SectionHeader label="Operating Hours &amp; Traffic" colSpan={totalCols} />
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Avg Wait Time</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center text-white">
                {Math.round(s.avg_wait_time)} min
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {Math.round(avgWait)} min
            </td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {Math.round(cityWait)} min
            </td>
            {showDiff
              ? diffCell(shopA.avg_wait_time, shopB.avg_wait_time, (v) =>
                  `${Math.round(Math.abs(v))} min`
                )
              : null}
          </tr>
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Review Count</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center text-white">
                {s.review_count.toLocaleString()}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {Math.round(
                shops.reduce((a, b) => a + b.review_count, 0) / shops.length
              ).toLocaleString()}
            </td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {Math.round(
                allShops.reduce((a, b) => a + b.review_count, 0) /
                  allShops.length
              ).toLocaleString()}
            </td>
            {showDiff
              ? diffCell(shopA.review_count, shopB.review_count, (v) =>
                  `${Math.round(Math.abs(v))}`
                )
              : null}
          </tr>

          {/* SPECIALTY & INNOVATION */}
          <SectionHeader label="Speciality &amp; Innovation" colSpan={totalCols} />
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Neighborhood</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center text-white">
                {s.neighborhood}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>—</td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>—</td>
            {dashCell()}
          </tr>
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>City</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center text-white">
                {s.city}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>—</td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>—</td>
            {dashCell()}
          </tr>

          {/* CUSTOMER METRICS */}
          <SectionHeader label="Customer Metrics" colSpan={totalCols} />
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Overall Rating (raw)</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center text-white">
                {s.overall_rating.toFixed(2)} ★
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {avg(shops, "overall_rating").toFixed(2)} ★
            </td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {cityAvg(allShops, "overall_rating").toFixed(2)} ★
            </td>
            {showDiff
              ? diffCell(shopA.overall_rating, shopB.overall_rating, (v) =>
                  v.toFixed(2)
                )
              : null}
          </tr>
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Atmosphere Score</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center text-white">
                {s.atmosphere.toFixed(2)}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {avgAtmosphere.toFixed(2)}
            </td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>
              {cityAtmosphere.toFixed(2)}
            </td>
            {showDiff
              ? diffCell(shopA.atmosphere, shopB.atmosphere, (v) => v.toFixed(2))
              : null}
          </tr>
          <tr className="border-t hover:bg-white/5" style={rowBorder}>
            <td className="py-3 px-5" style={{ color: 'hsla(0,0%,100%,0.80)' }}>Value per Dollar</td>
            {shops.map((s) => (
              <td key={s.shop_name} className="py-3 px-4 text-center text-white">
                {(s.value_score / s.avg_price).toFixed(2)}
              </td>
            ))}
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>—</td>
            <td className="py-3 px-4 text-center" style={{ color: 'hsla(0,0%,100%,0.50)' }}>—</td>
            {showDiff
              ? diffCell(
                  shopA.value_score / shopA.avg_price,
                  shopB.value_score / shopB.avg_price,
                  (v) => v.toFixed(2)
                )
              : null}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
