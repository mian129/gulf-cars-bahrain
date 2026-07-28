import Link from "next/link";
import { formatPrice, getCarImages } from "@/lib/utils";

interface CarCardProps {
  car: {
    id: string;
    title: string;
    slug: string;
    price: number;
    year: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    bodyType: string;
    color: string;
    images: string;
    category: string;
    featured: boolean;
    brand: { name: string; logo: string | null };
  };
}

export default function CarCard({ car }: CarCardProps) {
  const images = getCarImages(car.images);

  return (
    <Link href={`/car/${car.slug}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100">
        <div className="relative h-48 overflow-hidden">
          <img
            src={images[0] || "/placeholder-car.jpg"}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex gap-1">
            {car.featured && (
              <span className="bg-gold-500 text-white text-xs font-bold px-2 py-1 rounded">
                FEATURED
              </span>
            )}
            <span className={`text-xs font-bold px-2 py-1 rounded ${
              car.category === "new"
                ? "bg-green-500 text-white"
                : "bg-blue-900 text-white"
            }`}>
              {car.category === "new" ? "NEW" : "USED"}
            </span>
          </div>
          <div className="absolute bottom-2 right-2 bg-blue-900 text-white text-sm font-bold px-3 py-1 rounded-lg">
            BHD {formatPrice(car.price)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-1">
            {car.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {car.year} • {car.mileage.toLocaleString()} km • {car.transmission}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {car.fuelType}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {car.bodyType}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {car.color}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
