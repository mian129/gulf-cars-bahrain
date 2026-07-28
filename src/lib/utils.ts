import slugifyLib from "slugify";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-BH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-BH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getCarImages(imagesJson: string): string[] {
  try {
    return JSON.parse(imagesJson);
  } catch {
    return ["/placeholder-car.jpg"];
  }
}
