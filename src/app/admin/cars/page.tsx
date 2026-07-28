import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default async function AdminCarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (category) where.category = category;

  const cars = await prisma.car.findMany({
    where,
    include: { brand: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Cars</h1>
        <Link
          href="/admin/cars/new"
          className="bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          + Add New Car
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <a href="/admin/cars" className={`px-3 py-1.5 rounded-lg text-sm font-medium ${!status ? "bg-blue-900 text-white" : "bg-white text-gray-700 border border-gray-200"}`}>
          All
        </a>
        <a href="/admin/cars?status=active" className={`px-3 py-1.5 rounded-lg text-sm font-medium ${status === "active" ? "bg-green-600 text-white" : "bg-white text-gray-700 border border-gray-200"}`}>
          Active
        </a>
        <a href="/admin/cars?status=sold" className={`px-3 py-1.5 rounded-lg text-sm font-medium ${status === "sold" ? "bg-yellow-500 text-white" : "bg-white text-gray-700 border border-gray-200"}`}>
          Sold
        </a>
        <a href="/admin/cars?status=hidden" className={`px-3 py-1.5 rounded-lg text-sm font-medium ${status === "hidden" ? "bg-gray-500 text-white" : "bg-white text-gray-700 border border-gray-200"}`}>
          Hidden
        </a>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={JSON.parse(car.images)[0] || "/placeholder-car.jpg"}
                        alt={car.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{car.title}</p>
                        <p className="text-xs text-gray-500">{car.brand.name} • {car.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-900">BHD {formatPrice(car.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      car.category === "new" ? "bg-green-100 text-green-700" :
                      car.category === "accessory" ? "bg-purple-100 text-purple-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {car.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      car.status === "active" ? "bg-green-100 text-green-700" :
                      car.status === "sold" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {car.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {car.featured ? (
                      <span className="text-yellow-500">⭐</span>
                    ) : (
                      <span className="text-gray-300">☆</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{car.views}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/admin/cars/${car.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <a
                        href={`/car/${car.slug}`}
                        target="_blank"
                        className="text-gray-400 hover:text-gray-600 text-sm"
                      >
                        View
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {cars.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg mb-2">No cars found</p>
            <Link href="/admin/cars/new" className="text-blue-900 hover:underline font-medium">
              Add your first car
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
