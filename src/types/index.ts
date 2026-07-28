export interface CarWithRelations {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  engineSize: string | null;
  seats: number | null;
  doors: number | null;
  images: string;
  category: string;
  featured: boolean;
  status: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  };
  model?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface CarFilters {
  brand?: string;
  model?: string;
  category?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  facebook: string;
  instagram: string;
  twitter: string;
  logo: string;
}
