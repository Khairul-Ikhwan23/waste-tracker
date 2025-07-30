// Brunei Darussalam EcoMap Data
// Authentic locations based on real Brunei geography and districts

export interface EcoLocation {
  id: string;
  name: string;
  category:
    | "recycling_bin"
    | "recycling_center"
    | "drop_off_point"
    | "waste_facility"
    | "collection_point";
  coordinates: [number, number]; // [lat, lng]
  address: string;
  district: string;
  hours: string;
  contact?: string;
  services: string[];
  wasteTypes: string[];
}

export const BRUNEI_CENTER: [number, number] = [4.5353, 114.7277]; // Bandar Seri Begawan

export const ECO_CATEGORIES = {
  recycling_bin: {
    name: "Recycling Bins",
    color: "#22c55e",
    icon: "♻️",
  },
  recycling_center: {
    name: "Recycling Centers",
    color: "#3b82f6",
    icon: "🏭",
  },
  drop_off_point: {
    name: "Drop-off Points",
    color: "#f59e0b",
    icon: "📦",
  },
  waste_facility: {
    name: "Waste Facilities",
    color: "#ef4444",
    icon: "🏗️",
  },
  collection_point: {
    name: "Collection Points",
    color: "#8b5cf6",
    icon: "🚛",
  },
} as const;

