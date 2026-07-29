import Link from "next/link";
import BrandGrid from "@/components/BrandGrid";
import SearchBar from "@/components/SearchBar";
import LiveListings from "@/components/LiveListings";
import { CATEGORIES, PRICE_RANGES } from "@/data/constants";
import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

function getCategoryIcon(type: string) {
  const icons: Record<string, JSX.Element> = {
    sedan: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
        <path d="M8 40h48v4H8zM12 36l4-12h32l4 12zM16 24c0-2 2-4 4-4h24c2 0 4 2 4 4v4H16v-4z" opacity="0.3"/>
        <path d="M6 42a2 2 0 012-2h48a2 2 0 012 2v2H6v-2zM10 36l5-14h34l5 14H10zM18 18h28a3 3 0 013 3v3H15v-3a3 3 0 013-3z"/>
        <circle cx="16" cy="42" r="4"/><circle cx="48" cy="42" r="4"/>
        <circle cx="16" cy="42" r="2" fill="white"/><circle cx="48" cy="42" r="2" fill="white"/>
      </svg>
    ),
    suv: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
        <path d="M6 42a2 2 0 012-2h48a2 2 0 012 2v2H6v-2zM10 36l3-14h38l3 14H10zM14 16h36a3 3 0 013 3v5H11v-5a3 3 0 013-3z"/>
        <circle cx="16" cy="42" r="5"/><circle cx="48" cy="42" r="5"/>
        <circle cx="16" cy="42" r="2.5" fill="white"/><circle cx="48" cy="42" r="2.5" fill="white"/>
        <rect x="28" y="20" width="8" height="6" rx="1" opacity="0.3"/>
      </svg>
    ),
    hatchback: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
        <path d="M6 42a2 2 0 012-2h48a2 2 0 012 2v2H6v-2zM10 36l5-12h34l5 12H10zM18 20h28a3 3 0 013 3v4H15v-4a3 3 0 013-3z"/>
        <circle cx="16" cy="42" r="4"/><circle cx="48" cy="42" r="4"/>
        <circle cx="16" cy="42" r="2" fill="white"/><circle cx="48" cy="42" r="2" fill="white"/>
        <path d="M42 20l8 8h6v-4a4 4 0 00-4-4h-10z" opacity="0.3"/>
      </svg>
    ),
    coupe: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
        <path d="M6 42a2 2 0 012-2h48a2 2 0 012 2v2H6v-2zM10 36l6-14h32l6 14H10zM20 18h24a3 3 0 013 3v5H17v-5a3 3 0 013-3z"/>
        <circle cx="16" cy="42" r="4"/><circle cx="48" cy="42" r="4"/>
        <circle cx="16" cy="42" r="2" fill="white"/><circle cx="48" cy="42" r="2" fill="white"/>
        <path d="M30 18l10 10h8v-6a4 4 0 00-4-4h-14z" opacity="0.3"/>
      </svg>
    ),
    pickup: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
        <path d="M6 42a2 2 0 012-2h48a2 2 0 012 2v2H6v-2zM10 36l4-12h16v-4h18l4 12H10zM30 20h18a3 3 0 013 3v3H30v-6z"/>
        <circle cx="16" cy="42" r="4"/><circle cx="48" cy="42" r="4"/>
        <circle cx="16" cy="42" r="2" fill="white"/><circle cx="48" cy="42" r="2" fill="white"/>
        <rect x="32" y="24" width="14" height="6" rx="1" opacity="0.3"/>
      </svg>
    ),
    sports: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
        <path d="M6 42a2 2 0 012-2h48a2 2 0 012 2v2H6v-2zM10 36l7-14h30l7 14H10zM22 18h20a3 3 0 013 3v5H19v-5a3 3 0 013-3z"/>
        <circle cx="16" cy="42" r="4"/><circle cx="48" cy="42" r="4"/>
        <circle cx="16" cy="42" r="2" fill="white"/><circle cx="48" cy="42" r="2" fill="white"/>
        <path d="M26 18l6 8h12l4-4h-22z" opacity="0.4"/>
      </svg>
    ),
    electric: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
        <path d="M6 42a2 2 0 012-2h48a2 2 0 012 2v2H6v-2zM10 36l5-12h34l5 12H10zM18 20h28a3 3 0 013 3v4H15v-4a3 3 0 013-3z"/>
        <circle cx="16" cy="42" r="4"/><circle cx="48" cy="42" r="4"/>
        <circle cx="16" cy="42" r="2" fill="white"/><circle cx="48" cy="42" r="2" fill="white"/>
        <path d="M34 14l-6 10h6l-2 8 8-10h-6l2-8z" fill="#fbbf24"/>
      </svg>
    ),
    hybrid: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
        <path d="M6 42a2 2 0 012-2h48a2 2 0 012 2v2H6v-2zM10 36l5-12h34l5 12H10zM18 20h28a3 3 0 013 3v4H15v-4a3 3 0 013-3z"/>
        <circle cx="16" cy="42" r="4"/><circle cx="48" cy="42" r="4"/>
        <circle cx="16" cy="42" r="2" fill="white"/><circle cx="48" cy="42" r="2" fill="white"/>
        <circle cx="32" cy="22" r="5" fill="#22c55e" opacity="0.8"/>
        <path d="M30 20l2-3 2 3h-1.5v2h-1v-2H30z" fill="white"/>
      </svg>
    ),
    luxury: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
        <path d="M6 42a2 2 0 012-2h48a2 2 0 012 2v2H6v-2zM10 36l5-12h34l5 12H10zM16 20h32a3 3 0 013 3v4H13v-4a3 3 0 013-3z"/>
        <circle cx="16" cy="42" r="4"/><circle cx="48" cy="42" r="4"/>
        <circle cx="16" cy="42" r="2" fill="white"/><circle cx="48" cy="42" r="2" fill="white"/>
        <path d="M28 16l4-4 4 4h-3v3h-2v-3h-3z" fill="#fbbf24"/>
      </svg>
    ),
    family: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
        <path d="M6 42a2 2 0 012-2h48a2 2 0 012 2v2H6v-2zM10 36l4-10h36l4 10H10zM14 22h36a3 3 0 013 3v4H11v-4a3 3 0 013-3z"/>
        <circle cx="16" cy="42" r="4"/><circle cx="48" cy="42" r="4"/>
        <circle cx="16" cy="42" r="2" fill="white"/><circle cx="48" cy="42" r="2" fill="white"/>
        <rect x="24" y="24" width="16" height="8" rx="2" opacity="0.3"/>
      </svg>
    ),
    offroad: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
        <path d="M6 42a2 2 0 012-2h48a2 2 0 012 2v2H6v-2zM8 36l3-12h42l3 12H8zM12 18h40a3 3 0 013 3v5H9v-5a3 3 0 013-3z"/>
        <circle cx="16" cy="42" r="6"/><circle cx="48" cy="42" r="6"/>
        <circle cx="16" cy="42" r="3" fill="white"/><circle cx="48" cy="42" r="3" fill="white"/>
        <path d="M20 18h24v4H20z" opacity="0.3"/>
      </svg>
    ),
    van: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
        <path d="M6 42a2 2 0 012-2h48a2 2 0 012 2v2H6v-2zM8 36l3-14h42l3 14H8zM10 18h44a3 3 0 013 3v5H7v-5a3 3 0 013-3z"/>
        <circle cx="16" cy="42" r="4"/><circle cx="48" cy="42" r="4"/>
        <circle cx="16" cy="42" r="2" fill="white"/><circle cx="48" cy="42" r="2" fill="white"/>
        <rect x="12" y="22" width="12" height="8" rx="1" opacity="0.3"/>
        <rect x="26" y="22" width="12" height="8" rx="1" opacity="0.3"/>
      </svg>
    ),
  };
  return icons[type] || icons.sedan;
}

