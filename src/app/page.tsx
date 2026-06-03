import { Suspense } from "react";
import { getShopSummaries, getReviews } from "@/lib/data";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const allShops = getShopSummaries();
  const allReviews = getReviews();
  const defaultShopNames = allShops.slice(0, 2).map((s) => s.shop_name);

  return (
    <Suspense fallback={<div className="bg-gray-100 min-h-screen" />}>
      <Dashboard allShops={allShops} allReviews={allReviews} defaultShopNames={defaultShopNames} />
    </Suspense>
  );
}
