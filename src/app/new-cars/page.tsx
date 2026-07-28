import { prisma } from "@/lib/db";
import CarCard from "@/components/CarCard";

export default async function NewCarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const brand = typeof params.brand === "string" ? params.brand : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  const where: Record<string, unknown> = {
    status: "active",
    category: "new",
  };

  if (brand) where.brand = { slug: brand };

  const orderBy: Record<string, string> =
    sort === "price-low" ? { price: "asc" } :
    sort === "price-high" ? { price: "desc" } :
    { createdAt: "desc" };

  const limit = 12;
  const skip = (page - 1) * limit;

  const [cars, total] = await Promise.all([
    prisma.car.findMany({
      where,
      include: { brand: true, model: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.car.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">New Cars in Bahrain</h1>
          <p className="text-green-100 mt-2">{total} new cars available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Brand Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <a
            href="/new-cars"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !brand ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All Brands
          </a>
          {brands.map((b) => (
            <a
              key={b.id}
              href={`/new-cars?brand=${b.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                brand === b.slug ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {b.name}
            </a>
          ))}
        </div>

        {/* Sort */}
        <div className="flex justify-end mb-6">
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm" defaultValue={sort}>
            <option value="newest">Latest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

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
                  <a
                    key={p}
                    href={`/new-cars?page=${p}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      p === page
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {p}
                  </a>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No new cars found</h3>
            <p className="text-gray-500">Check back later for new arrivals.</p>
          </div>
        )}
      </div>
    </div>
  );
}
