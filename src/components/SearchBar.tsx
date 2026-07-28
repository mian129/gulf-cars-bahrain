"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CAR_BRANDS_WITH_SLUG } from "@/data/brands";
import { BODY_TYPES } from "@/data/constants";

const priceRanges = [
  { label: "Any Price", value: "" },
  { label: "Under 3,000 BHD", value: "3000" },
  { label: "Under 5,000 BHD", value: "5000" },
  { label: "Under 10,000 BHD", value: "10000" },
  { label: "Under 15,000 BHD", value: "15000" },
  { label: "Under 20,000 BHD", value: "20000" },
  { label: "Above 20,000 BHD", value: "20001" },
];

export default function SearchBar() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (bodyType) params.set("bodyType", bodyType.toLowerCase());
    if (maxPrice === "20001") {
      params.set("minPrice", "20001");
    } else if (maxPrice) {
      params.set("maxPrice", maxPrice);
    }
    router.push(`/used-cars?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl p-4 max-w-4xl mx-auto shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Brands</option>
          {CAR_BRANDS_WITH_SLUG.map((b) => (
            <option key={b.slug} value={b.slug}>{b.name}</option>
          ))}
        </select>
        <select
          value={bodyType}
          onChange={(e) => setBodyType(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Body Types</option>
          {BODY_TYPES.map((bt) => (
            <option key={bt} value={bt}>{bt}</option>
          ))}
        </select>
        <select
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {priceRanges.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Cars
        </button>
      </div>
    </div>
  );
}
