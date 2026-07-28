import { prisma } from "@/lib/db";
import CarCard from "@/components/CarCard";
import SortSelect from "@/components/SortSelect";
import Link from "next/link";
import { BODY_TYPES, FUEL_TYPES, TRANSMISSIONS, COLORS } from "@/data/constants";

function buildHref(updates: Record<string, string | undefined>, current: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) {
    if (v && k !== "page") params.set(k, v);
  }
  for (const [k, v] of Object.entries(updates)) {
    if (v) params.set(k, v);
    else params.delete(k);
  }
  params.delete("page");
  return `/used-cars?${params.toString()}`;
}

function sortHref(sort: string, current: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) {
    if (v && k !== "page" && k !== "sort") params.set(k, v);
  }
  params.set("sort", sort);
  return `/used-cars?${params.toString()}`;
}

function pageHref(p: number, current: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) {
    if (v && k !== "page") params.set(k, v);
  }
  params.set("page", String(p));
  return `/used-cars?${params.toString()}`;
}

export default async function UsedCarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const brand = typeof sp.brand === "string" ? sp.brand : undefined;
  const bodyType = typeof sp.bodyType === "string" ? sp.bodyType : undefined;
  const fuelType = typeof sp.fuelType === "string" ? sp.fuelType : undefined;
  const transmission = typeof sp.transmission === "string" ? sp.transmission : undefined;
  const color = typeof sp.color === "string" ? sp.color : undefined;
  const maxPrice = typeof sp.maxPrice === "string" ? Number(sp.maxPrice) : undefined;
  const minPrice = typeof sp.minPrice === "string" ? Number(sp.minPrice) : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : "newest";
  const page = typeof sp.page === "string" ? Number(sp.page) : 1;

  const currentFilters: Record<string, string> = {};
  if (brand) currentFilters.brand = brand;
  if (bodyType) currentFilters.bodyType = bodyType;
  if (fuelType) currentFilters.fuelType = fuelType;
  if (transmission) currentFilters.transmission = transmission;
  if (color) currentFilters.color = color;
  if (maxPrice) currentFilters.maxPrice = String(maxPrice);
  if (minPrice) currentFilters.minPrice = String(minPrice);
  if (sort && sort !== "newest") currentFilters.sort = sort;

  const where: Record<string, unknown> = {
    status: "active",
    category: "used",
  };

  if (brand) where.brand = { slug: brand };
  if (bodyType) where.bodyType = bodyType;
  if (fuelType) where.fuelType = fuelType;
  if (transmission) where.transmission = transmission;
  if (color) where.color = color;
  if (maxPrice) where.price = { ...((where.price as Record<string, number>) || {}), lte: maxPrice };
  if (minPrice) where.price = { ...((where.price as Record<string, number>) || {}), gte: minPrice };

  const orderBy: Record<string, string> =
    sort === "price-low" ? { price: "asc" } :
    sort === "price-high" ? { price: "desc" } :
    sort === "year" ? { year: "desc" } :
    { createdAt: "desc" };

  const limit = 12;
  const skip = (page - 1) * limit;

  const [cars, total, brands] = await Promise.all([
    prisma.car.findMany({
      where,
      include: { brand: true, model: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.car.count({ where }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const activeFilters: { label: string; href: string }[] = [];
  if (brand) {
    const bName = brands.find((b) => b.slug === brand)?.name || brand;
    activeFilters.push({ label: bName, href: buildHref({ brand: undefined }, currentFilters) });
  }
  if (bodyType) activeFilters.push({ label: bodyType, href: buildHref({ bodyType: undefined }, currentFilters) });
  if (fuelType) activeFilters.push({ label: fuelType, href: buildHref({ fuelType: undefined }, currentFilters) });
  if (transmission) activeFilters.push({ label: transmission, href: buildHref({ transmission: undefined }, currentFilters) });
  if (color) activeFilters.push({ label: color, href: buildHref({ color: undefined }, currentFilters) });
  if (maxPrice) activeFilters.push({ label: `Under ${maxPrice.toLocaleString()} BHD`, href: buildHref({ maxPrice: undefined }, currentFilters) });
  if (minPrice) activeFilters.push({ label: `Above ${minPrice.toLocaleString()} BHD`, href: buildHref({ minPrice: undefined }, currentFilters) });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Filters</h3>
              <form className="space-y-4">
                {brand && <input type="hidden" name="brand" value={brand} />}
                {sort && sort !== "newest" && <input type="hidden" name="sort" value={sort} />}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                  <select name="bodyType" defaultValue={bodyType || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                    <option value="">All Types</option>
                    {BODY_TYPES.map((bt) => (
                      <option key={bt} value={bt.toLowerCase()}>{bt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select name="fuelType" defaultValue={fuelType || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                    <option value="">All Fuel Types</option>
                    {FUEL_TYPES.map((ft) => (
                      <option key={ft} value={ft}>{ft}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                  <select name="transmission" defaultValue={transmission || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                    <option value="">All</option>
                    {TRANSMISSIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select name="color" defaultValue={color || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                    <option value="">All Colors</option>
                    {COLORS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (BHD)</label>
                  <input type="number" name="maxPrice" defaultValue={maxPrice || ""} placeholder="No limit"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (BHD)</label>
                  <input type="number" name="minPrice" defaultValue={minPrice || ""} placeholder="No minimum"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>

                <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                  Apply Filters
                </button>
                {activeFilters.length > 0 && (
                  <Link href="/used-cars" className="block text-center text-sm text-red-500 hover:text-red-700 font-medium">
                    Clear All Filters
                  </Link>
                )}
              </form>
            </div>
          </aside>

          {/* Car Listings */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Used Cars in Bahrain</h1>
                <p className="text-gray-500 text-sm mt-1">{total} cars found</p>
              </div>
              <SortSelect value={sort} filters={currentFilters} />
            </div>

            {/* Active Filter Badges */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map((f, i) => (
                  <Link
                    key={i}
                    href={f.href}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  >
                    {f.label}
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}

            {cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={pageHref(p, currentFilters)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          p === page
                            ? "bg-blue-900 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or check back later.</p>
                <Link href="/used-cars" className="text-blue-900 hover:underline font-medium">Clear all filters</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
