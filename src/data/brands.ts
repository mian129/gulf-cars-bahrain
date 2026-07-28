const CDN = "https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main";

export const ALL_CAR_BRANDS = [
  // Japanese
  "Toyota", "Honda", "Nissan", "Mazda", "Mitsubishi", "Suzuki", "Subaru",
  "Lexus", "Infiniti", "Acura", "Daihatsu", "Isuzu", "Scion",

  // Korean
  "Hyundai", "Kia", "Genesis", "Daewoo", "SsangYong",

  // German
  "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Porsche", "Opel",
  "Smart", "Maybach", "Alpina", "Brabus", "RUF",

  // American
  "Ford", "Chevrolet", "GMC", "Cadillac", "Dodge", "Chrysler", "Jeep",
  "RAM", "Buick", "Lincoln", "Tesla", "Rivian", "Lucid",
  "Fisker", "Hummer", "Saturn", "Pontiac", "Oldsmobile",
  "Mercury", "Plymouth", "DeLorean", "Hennessey",
  "Saleen", "Shelby",

  // British
  "Land Rover", "Jaguar", "Bentley", "Rolls-Royce", "Aston Martin",
  "McLaren", "Lotus", "Mini", "MG", "Morgan",
  "Ariel", "Noble", "Westfield", "Caterham", "TVR",

  // Italian
  "Ferrari", "Lamborghini", "Maserati", "Alfa Romeo", "Fiat", "Lancia",
  "Pagani", "Pininfarina", "De Tomaso", "Abarth",

  // French
  "Renault", "Peugeot", "Citroen", "Bugatti", "Alpine", "DS Automobiles",
  "Venturi",

  // Swedish
  "Volvo", "Saab", "Koenigsegg", "Polestar",

  // Spanish
  "SEAT", "Cupra",

  // Czech
  "Skoda",

  // Romanian
  "Dacia",

  // Russian
  "Lada", "UAZ",

  // Chinese
  "BYD", "Geely", "Changan", "Haval", "Great Wall",
  "Chery", "NIO", "Xpeng", "Li Auto", "Hongqi", "FAW",
  "Dongfeng", "BAIC", "GAC", "JAC",
  "Zeekr", "Lynk & Co", "ORA", "Deepal", "Avatr",
  "Jetour", "Omoda", "Jaecoo", "Voyah", "Aion",
  "Denza",

  // Indian
  "Tata", "Mahindra", "Maruti Suzuki",

  // Australian
  "Holden",

  // Brazilian
  "Puma",

  // Malaysian
  "Proton", "Perodua",

  // Vietnamese
  "VinFast",

  // Others
  "W Motors", "Zenvo",
].sort();

