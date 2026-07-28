import { prisma } from "@/lib/db";
import { formatPrice, getCarImages } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = await prisma.car.findUnique({
    where: { slug },
    include: { brand: true },
  });

  if (!car) return { title: "Car Not Found" };

  return {
    title: `${car.title} | Gulf Cars Bahrain`,
    description: `${car.title} - ${car.year} - ${car.mileage.toLocaleString()} km - BHD ${formatPrice(car.price)}`,
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const car = await prisma.car.findUnique({
    where: { slug },
    include: { brand: true, model: true },
  });

  if (!car) notFound();

  // Increment views
  await prisma.car.update({
    where: { id: car.id },
    data: { views: { increment: 1 } },
  });

  const images = getCarImages(car.images);

  const specs = [
    { label: "Brand", value: car.brand.name },
    { label: "Model", value: car.model?.name || "N/A" },
    { label: "Year", value: car.year.toString() },
    { label: "Mileage", value: `${car.mileage.toLocaleString()} km` },
    { label: "Fuel Type", value: car.fuelType },
    { label: "Transmission", value: car.transmission },
    { label: "Body Type", value: car.bodyType },
    { label: "Color", value: car.color },
    ...(car.engineSize ? [{ label: "Engine", value: car.engineSize }] : []),
    ...(car.seats ? [{ label: "Seats", value: car.seats.toString() }] : []),
    ...(car.doors ? [{ label: "Doors", value: car.doors.toString() }] : []),
  ];

  const whatsappUrl = `https://wa.me/97300000000?text=Hi, I am interested in ${car.title} listed at BHD ${formatPrice(car.price)}`;
  const emailSubject = encodeURIComponent(`Inquiry about ${car.title}`);
  const emailBody = encodeURIComponent(`Hi, I am interested in ${car.title} listed at BHD ${formatPrice(car.price)}. Please provide more details.`);
  const smsUrl = `sms:+97300000000?body=Hi, I am interested in ${car.title} listed at BHD ${formatPrice(car.price)}`;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li><Link href="/" className="hover:text-blue-900">Home</Link></li>
            <li>/</li>
            <li><Link href={`/${car.category === "new" ? "new-cars" : car.category === "accessory" ? "accessories" : "used-cars"}`} className="hover:text-blue-900">
              {car.category === "new" ? "New Cars" : car.category === "accessory" ? "Accessories" : "Used Cars"}
            </Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{car.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="relative h-96">
                <img
                  src={images[0] || "/placeholder-car.jpg"}
                  alt={car.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {car.featured && (
                    <span className="bg-gold-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                      FEATURED
                    </span>
                  )}
                  <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                    car.category === "new" ? "bg-green-500 text-white" : "bg-blue-900 text-white"
                  }`}>
                    {car.category === "new" ? "NEW" : "USED"}
                  </span>
                </div>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${car.title} ${i + 1}`}
                      className="w-24 h-18 object-cover rounded-lg border-2 border-transparent hover:border-blue-500 cursor-pointer shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Title & Price */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900">{car.title}</h1>
              <div className="flex items-center justify-between mt-3">
                <span className="text-3xl font-bold text-blue-900">BHD {formatPrice(car.price)}</span>
                <span className="text-sm text-gray-500">{car.views} views</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Listed on {new Date(car.createdAt).toLocaleDateString("en-BH")}</p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500 block">{spec.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{car.description}</p>
            </div>
          </div>

          {/* Right - Contact Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Seller</h2>
              <p className="text-sm text-gray-600 mb-6">Interested in this car? Contact us directly.</p>

              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>

                <a
                  href="tel:+97300000000"
                  className="flex items-center justify-center w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call: +973 XXXX XXXX
                </a>

                <a
                  href={`mailto:info@gulfcarsbahrain.com?subject=${emailSubject}&body=${emailBody}`}
                  className="flex items-center justify-center w-full border-2 border-blue-900 text-blue-900 py-3 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </a>

                <a
                  href={smsUrl}
                  className="flex items-center justify-center w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Send SMS
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/contact"
                  className="block text-center text-sm text-blue-900 hover:underline font-medium"
                >
                  Fill Contact Form Instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}