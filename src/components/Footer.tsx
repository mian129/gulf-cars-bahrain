import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gold-500 text-blue-900 font-bold text-xl px-3 py-1 rounded-lg">
                GC
              </div>
              <div>
                <span className="text-xl font-bold text-white">Gulf Cars</span>
                <span className="text-gold-400 text-sm block -mt-1">Bahrain</span>
              </div>
            </div>
            <p className="text-sm">
              Your trusted destination for buying and selling quality used and new cars in Bahrain.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/used-cars" className="hover:text-gold-400 transition-colors">Used Cars</Link></li>
              <li><Link href="/new-cars" className="hover:text-gold-400 transition-colors">New Cars</Link></li>
              <li><Link href="/accessories" className="hover:text-gold-400 transition-colors">Accessories</Link></li>
              <li><Link href="/contact" className="hover:text-gold-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Car Brands</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/used-cars?brand=toyota" className="hover:text-gold-400 transition-colors">Toyota</Link></li>
              <li><Link href="/used-cars?brand=honda" className="hover:text-gold-400 transition-colors">Honda</Link></li>
              <li><Link href="/used-cars?brand=bmw" className="hover:text-gold-400 transition-colors">BMW</Link></li>
              <li><Link href="/used-cars?brand=mercedes-benz" className="hover:text-gold-400 transition-colors">Mercedes-Benz</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Manama, Bahrain</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+973 XXXX XXXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@gulfcarsbahrain.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Gulf Cars Bahrain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
