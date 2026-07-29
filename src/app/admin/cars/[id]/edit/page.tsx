"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ALL_CAR_BRANDS as brands } from "@/data/brands";
import ImageUpload from "@/components/ImageUpload";

const bodyTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Pickup", "Sports", "Electric", "Hybrid", "Luxury", "Family", "Off-Road", "Van"];
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
const transmissions = ["Automatic", "Manual"];
const colors = ["White", "Black", "Silver", "Grey", "Blue", "Red", "Green", "Brown", "Beige", "Orange"];
const categories = ["used", "new", "accessory"];
const drivetrains = ["FWD", "RWD", "AWD", "4WD"];
const conditions = ["Excellent", "Good", "Fair", "Poor"];
const bahrainAreas = ["Manama", "Riffa", "Muharraq", "Hamad Town", "A'ali", "Isa Town", "Sitra", "Budaiya", "Juffair", "Seef", "Zallaq", "Riffa Views", "Dilmunia", "Amwaj Islands", "Hoora", "Gudaibiya", "North Riffa", "South Riffa", "Other"];

export default function EditCar() {
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "", description: "", price: "", year: "", mileage: "",
    fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan",
    color: "White", engineSize: "", seats: "", doors: "",
    category: "used", brand: "", featured: "false", status: "active",
    phone: "", whatsapp: "", location: "", drivetrain: "FWD",
    interiorColor: "", condition: "Good", accidentFree: "false",
    warranty: "false", serviceHistory: "false", negotiable: "false",
    horsepower: "", numberOfOwners: "", vin: "",
  });

  useEffect(() => {
    fetch(`/api/cars/${carId}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          title: data.title, description: data.description, price: data.price.toString(),
          year: data.year.toString(), mileage: data.mileage.toString(),
          fuelType: data.fuelType, transmission: data.transmission,
          bodyType: data.bodyType, color: data.color,
          engineSize: data.engineSize || "", seats: data.seats?.toString() || "",
          doors: data.doors?.toString() || "", category: data.category,
          brand: data.brand?.name || "", featured: data.featured.toString(),
          status: data.status,
          phone: data.phone || "", whatsapp: data.whatsapp || "",
          location: data.location || "", drivetrain: data.drivetrain || "FWD",
          interiorColor: data.interiorColor || "", condition: data.condition || "Good",
          accidentFree: data.accidentFree?.toString() || "false",
          warranty: data.warranty?.toString() || "false",
          serviceHistory: data.serviceHistory?.toString() || "false",
          negotiable: data.negotiable?.toString() || "false",
          horsepower: data.horsepower || "",
          numberOfOwners: data.numberOfOwners?.toString() || "",
          vin: data.vin || "",
        });
        try { setImages(JSON.parse(data.images)); } catch { setImages([]); }
        setFetching(false);
      })
      .catch(() => { setError("Failed to load car"); setFetching(false); });
  }, [carId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/cars/${carId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          year: Number(form.year),
          mileage: Number(form.mileage),
          seats: form.seats ? Number(form.seats) : null,
          doors: form.doors ? Number(form.doors) : null,
          numberOfOwners: form.numberOfOwners ? Number(form.numberOfOwners) : null,
          images: JSON.stringify(images),
          featured: form.featured === "true",
          accidentFree: form.accidentFree === "true",
          warranty: form.warranty === "true",
          serviceHistory: form.serviceHistory === "true",
          negotiable: form.negotiable === "true",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update car");
        setLoading(false);
        return;
      }

      router.push("/admin/cars");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this car?")) return;

    try {
      await fetch(`/api/cars/${carId}`, { method: "DELETE" });
      router.push("/admin/cars");
    } catch {
      alert("Failed to delete car");
    }
  };

  if (fetching) return <div className="text-center py-12 text-gray-500">Loading car details...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Car</h1>
        <button onClick={handleDelete} className="text-red-600 hover:text-red-800 text-sm font-medium">
          Delete Car
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select name="brand" value={form.brand} onChange={handleChange} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">Select Brand</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (BHD)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
              <select name="featured" value={form.featured} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Negotiable</label>
              <select name="negotiable" value={form.negotiable} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="false">Fixed Price</option>
                <option value="true">Negotiable</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-vertical" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Car Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input type="number" name="year" value={form.year} onChange={handleChange} required min="1990"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
              <input type="number" name="mileage" value={form.mileage} onChange={handleChange} required min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select name="fuelType" value={form.fuelType} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
              <select name="transmission" value={form.transmission} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
              <select name="bodyType" value={form.bodyType} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {bodyTypes.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drivetrain</label>
              <select name="drivetrain" value={form.drivetrain} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {drivetrains.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exterior Color</label>
              <select name="color" value={form.color} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {colors.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interior Color</label>
              <input type="text" name="interiorColor" value={form.interiorColor} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Black Leather" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Engine Size</label>
              <input type="text" name="engineSize" value={form.engineSize} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horsepower</label>
              <input type="text" name="horsepower" value={form.horsepower} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 200 HP" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
              <input type="number" name="seats" value={form.seats} onChange={handleChange} min="2" max="9"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select name="condition" value={form.condition} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous Owners</label>
              <input type="number" name="numberOfOwners" value={form.numberOfOwners} onChange={handleChange} min="0" max="20"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VIN Number</label>
              <input type="text" name="vin" value={form.vin} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features & Condition</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accident Free</label>
              <select name="accidentFree" value={form.accidentFree} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
              <select name="warranty" value={form.warranty} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service History</label>
              <select name="serviceHistory" value={form.serviceHistory} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact & Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. +973 3300 0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. +973 3300 0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location / Area</label>
              <select name="location" value={form.location} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">Select Area</option>
                {bahrainAreas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
          <ImageUpload images={images} onChange={setImages} />
        </div>

        <div className="flex justify-end space-x-3">
          <a href="/admin/cars" className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</a>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
