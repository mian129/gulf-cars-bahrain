import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@gulfcarsbahrain.com" },
    update: {},
    create: {
      email: "admin@gulfcarsbahrain.com",
      password: hashedPassword,
      name: "Admin",
    },
  });
  console.log("Admin created: admin@gulfcarsbahrain.com / admin123");

  // Create brands (all world car brands)
  const brandsData = [
    // Japanese
    { name: "Toyota", slug: "toyota" }, { name: "Honda", slug: "honda" },
    { name: "Nissan", slug: "nissan" }, { name: "Mazda", slug: "mazda" },
    { name: "Mitsubishi", slug: "mitsubishi" }, { name: "Suzuki", slug: "suzuki" },
    { name: "Subaru", slug: "subaru" }, { name: "Lexus", slug: "lexus" },
    { name: "Infiniti", slug: "infiniti" }, { name: "Acura", slug: "acura" },
    { name: "Daihatsu", slug: "daihatsu" }, { name: "Isuzu", slug: "isuzu" },
    // Korean
    { name: "Hyundai", slug: "hyundai" }, { name: "Kia", slug: "kia" },
    { name: "Genesis", slug: "genesis" }, { name: "SsangYong", slug: "ssangyong" },
    // German
    { name: "BMW", slug: "bmw" }, { name: "Mercedes-Benz", slug: "mercedes-benz" },
    { name: "Audi", slug: "audi" }, { name: "Volkswagen", slug: "volkswagen" },
    { name: "Porsche", slug: "porsche" }, { name: "Opel", slug: "opel" },
    { name: "Smart", slug: "smart" }, { name: "Maybach", slug: "maybach" },
    { name: "Alpina", slug: "alpina" },
    // American
    { name: "Ford", slug: "ford" }, { name: "Chevrolet", slug: "chevrolet" },
    { name: "GMC", slug: "gmc" }, { name: "Cadillac", slug: "cadillac" },
    { name: "Dodge", slug: "dodge" }, { name: "Chrysler", slug: "chrysler" },
    { name: "Jeep", slug: "jeep" }, { name: "Ram", slug: "ram" },
    { name: "Buick", slug: "buick" }, { name: "Lincoln", slug: "lincoln" },
    { name: "Tesla", slug: "tesla" }, { name: "Rivian", slug: "rivian" },
    { name: "Lucid", slug: "lucid" }, { name: "Hummer", slug: "hummer" },
    // British
    { name: "Land Rover", slug: "land-rover" }, { name: "Jaguar", slug: "jaguar" },
    { name: "Bentley", slug: "bentley" }, { name: "Rolls-Royce", slug: "rolls-royce" },
    { name: "Aston Martin", slug: "aston-martin" }, { name: "McLaren", slug: "mclaren" },
    { name: "Lotus", slug: "lotus" }, { name: "Mini", slug: "mini" },
    { name: "MG", slug: "mg" }, { name: "Morgan", slug: "morgan" },
    // Italian
    { name: "Ferrari", slug: "ferrari" }, { name: "Lamborghini", slug: "lamborghini" },
    { name: "Maserati", slug: "maserati" }, { name: "Alfa Romeo", slug: "alfa-romeo" },
    { name: "Fiat", slug: "fiat" }, { name: "Lancia", slug: "lancia" },
    { name: "Pagani", slug: "pagani" }, { name: "Abarth", slug: "abarth" },
    // French
    { name: "Renault", slug: "renault" }, { name: "Peugeot", slug: "peugeot" },
    { name: "Citroen", slug: "citroen" }, { name: "Bugatti", slug: "bugatti" },
    { name: "Alpine", slug: "alpine" }, { name: "DS Automobiles", slug: "ds-automobiles" },
    // Swedish
    { name: "Volvo", slug: "volvo" }, { name: "Saab", slug: "saab" },
    { name: "Polestar", slug: "polestar" },
    // Spanish
    { name: "SEAT", slug: "seat" }, { name: "Cupra", slug: "cupra" },
    // Czech
    { name: "Skoda", slug: "skoda" },
    // Romanian
    { name: "Dacia", slug: "dacia" },
    // Russian
    { name: "Lada", slug: "lada" },
    // Chinese
    { name: "BYD", slug: "byd" }, { name: "Geely", slug: "geely" },
    { name: "Changan", slug: "changan" }, { name: "Haval", slug: "haval" },
    { name: "Great Wall", slug: "great-wall" }, { name: "Chery", slug: "chery" },
    { name: "NIO", slug: "nio" }, { name: "Xpeng", slug: "xpeng" },
    { name: "Li Auto", slug: "li-auto" }, { name: "Hongqi", slug: "hongqi" },
    { name: "FAW", slug: "faw" }, { name: "Dongfeng", slug: "dongfeng" },
    { name: "BAIC", slug: "baic" }, { name: "GAC", slug: "gac" },
    { name: "JAC", slug: "jac" }, { name: "Wuling", slug: "wuling" },
    { name: "Zeekr", slug: "zeekr" }, { name: "Lynk & Co", slug: "lynk-co" },
    { name: "ORA", slug: "ora" }, { name: "Deepal", slug: "deepal" },
    { name: "Avatr", slug: "avatr" }, { name: "Jetour", slug: "jetour" },
    { name: "Omoda", slug: "omoda" }, { name: "Jaecoo", slug: "jaecoo" },
    { name: "Tank", slug: "tank" }, { name: "Denza", slug: "denza" },
    { name: "Voyah", slug: "voyah" }, { name: "Aion", slug: "aion" },
    // Indian
    { name: "Tata", slug: "tata" }, { name: "Mahindra", slug: "mahindra" },
    // Australian
    { name: "Holden", slug: "holden" },
    // Vietnamese
    { name: "VinFast", slug: "vinfast" },
    // Malaysian
    { name: "Proton", slug: "proton" },
    // Others
    { name: "W Motors", slug: "w-motors" }, { name: "Zenvo", slug: "zenvo" },
    { name: "Koenigsegg", slug: "koenigsegg" }, { name: "Rimac", slug: "rimac" },
    { name: "Devel", slug: "devel" }, { name: "Pininfarina", slug: "pininfarina" },
  ];

  const brands: Record<string, string> = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
    brands[b.name] = brand.id;
  }
  console.log(`${brandsData.length} brands created`);

  // Create categories
  const categoriesData = [
    { name: "Sedan", slug: "sedan", type: "body_type", icon: "sedan" },
    { name: "SUV", slug: "suv", type: "body_type", icon: "suv" },
    { name: "Hatchback", slug: "hatchback", type: "body_type", icon: "hatchback" },
    { name: "Coupe", slug: "coupe", type: "body_type", icon: "coupe" },
    { name: "Pickup", slug: "pickup", type: "body_type", icon: "pickup" },
    { name: "Van", slug: "van", type: "body_type", icon: "van" },
    { name: "MPV", slug: "mpv", type: "body_type", icon: "mpv" },
    { name: "Convertible", slug: "convertible", type: "body_type", icon: "convertible" },
    { name: "Electric", slug: "electric", type: "fuel_type", icon: "electric" },
    { name: "Hybrid", slug: "hybrid", type: "fuel_type", icon: "hybrid" },
    { name: "Luxury", slug: "luxury", type: "other", icon: "luxury" },
    { name: "Sports", slug: "sports", type: "other", icon: "sports" },
    { name: "Family", slug: "family", type: "other", icon: "family" },
    { name: "Off-Road", slug: "off-road", type: "other", icon: "offroad" },
  ];

  for (const c of categoriesData) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }
  console.log(`${categoriesData.length} categories created`);

  // Create sample cars
  const sampleCars = [
    {
      title: "Toyota Camry 2022",
      slug: "toyota-camry-2022",
      description: "Excellent condition Toyota Camry 2022 with low mileage. Single owner, fully serviced at authorized dealer. Features include leather seats, sunroof, backup camera, and advanced safety features. Non-smoker car, garage kept. Ready for immediate delivery.",
      price: 8500,
      year: 2022,
      mileage: 25000,
      fuelType: "Petrol",
      transmission: "Automatic",
      bodyType: "Sedan",
      color: "White",
      engineSize: "2.5L",
      seats: 5,
      doors: 4,
      images: JSON.stringify(["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"]),
      category: "used",
      featured: true,
      status: "active",
      brandId: brands["Toyota"],
    },
    {
      title: "Honda Civic 2023",
      slug: "honda-civic-2023",
      description: "Brand new Honda Civic 2023 with panoramic sunroof, wireless charging, Honda Sensing suite. Under manufacturer warranty. Perfect family car with excellent fuel economy.",
      price: 7200,
      year: 2023,
      mileage: 5000,
      fuelType: "Petrol",
      transmission: "Automatic",
      bodyType: "Sedan",
      color: "Black",
      engineSize: "1.5L Turbo",
      seats: 5,
      doors: 4,
      images: JSON.stringify(["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]),
      category: "used",
      featured: true,
      status: "active",
      brandId: brands["Honda"],
    },
    {
      title: "BMW X5 2021",
      slug: "bmw-x5-2021",
      description: "Luxurious BMW X5 xDrive40i with M Sport package. Features panoramic roof, Harman Kardon sound system, adaptive suspension, and premium leather interior. Full service history available.",
      price: 18500,
      year: 2021,
      mileage: 35000,
      fuelType: "Petrol",
      transmission: "Automatic",
      bodyType: "SUV",
      color: "Grey",
      engineSize: "3.0L Turbo",
      seats: 5,
      doors: 5,
      images: JSON.stringify(["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"]),
      category: "used",
      featured: true,
      status: "active",
      brandId: brands["BMW"],
    },
    {
      title: "Mercedes-Benz C-Class 2022",
      slug: "mercedes-benz-c-class-2022",
      description: "Elegant Mercedes-Benz C300 AMG Line with Burmester sound system, 64-color ambient lighting, and MBUX infotainment. Impeccable condition with full Mercedes service history.",
      price: 15800,
      year: 2022,
      mileage: 18000,
      fuelType: "Petrol",
      transmission: "Automatic",
      bodyType: "Sedan",
      color: "Silver",
      engineSize: "2.0L Turbo",
      seats: 5,
      doors: 4,
      images: JSON.stringify(["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"]),
      category: "used",
      featured: false,
      status: "active",
      brandId: brands["Mercedes-Benz"],
    },
    {
      title: "Nissan Patrol 2023",
      slug: "nissan-patrol-2023",
      description: "Powerful Nissan Patrol V6 with premium package. Perfect for family and off-road adventures. Features 360-degree camera, blind spot warning, and premium leather interior.",
      price: 22000,
      year: 2023,
      mileage: 8000,
      fuelType: "Petrol",
      transmission: "Automatic",
      bodyType: "SUV",
      color: "White",
      engineSize: "5.6L V8",
      seats: 7,
      doors: 5,
      images: JSON.stringify(["https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"]),
      category: "used",
      featured: true,
      status: "active",
      brandId: brands["Nissan"],
    },
    {
      title: "Hyundai Tucson 2024",
      slug: "hyundai-tucson-2024",
      description: "Brand new 2024 Hyundai Tucson Hybrid with all-wheel drive. Features digital cockpit, Bose premium audio, ventilated seats, and Hyundai SmartSense safety suite. Full manufacturer warranty.",
      price: 12500,
      year: 2024,
      mileage: 100,
      fuelType: "Hybrid",
      transmission: "Automatic",
      bodyType: "SUV",
      color: "Blue",
      engineSize: "1.6L Turbo Hybrid",
      seats: 5,
      doors: 5,
      images: JSON.stringify(["https://images.unsplash.com/photo-1633789242441-8a4206346e56?w=800"]),
      category: "new",
      featured: true,
      status: "active",
      brandId: brands["Hyundai"],
    },
    {
      title: "Kia Sportage 2023",
      slug: "kia-sportage-2023",
      description: "Stunning Kia Sportage GT-Line with panoramic display, Harman Kardon audio, and advanced driver assistance systems. Like-new condition with remaining factory warranty.",
      price: 11000,
      year: 2023,
      mileage: 12000,
      fuelType: "Petrol",
      transmission: "Automatic",
      bodyType: "SUV",
      color: "Red",
      engineSize: "1.6L Turbo",
      seats: 5,
      doors: 5,
      images: JSON.stringify(["https://images.unsplash.com/photo-1568844293283-19eb91494c80?w=800"]),
      category: "used",
      featured: false,
      status: "active",
      brandId: brands["Kia"],
    },
    {
      title: "Ford Mustang 2022",
      slug: "ford-mustang-2022",
      description: "Iconic Ford Mustang GT with 5.0L V8 engine. Features Recaro seats, Brembo brakes, and track pack. Thrilling performance in stunning Race Red. Well maintained with full service records.",
      price: 16500,
      year: 2022,
      mileage: 15000,
      fuelType: "Petrol",
      transmission: "Manual",
      bodyType: "Coupe",
      color: "Red",
      engineSize: "5.0L V8",
      seats: 4,
      doors: 2,
      images: JSON.stringify(["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"]),
      category: "used",
      featured: false,
      status: "active",
      brandId: brands["Ford"],
    },
    {
      title: "Toyota Land Cruiser 2024",
      slug: "toyota-land-cruiser-2024",
      description: "The legendary Toyota Land Cruiser 300 GR Sport. Twin-turbo V6 diesel, premium interior, and unmatched off-road capability. Brand new with full Toyota warranty.",
      price: 35000,
      year: 2024,
      mileage: 50,
      fuelType: "Diesel",
      transmission: "Automatic",
      bodyType: "SUV",
      color: "Black",
      engineSize: "3.3L V6 Twin Turbo",
      seats: 7,
      doors: 5,
      images: JSON.stringify(["https://images.unsplash.com/photo-1594611746107-2227d9098d1a?w=800"]),
      category: "new",
      featured: true,
      status: "active",
      brandId: brands["Toyota"],
    },
    {
      title: "Lexus RX 2023",
      slug: "lexus-rx-2023",
      description: "Sophisticated Lexus RX 350h hybrid with Executive Package. Features Mark Levinson audio, panoramic roof, and advanced Lexus Safety System. Whisper-quiet hybrid luxury.",
      price: 21000,
      year: 2023,
      mileage: 10000,
      fuelType: "Hybrid",
      transmission: "Automatic",
      bodyType: "SUV",
      color: "White",
      engineSize: "2.5L Hybrid",
      seats: 5,
      doors: 5,
      images: JSON.stringify(["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"]),
      category: "used",
      featured: false,
      status: "active",
      brandId: brands["Lexus"],
    },
    {
      title: "Mazda CX-5 2023",
      slug: "mazda-cx5-2023",
      description: "Beautiful Mazda CX-5 Signature with premium Nappa leather, Bose audio, and i-Activ AWD. Skyactiv-G engine provides responsive performance and excellent fuel economy.",
      price: 9800,
      year: 2023,
      mileage: 8000,
      fuelType: "Petrol",
      transmission: "Automatic",
      bodyType: "SUV",
      color: "Grey",
      engineSize: "2.5L Turbo",
      seats: 5,
      doors: 5,
      images: JSON.stringify(["https://images.unsplash.com/photo-1611016186304-9cc9e86e0e5c?w=800"]),
      category: "used",
      featured: false,
      status: "active",
      brandId: brands["Mazda"],
    },
    {
      title: "Audi Q7 2022",
      slug: "audi-q7-2022",
      description: "Premium Audi Q7 55 TFSI with S line package. Features Bang & Olufsen 3D sound, virtual cockpit plus, and air suspension. Spacious 7-seater luxury SUV.",
      price: 24000,
      year: 2022,
      mileage: 22000,
      fuelType: "Petrol",
      transmission: "Automatic",
      bodyType: "SUV",
      color: "Blue",
      engineSize: "3.0L V6 Turbo",
      seats: 7,
      doors: 5,
      images: JSON.stringify(["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]),
      category: "used",
      featured: true,
      status: "active",
      brandId: brands["Audi"],
    },
  ];

  for (const car of sampleCars) {
    await prisma.car.upsert({
      where: { slug: car.slug },
      update: {},
      create: car,
    });
  }
  console.log(`${sampleCars.length} sample cars created`);

  // Create default settings
  const defaultSettings = [
    { key: "businessName", value: "Gulf Cars Bahrain" },
    { key: "tagline", value: "Your Trusted Car Marketplace in Bahrain" },
    { key: "phone", value: "+973 XXXX XXXX" },
    { key: "whatsapp", value: "97300000000" },
    { key: "email", value: "info@gulfcarsbahrain.com" },
    { key: "address", value: "Manama, Kingdom of Bahrain" },
    { key: "workingHours", value: "Saturday - Thursday: 9:00 AM - 8:00 PM" },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log(`${defaultSettings.length} settings created`);

  console.log("\nSeed completed successfully!");
  console.log("Admin login: admin@gulfcarsbahrain.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
