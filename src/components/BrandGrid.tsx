"use client";

import Link from "next/link";
import { useState } from "react";
import { CAR_BRANDS_WITH_SLUG } from "@/data/brands";

const INITIAL_ROWS = 3;
const COLS_LG = 9;
const INITIAL_COUNT = INITIAL_ROWS * COLS_LG;

export default function BrandGrid() {
  const [showAll, setShowAll] = useState(false);
  const visibleBrands = showAll ? CAR_BRANDS_WITH_SLUG : CAR_BRANDS_WITH_SLUG.slice(0, INITIAL_COUNT);
  const hasMore = CAR_BRANDS_WITH_SLUG.length > INITIAL_COUNT;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Brand</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
          {visibleBrands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/used-cars?brand=${brand.slug}`}
              className="bg-white rounded-xl p-3 text-center hover:shadow-lg transition-all border border-gray-100 group"
            >
              <div className="w-14 h-14 mx-auto mb-2 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full items-center justify-center ${brand.logo ? "hidden" : "flex"}`}
                >
                  <span className="text-xl font-bold text-gray-400 group-hover:text-blue-900">
                    {brand.name.charAt(0)}
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-blue-900 line-clamp-1">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center px-6 py-2.5 border-2 border-blue-900 text-blue-900 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition-colors"
            >
              {showAll ? (
                <>
                  Show Less
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  Show All {CAR_BRANDS_WITH_SLUG.length} Brands
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
