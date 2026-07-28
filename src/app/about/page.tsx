import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Gulf Cars Bahrain",
  description: "Learn about Gulf Cars Bahrain - your trusted partner for buying and selling quality cars in Bahrain.",
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About Gulf Cars Bahrain</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Your trusted destination for buying and selling quality used and new cars in the Kingdom of Bahrain
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Gulf Cars Bahrain was founded with a simple mission: to make car buying and selling in Bahrain
              easy, transparent, and trustworthy. We understand that purchasing a car is one of the biggest
              decisions you will make, and we are here to ensure you find the perfect vehicle at the right price.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With years of experience in the automotive industry, we have built a reputation for quality,
              honesty, and exceptional customer service. Every car in our inventory is carefully inspected
              to meet our high standards before being listed on our platform.
            </p>
          </div>
          <div className="bg-blue-100 rounded-2xl p-8 text-center">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold text-blue-900">500+</div>
                <div className="text-gray-600 mt-1">Cars Sold</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-900">1000+</div>
                <div className="text-gray-600 mt-1">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-900">50+</div>
                <div className="text-gray-600 mt-1">Car Brands</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-900">10+</div>
                <div className="text-gray-600 mt-1">Years Experience</div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600 text-sm">
                Every car undergoes a thorough inspection before listing. We ensure you get only the best quality vehicles.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600 text-sm">
                We offer competitive prices with complete transparency. No hidden fees, no surprises.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick & Easy</h3>
              <p className="text-gray-600 text-sm">
                Our streamlined process makes buying a car quick and hassle-free. Find and purchase in no time.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-900 rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Find Your Dream Car?</h2>
          <p className="text-blue-200 mb-6">Browse our collection of quality used and new cars in Bahrain</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/used-cars"
              className="bg-gold-500 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gold-400 transition-colors"
            >
              Browse Used Cars
            </Link>
            <Link
              href="/new-cars"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
            >
              Browse New Cars
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}