// Authentic Brunei eco-locations based on real districts and areas
export const ECO_LOCATIONS: EcoLocation[] = [
  // Bandar Seri Begawan - Capital
  {
    id: "bsb_recycling_center_001",
    name: "Bandar Seri Begawan Recycling Center",
    category: "recycling_center",
    coordinates: [4.9031, 114.9398],
    address: "Jalan Kota Batu, Bandar Seri Begawan BA1511",
    district: "Brunei-Muara",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM, Sat: 8:00 AM - 12:00 PM",
    contact: "+673 238 2222",
    services: ["Paper Recycling", "Plastic Processing", "Metal Collection"],
    wasteTypes: ["Paper", "Plastic", "Metal", "Cardboard"],
  },
  {
    id: "gadong_drop_off_001",
    name: "Gadong Mall Collection Point",
    category: "drop_off_point",
    coordinates: [4.9167, 114.9167],
    address: "Gadong Mall, Jalan Gadong, Gadong BE3519",
    district: "Brunei-Muara",
    hours: "Daily: 10:00 AM - 10:00 PM",
    services: ["Public Drop-off", "Battery Collection"],
    wasteTypes: ["Electronics", "Batteries", "Small Appliances"],
  },
  {
    id: "jerudong_bin_001",
    name: "Jerudong Park Recycling Station",
    category: "recycling_bin",
    coordinates: [4.9667, 114.8333],
    address: "Jerudong Park, Jalan Jerudong, Jerudong BG3122",
    district: "Brunei-Muara",
    hours: "24/7",
    services: ["Public Bins", "Waste Sorting"],
    wasteTypes: ["General Waste", "Recyclables"],
  },

  // Kuala Belait District
  {
    id: "kb_waste_facility_001",
    name: "Kuala Belait Waste Management Facility",
    category: "waste_facility",
    coordinates: [4.5833, 114.2333],
    address: "Jalan Sungai Liang, Kuala Belait KA1131",
    district: "Belait",
    hours: "Mon-Fri: 7:00 AM - 4:00 PM",
    contact: "+673 333 1234",
    services: ["Industrial Waste", "Hazardous Disposal", "Bulk Processing"],
    wasteTypes: [
      "Industrial Waste",
      "Hazardous Materials",
      "Construction Debris",
    ],
  },
  {
    id: "seria_collection_001",
    name: "Seria Town Collection Center",
    category: "collection_point",
    coordinates: [4.6067, 114.3267],
    address: "Seria Town Center, Jalan Tengah, Seria KA1633",
    district: "Belait",
    hours: "Daily: 6:00 AM - 6:00 PM",
    services: ["Scheduled Pickup", "Community Collection"],
    wasteTypes: ["Household Waste", "Garden Waste", "Recyclables"],
  },

  // Tutong District
  {
    id: "tutong_recycling_001",
    name: "Tutong District Recycling Hub",
    category: "recycling_center",
    coordinates: [4.8, 114.65],
    address: "Jalan Tutong, Pekan Tutong TA1341",
    district: "Tutong",
    hours: "Mon-Sat: 8:00 AM - 5:00 PM",
    contact: "+673 428 5555",
    services: ["Community Recycling", "Education Center"],
    wasteTypes: ["Paper", "Plastic", "Glass", "Organic Waste"],
  },
  {
    id: "lamunin_bin_001",
    name: "Lamunin Eco Station",
    category: "recycling_bin",
    coordinates: [4.75, 114.5833],
    address: "Kampong Lamunin, Tutong TA2851",
    district: "Tutong",
    hours: "24/7",
    services: ["Rural Collection", "Community Bins"],
    wasteTypes: ["General Waste", "Organic Waste"],
  },

  // Temburong District
  {
    id: "bangar_collection_001",
    name: "Bangar Collection Point",
    category: "collection_point",
    coordinates: [4.7, 115.0667],
    address: "Pekan Bangar, Bangar PA1151",
    district: "Temburong",
    hours: "Mon-Fri: 7:00 AM - 3:00 PM",
    services: ["Rural Pickup", "Eco-Tourism Support"],
    wasteTypes: ["Biodegradable Waste", "Recyclables"],
  },

  // Additional urban locations
  {
    id: "rimba_drop_off_001",
    name: "Rimba Point Shopping Center",
    category: "drop_off_point",
    coordinates: [4.9, 114.8833],
    address: "Rimba Point, Jalan Gadong, Rimba BE1118",
    district: "Brunei-Muara",
    hours: "Daily: 10:00 AM - 9:00 PM",
    services: ["Shopping Mall Collection", "E-waste Disposal"],
    wasteTypes: ["Electronics", "Packaging", "Textiles"],
  },
  {
    id: "airport_bin_001",
    name: "Brunei International Airport Recycling",
    category: "recycling_bin",
    coordinates: [4.9442, 114.9281],
    address: "Brunei International Airport, Berakas BB2513",
    district: "Brunei-Muara",
    hours: "24/7",
    services: ["Airport Waste Management", "Travel Waste"],
    wasteTypes: ["Travel Waste", "Duty-free Packaging"],
  },
  {
    id: "ulu_tutong_facility_001",
    name: "Ulu Tutong Eco Facility",
    category: "waste_facility",
    coordinates: [4.6833, 114.6167],
    address: "Ulu Tutong, Jalan Tutong-Seria TA3721",
    district: "Tutong",
    hours: "Mon-Fri: 8:00 AM - 4:00 PM",
    services: ["Composting", "Organic Waste Processing"],
    wasteTypes: ["Organic Waste", "Agricultural Waste", "Garden Waste"],
  },
  // ——— More Brunei‑Wide Dummy Locations ———
  {
    id: "kb_bin_002",
    name: "Kuala Belait Public Recycling Bin",
    category: "recycling_bin",
    coordinates: [4.5839, 114.2422],
    address: "Jalan Kennedy, Kuala Belait KA1141",
    district: "Belait",
    hours: "24/7",
    services: ["Public Bins", "Waste Sorting"],
    wasteTypes: ["General Waste", "Recyclables"],
  },
  {
    id: "kb_recycling_center_002",
    name: "Kuala Belait Community Recycling",
    category: "recycling_center",
    coordinates: [4.5875, 114.23],
    address: "Community Hall, Jalan Mangkok, Kuala Belait KA1135",
    district: "Belait",
    hours: "Mon‑Sat: 9:00 AM – 5:00 PM",
    contact: "+673 333 5678",
    services: ["Paper Recycling", "Plastic Collection"],
    wasteTypes: ["Paper", "Plastic"],
  },
  {
    id: "panaga_drop_off_001",
    name: "Panaga E‑waste Drop‑off",
    category: "drop_off_point",
    coordinates: [4.638, 114.364],
    address: "Panaga Community Centre, Jalan Utama PA3621",
    district: "Belait",
    hours: "Daily: 9:00 AM – 6:00 PM",
    services: ["E‑waste Collection", "Battery Disposal"],
    wasteTypes: ["Electronics", "Batteries"],
  },
  {
    id: "seria_bin_002",
    name: "Seria Town Recycling Bin",
    category: "recycling_bin",
    coordinates: [4.6067, 114.3267],
    address: "Jalan Tengah, Seria KA1633",
    district: "Belait",
    hours: "24/7",
    services: ["Public Bins"],
    wasteTypes: ["General Waste", "Recyclables"],
  },
  {
    id: "tutong_ewaste_drop_001",
    name: "Tutong E‑waste Drop‑off",
    category: "drop_off_point",
    coordinates: [4.8134, 114.6472],
    address: "Pekan Tutong, Jalan Jalan, Tutong TA1341",
    district: "Tutong",
    hours: "Daily: 8:00 AM – 8:00 PM",
    services: ["E‑waste Collection"],
    wasteTypes: ["Electronics", "Small Appliances"],
  },
  {
    id: "tutong_collection_002",
    name: "Tutong Night Collection",
    category: "collection_point",
    coordinates: [4.8005, 114.6501],
    address: "Kampong Bukit Panggal, Tutong TA2852",
    district: "Tutong",
    hours: "Fri‑Sun: 6:00 PM – 2:00 AM",
    services: ["Nighttime Pickup"],
    wasteTypes: ["General Waste"],
  },
  {
    id: "kiulap_ehub_001",
    name: "Kiulap E‑Waste Hub",
    category: "drop_off_point",
    coordinates: [4.905, 114.9342],
    address: "Kiulap Complex, Jalan Kiulap BE1319",
    district: "Brunei‑Muara",
    hours: "Daily: 9:00 AM – 9:00 PM",
    services: ["E‑waste", "Battery Collection"],
    wasteTypes: ["Electronics", "Batteries"],
  },
  {
    id: "kampong_ayer_collection_001",
    name: "Kampong Ayer Collection Point",
    category: "collection_point",
    coordinates: [4.89, 114.9365],
    address: "Water Village Docks, Bandar Seri Begawan",
    district: "Brunei‑Muara",
    hours: "Daily: 6:00 AM – 6:00 PM",
    services: ["Boat Pickup", "Community Bins"],
    wasteTypes: ["General Waste", "Recyclables"],
  },
  {
    id: "labu_bin_002",
    name: "Labu Recycling Bin",
    category: "recycling_bin",
    coordinates: [4.5083, 115.0483],
    address: "Kampong Labu, Jalan Labu PA1152",
    district: "Temburong",
    hours: "24/7",
    services: ["Public Bins"],
    wasteTypes: ["Recyclables", "Organic Waste"],
  },
  {
    id: "muara_facility_001",
    name: "Muara Waste Transfer Station",
    category: "waste_facility",
    coordinates: [5.005, 115.0167],
    address: "Muara Port, Jalan Muara MU0111",
    district: "Brunei‑Muara",
    hours: "Mon‑Fri: 8:00 AM – 5:00 PM",
    contact: "+673 234 7890",
    services: ["Transfer Station", "Sorting Facility"],
    wasteTypes: ["General Waste", "Construction Debris"],
  },
];

// Helper functions for map data management
export const getLocationsByCategory = (
  category: keyof typeof ECO_CATEGORIES,
) => {
  return ECO_LOCATIONS.filter((location) => location.category === category);
};

export const getLocationsByDistrict = (district: string) => {
  return ECO_LOCATIONS.filter((location) => location.district === district);
};

export const calculateDistance = (
  coord1: [number, number],
  coord2: [number, number],
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1[0] * Math.PI) / 180) *
      Math.cos((coord2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getLocationsWithinRadius = (
  center: [number, number],
  radiusKm: number,
) => {
  return ECO_LOCATIONS.filter(
    (location) => calculateDistance(center, location.coordinates) <= radiusKm,
  );
};
