"use client";

import { useRouter } from "next/navigation";

interface SortSelectProps {
  value: string;
  filters: Record<string, string>;
}

export default function SortSelect({ value, filters }: SortSelectProps) {
  const router = useRouter();

  const handleChange = (sort: string) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) {
      if (v) params.set(k, v);
    }
    if (sort !== "newest") params.set("sort", sort);
    router.push(`/used-cars?${params.toString()}`);
  };

  return (
    <select
      defaultValue={value}
      onChange={(e) => handleChange(e.target.value)}
      className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
    >
      <option value="newest">Latest First</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="year">Newest Year</option>
    </select>
  );
}