// Brand name → logo filename from vehiclespecs/brand-logos CDN
const LOGO_MAP: Record<string, string> = {
  "Abarth": "abarth-logo.svg",
  "Acura": "acura-logo.svg",
  "Alfa Romeo": "alfa-romeo-logo.svg",
  "Alpina": "alpina-logo.svg",
  "Alpine": "alpine-logo.svg",
  "Ariel": "ariel-logo.svg",
  "Aston Martin": "aston-martin-logo.svg",
  "Audi": "audi-logo.svg",
  "Avatr": "avatr-logo.svg",
  "BAIC": "baic-logo.svg",
  "BMW": "bmw-logo.svg",
  "BYD": "byd-logo.svg",
  "Bentley": "bentley-logo.svg",
  "Bugatti": "bugatti-logo.svg",
  "Buick": "buick-logo.png",
  "Cadillac": "cadillac-logo.png",
  "Caterham": "caterham-logo.svg",
  "Changan": "changan-logo.png",
  "Chery": "chery-logo.png",
  "Chevrolet": "chevrolet-logo.png",
  "Chrysler": "chrysler-logo.svg",
  "Citroen": "citroen-logo.svg",
  "Cupra": "cupra-logo.svg",
  "DS Automobiles": "ds-logo.svg",
  "Dacia": "dacia-logo.svg",
  "Daewoo": "daewoo-logo.png",
  "Daihatsu": "daihatsu-logo.svg",
  "De Tomaso": "de-tomaso-logo.png",
  "Deepal": "deepal-logo.svg",
  "Denza": "denza-logo.svg",
  "DeLorean": "de-lorean-logo.svg",
  "Dodge": "dodge-logo.png",
  "Dongfeng": "dongfeng-logo.png",
  "FAW": "faw-logo.svg",
  "Ferrari": "ferrari-logo.svg",
  "Fiat": "fiat-logo.svg",
  "Fisker": "fisker-logo.png",
  "Ford": "ford-logo.png",
  "GMC": "gmc-logo.png",
  "GAC": "gac-logo.png",
  "Geely": "geely-logo.svg",
  "Genesis": "genesis-logo.svg",
  "Great Wall": "great-wall-logo.png",
  "Haval": "haval-logo.png",
  "Hennessey": "hennessey-logo.svg",
  "Holden": "holden-logo.svg",
  "Honda": "honda-logo.png",
  "Hongqi": "hongqi-logo.png",
  "Hummer": "hummer-logo.svg",
  "Hyundai": "hyundai-logo.svg",
  "Infiniti": "infiniti-logo.svg",
  "Isuzu": "isuzu-logo.svg",
  "JAC": "jac-logo.png",
  "Jaecoo": "jaecoo-logo.svg",
  "Jaguar": "jaguar-logo.svg",
  "Jeep": "jeep-logo.svg",
  "Jetour": "jetour-logo.svg",
  "Kia": "kia-logo.svg",
  "Koenigsegg": "koenigsegg-logo.svg",
  "Lada": "lada-logo.svg",
  "Lamborghini": "lamborghini-logo.png",
  "Lancia": "lancia-logo.png",
  "Land Rover": "land-rover-logo.svg",
  "Lexus": "lexus-logo.png",
  "Lincoln": "lincoln-logo.svg",
  "Lotus": "lotus-logo.svg",
  "Lucid": "lucid-logo.png",
  "MG": "mg-logo.png",
  "Mini": "mini-logo.svg",
  "Mahindra": "mahindra-logo.png",
  "Maruti Suzuki": "maruti-logo.svg",
  "Maserati": "maserati-logo.png",
  "Maybach": "maybach-logo.png",
  "Mazda": "mazda-logo.svg",
  "McLaren": "mclaren-logo.svg",
  "Mercedes-Benz": "mercedes-benz-logo.svg",
  "Mercury": "mercury-logo.png",
  "Mitsubishi": "mitsubishi-logo.svg",
  "Morgan": "morgan-logo.png",
  "NIO": "nio-logo.png",
  "Nissan": "nissan-logo.svg",
  "Noble": "noble-logo.png",
  "ORA": "ora-logo.png",
  "Oldsmobile": "oldsmobile-logo.png",
  "Omoda": "omoda-logo.png",
  "Opel": "opel-logo.svg",
  "Pagani": "pagani-logo.png",
  "Perodua": "perodua-logo.png",
  "Peugeot": "peugeot-logo.svg",
  "Pininfarina": "pininfarina-logo.png",
  "Plymouth": "plymouth-logo.png",
  "Polestar": "polestar-logo.png",
  "Pontiac": "pontiac-logo.png",
  "Porsche": "porsche-logo.svg",
  "Proton": "proton-logo.png",
  "Puma": "puma-logo.png",
  "RAM": "ram-logo.svg",
  "RUF": "ruf-logo.png",
  "Renault": "renault-logo.svg",
  "Rivian": "rivian-logo.svg",
  "Rolls-Royce": "rolls-royce-logo.svg",
  "SEAT": "seat-logo.svg",
  "Saab": "saab-logo.png",
  "Saleen": "saleen-logo.png",
  "Saturn": "saturn-logo.png",
  "Scion": "scion-logo.png",
  "Skoda": "skoda-logo.svg",
  "Smart": "smart-logo.png",
  "SsangYong": "ssangyong-logo.png",
  "Subaru": "subaru-logo.png",
  "Suzuki": "suzuki-logo.svg",
  "TVR": "tvr-logo.png",
  "Tata": "tata-logo.png",
  "Tesla": "tesla-logo.svg",
  "Toyota": "toyota-logo.svg",
  "UAZ": "uaz-logo.png",
  "Venturi": "venturi-logo.png",
  "VinFast": "vinfast-logo.png",
  "Volkswagen": "volkswagen-logo.svg",
  "Volvo": "volvo-logo.svg",
  "W Motors": "w-motors-logo.png",
  "Westfield": "westfield-logo.png",
  "Xpeng": "xpeng-logo.png",
  "Zeekr": "zeekr-logo.png",
  "Zenvo": "zenvo-logo.png",
  "Lynk & Co": "lynk-co-logo.svg",
  "Li Auto": "li-auto-logo.png",
  "Voyah": "voyah-logo.png",
  "Aion": "aion-logo.svg",
};

function getBrandLogo(name: string): string {
  const file = LOGO_MAP[name];
  if (file) return `${CDN}/${file}`;
  return "";
}

// Deduplicate brands
const uniqueBrands = [...new Set(ALL_CAR_BRANDS)];

export const CAR_BRANDS_WITH_SLUG = uniqueBrands.map((name) => ({
  name,
  slug: name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, ""),
  logo: getBrandLogo(name),
}));