export default async function HomePage() {
  noStore();
  const newCars = await prisma.car.findMany({
    where: { status: "active" },
    include: { brand: true, model: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Car in <span className="text-gold-400">Bahrain</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse hundreds of quality used and new cars. Trusted by thousands of happy customers across Bahrain.
          </p>

          {/* Search Bar */}
          <SearchBar />
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/used-cars?bodyType=${cat.slug}`}
                className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all border border-gray-100 group"
              >
                <div className="w-12 h-12 mx-auto mb-2 text-blue-900 group-hover:text-gold-500">
                  {getCategoryIcon(cat.icon)}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-900">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Brand */}
      <BrandGrid />

      {/* New Listings */}
      {newCars.length > 0 && (
        <LiveListings initialCars={newCars as never} />
      )}

      {/* Browse by Price */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Price</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {PRICE_RANGES.map((p) => (
              <Link
                key={p.max}
                href={`/used-cars?maxPrice=${p.max}`}
                className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all border border-gray-100 group"
              >
                <span className="text-lg font-bold text-blue-900 group-hover:text-gold-500">{p.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why Choose Gulf Cars Bahrain?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Trusted Seller</h3>
              <p className="text-sm text-gray-600">All cars verified and inspected by our expert team</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-sm text-gray-600">Competitive prices with no hidden fees</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick Service</h3>
              <p className="text-sm text-gray-600">Fast and hassle-free buying experience</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Happy Customers</h3>
              <p className="text-sm text-gray-600">Thousands of satisfied buyers across Bahrain</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Looking for a Specific Car?</h2>
          <p className="text-gray-300 mb-6">Contact us today and we will help you find your dream car</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gold-500 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gold-400 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/used-cars"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
            >
              Browse Cars
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
