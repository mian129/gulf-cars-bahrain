"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import CarCard from "@/components/CarCard";

interface Car {
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
}

interface LiveListingsProps {
  initialCars: Car[];
}

export default function LiveListings({ initialCars }: LiveListingsProps) {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [newCount, setNewCount] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const prevIdsRef = useRef<Set<string>>(new Set(initialCars.map((c) => c.id)));
  const mountedRef = useRef(true);

  const fetchCars = useCallback(async () => {
    try {
      const res = await fetch(`/api/cars?status=active&limit=12&t=${Date.now()}`);
      const data = await res.json();
      if (!mountedRef.current) return;

      const fresh: Car[] = data.cars;
      const prevIds = prevIdsRef.current;
      const newIds = new Set(fresh.map((c) => c.id));

      let count = 0;
      for (const car of fresh) {
        if (!prevIds.has(car.id)) count++;
      }

      if (count > 0) {
        setNewCount(count);
        setTimeout(() => setNewCount(0), 3000);
      }

      setCars(fresh);
      prevIdsRef.current = newIds;
    } catch {
      // silently ignore fetch errors
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const interval = setInterval(fetchCars, 30000);
    return () => { mountedRef.current = false; clearInterval(interval); };
  }, [fetchCars]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">New Listings</h2>
            <span className="relative flex h-3 w-3">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? "bg-green-400 animate-ping" : "bg-gray-300"}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? "bg-green-500" : "bg-gray-400"}`}></span>
            </span>
            {newCount > 0 && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
                +{newCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setIsLive((v) => !v); if (!isLive) fetchCars(); }}
              className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${isLive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`}
            >
              {isLive ? "Live" : "Paused"}
            </button>
            <a href="/used-cars" className="text-blue-900 hover:text-blue-700 font-semibold text-sm flex items-center">
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cars.map((car) => (
            <div key={car.id} className="animate-fadeIn">
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
