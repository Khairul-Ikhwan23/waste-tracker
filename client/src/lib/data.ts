// Brunei-specific dummy data for Smart Waste Management dashboard

export const BRUNEI_DISTRICTS = [
  'Brunei-Muara',
  'Belait',
  'Tutong',
  'Temburong'
];

export const BRUNEI_LOCATIONS = [
  'Kiulap',
  'Gadong',
  'Jerudong',
  'Seria',
  'Rimba',
  'Kg Ayer',
  'Bandar Seri Begawan',
  'Kuala Belait',
  'Tutong Town',
  'Bangar'
];

export const WASTE_TYPES = [
  'MSW (Municipal Solid Waste)',
  'Recyclables',
  'Bulky Waste',
  'Food Waste',
  'Electronic Waste',
  'Hazardous Waste'
];

export const USER_TYPES = [
  'Household',
  'Business',
  'Waste Operator',
  'Admin'
];

export interface PickupRequest {
  id: string;
  name: string;
  address: string;
  wasteType: string;
  date: string;
  time: string;
  zone: string;
  district: string;
  status: 'pending' | 'scheduled' | 'completed';
  volume?: number;
}

export interface User {
  id: string;
  name: string;
  type: 'Household' | 'Business' | 'Waste Operator';
  district: string;
  wasteGenerated: number;
  recyclingRate: number;
}

export interface WasteMetric {
  id: string;
  user: string;
  userType: 'Household' | 'Business' | 'Waste Operator';
  wasteType: string;
  volume: number;
  district: string;
  recycled: boolean;
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'alert' | 'info';
  timestamp: string;
  read: boolean;
}

// Sample pickup requests data
export const samplePickupRequests: PickupRequest[] = [
  {
    id: '1',
    name: 'Ahmad Rahman',
    address: 'Kiulap Plaza, Brunei-Muara',
    wasteType: 'MSW (Municipal Solid Waste)',
    date: '2025-01-09',
    time: '10:00',
    zone: 'KB-01',
    district: 'Brunei-Muara',
    status: 'scheduled',
    volume: 25
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    address: 'Gadong Central, Brunei-Muara',
    wasteType: 'Recyclables',
    date: '2025-01-09',
    time: '14:00',
    zone: 'KB-02',
    district: 'Brunei-Muara',
    status: 'scheduled',
    volume: 15
  },
  {
    id: '3',
    name: 'Mohd Hafiz',
    address: 'Jerudong Park, Brunei-Muara',
    wasteType: 'Bulky Waste',
    date: '2025-01-10',
    time: '09:00',
    zone: 'KB-03',
    district: 'Brunei-Muara',
    status: 'pending',
    volume: 50
  },
  {
    id: '4',
    name: 'Fatimah Binti Abdullah',
    address: 'Seria Town, Belait',
    wasteType: 'Food Waste',
    date: '2025-01-10',
    time: '16:00',
    zone: 'BL-01',
    district: 'Belait',
    status: 'scheduled',
    volume: 20
  },
  {
    id: '5',
    name: 'Haji Sulaiman',
    address: 'Rimba Garden, Brunei-Muara',
    wasteType: 'Electronic Waste',
    date: '2025-01-11',
    time: '11:00',
    zone: 'KB-04',
    district: 'Brunei-Muara',
    status: 'pending',
    volume: 10
  },
  {
    id: '6',
    name: 'Dayang Hajah Zainab',
    address: 'Kg Ayer, Brunei-Muara',
    wasteType: 'Recyclables',
    date: '2025-01-11',
    time: '15:00',
    zone: 'KB-05',
    district: 'Brunei-Muara',
    status: 'completed',
    volume: 18
  }
];

// Sample users data
export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Ahmad Rahman',
    type: 'Household',
    district: 'Brunei-Muara',
    wasteGenerated: 150,
    recyclingRate: 65
  },
  {
    id: '2',
    name: 'Kiulap Mall',
    type: 'Business',
    district: 'Brunei-Muara',
    wasteGenerated: 1200,
    recyclingRate: 78
  },
  {
    id: '3',
    name: 'Green Waste Solutions',
    type: 'Waste Operator',
    district: 'Belait',
    wasteGenerated: 0,
    recyclingRate: 95
  }
];

// Sample waste metrics data
export const sampleWasteMetrics: WasteMetric[] = [
  {
    id: '1',
    user: 'Ahmad Rahman',
    userType: 'Household',
    wasteType: 'MSW (Municipal Solid Waste)',
    volume: 25,
    district: 'Brunei-Muara',
    recycled: false,
    date: '2025-01-08'
  },
  {
    id: '2',
    user: 'Kiulap Mall',
    userType: 'Business',
    wasteType: 'Recyclables',
    volume: 180,
    district: 'Brunei-Muara',
    recycled: true,
    date: '2025-01-08'
  },
  {
    id: '3',
    user: 'Siti Nurhaliza',
    userType: 'Household',
    wasteType: 'Food Waste',
    volume: 12,
    district: 'Brunei-Muara',
    recycled: true,
    date: '2025-01-08'
  },
  {
    id: '4',
    user: 'Seria Shopping Center',
    userType: 'Business',
    wasteType: 'Electronic Waste',
    volume: 45,
    district: 'Belait',
    recycled: true,
    date: '2025-01-07'
  },
  {
    id: '5',
    user: 'Mohd Hafiz',
    userType: 'Household',
    wasteType: 'Bulky Waste',
    volume: 50,
    district: 'Brunei-Muara',
    recycled: false,
    date: '2025-01-07'
  }
];

// Sample notifications data
export const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Pickup Reminder',
    message: 'Reminder: Pickup in Gadong tomorrow at 10 AM',
    type: 'reminder',
    timestamp: '2025-01-08T18:00:00Z',
    read: false
  },
  {
    id: '2',
    title: 'Community Event',
    message: 'Community cleanup in Kg Ayer this weekend',
    type: 'info',
    timestamp: '2025-01-08T15:30:00Z',
    read: false
  },
  {
    id: '3',
    title: 'Recycling Target',
    message: 'Great job! Your recycling rate increased to 78%',
    type: 'alert',
    timestamp: '2025-01-08T12:00:00Z',
    read: true
  }
];

// Dashboard statistics
export const dashboardStats = {
  totalPickups: samplePickupRequests.length,
  wasteDiverted: sampleWasteMetrics.reduce((sum, metric) => sum + metric.volume, 0),
  recyclingRate: Math.round(
    (sampleWasteMetrics.filter(m => m.recycled).length / sampleWasteMetrics.length) * 100
  ),
  carbonImpact: Math.round(
    sampleWasteMetrics.filter(m => m.recycled).reduce((sum, metric) => sum + metric.volume, 0) * 0.5
  )
};

// Waste breakdown for chart
export const wasteBreakdown = WASTE_TYPES.map(type => ({
  name: type.replace(' (Municipal Solid Waste)', ''),
  value: sampleWasteMetrics
    .filter(m => m.wasteType === type)
    .reduce((sum, metric) => sum + metric.volume, 0),
  color: type === 'MSW (Municipal Solid Waste)' ? '#43A047' :
         type === 'Recyclables' ? '#66BB6A' :
         type === 'Food Waste' ? '#A5D6A7' :
         type === 'Bulky Waste' ? '#C8E6C9' :
         type === 'Electronic Waste' ? '#E8F5E8' : '#F1F8E9'
}));

// Environmental impact data
export const environmentalData = {
  carbonSaved: dashboardStats.carbonImpact,
  landfillDiverted: dashboardStats.wasteDiverted,
  recyclingEfficiency: dashboardStats.recyclingRate,
  monthlyTrends: [
    { month: 'Nov', recycled: 245, total: 380 },
    { month: 'Dec', recycled: 289, total: 420 },
    { month: 'Jan', recycled: 312, total: 450 }
  ]
};

// User Profile and Role Management
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'Household' | 'Business' | 'Waste Operator' | 'Admin';
  avatar: string;
  preferredWasteTypes: string[];
  binOwnership: string[];
  ecoPoints: number;
  notifications: boolean;
  rewardOptIn: boolean;
}

export interface PickupHistory {
  id: string;
  date: string;
  wasteType: string;
  status: 'Completed' | 'Missed' | 'Scheduled';
  volume: number;
  carbonSaved: number;
  location: string;
}

export interface PaymentRecord {
  id: string;
  amount: string;
  date: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  type: 'pickup' | 'subscription' | 'penalty' | 'refund';
  method: 'card' | 'bank_transfer' | 'cash' | 'digital_wallet';
  reference: string;
  dueDate: string | null;
  createdAt: string;
}

export interface EcoReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  available: boolean;
  icon: string;
}

// Default user profiles for each role
export const defaultUserProfiles: Record<string, UserProfile> = {
  Household: {
    id: '1',
    name: 'Ahmad Rahman',
    email: 'ahmad.rahman@email.com',
    phone: '+673 888 1234',
    address: 'Kiulap Plaza, Brunei-Muara',
    role: 'Household',
    avatar: '👨‍👩‍👧‍👦',
    preferredWasteTypes: ['MSW (Municipal Solid Waste)', 'Recyclables'],
    binOwnership: ['240L MSW', 'Recyclables'],
    ecoPoints: 245,
    notifications: true,
    rewardOptIn: true
  },
  Business: {
    id: '2',
    name: 'Kiulap Mart (Siti Nurhaliza)',
    email: 'siti@kiulapmart.com',
    phone: '+673 888 5678',
    address: 'Gadong Central, Brunei-Muara',
    role: 'Business',
    avatar: '🏪',
    preferredWasteTypes: ['MSW (Municipal Solid Waste)', 'Recyclables', 'Electronic Waste'],
    binOwnership: ['1100L MSW', '660L Recyclables', 'Electronic Waste Container'],
    ecoPoints: 890,
    notifications: true,
    rewardOptIn: true
  },
  'Waste Operator': {
    id: '3',
    name: 'Mohd Hafiz',
    email: 'hafiz@greenwaste.bn',
    phone: '+673 888 9012',
    address: 'Seria Industrial Area, Belait',
    role: 'Waste Operator',
    avatar: '🚛',
    preferredWasteTypes: ['All Types'],
    binOwnership: ['Collection Vehicle', 'Sorting Equipment'],
    ecoPoints: 0,
    notifications: true,
    rewardOptIn: false
  },
  Admin: {
    id: '4',
    name: 'Dayang Hajah Zainab',
    email: 'admin@sbnone.gov.bn',
    phone: '+673 888 3456',
    address: 'Government Complex, Bandar Seri Begawan',
    role: 'Admin',
    avatar: '👩‍💼',
    preferredWasteTypes: ['All Types'],
    binOwnership: ['System Access'],
    ecoPoints: 0,
    notifications: true,
    rewardOptIn: false
  }
};

// Sample pickup history data
export const samplePickupHistory: PickupHistory[] = [
  {
    id: '1',
    date: '2025-01-08',
    wasteType: 'MSW (Municipal Solid Waste)',
    status: 'Completed',
    volume: 25,
    carbonSaved: 5.2,
    location: 'Kiulap Plaza'
  },
  {
    id: '2',
    date: '2025-01-06',
    wasteType: 'Recyclables',
    status: 'Completed',
    volume: 15,
    carbonSaved: 8.5,
    location: 'Kiulap Plaza'
  },
  {
    id: '3',
    date: '2025-01-04',
    wasteType: 'Food Waste',
    status: 'Completed',
    volume: 12,
    carbonSaved: 3.8,
    location: 'Kiulap Plaza'
  },
  {
    id: '4',
    date: '2025-01-02',
    wasteType: 'MSW (Municipal Solid Waste)',
    status: 'Missed',
    volume: 0,
    carbonSaved: 0,
    location: 'Kiulap Plaza'
  },
  {
    id: '5',
    date: '2025-01-10',
    wasteType: 'Recyclables',
    status: 'Scheduled',
    volume: 20,
    carbonSaved: 0,
    location: 'Kiulap Plaza'
  }
];

// Sample payment records
export const samplePaymentRecords: PaymentRecord[] = [
  {
    id: '1',
    amount: '125.50',
    date: '2025-01-15',
    description: 'Monthly waste collection service',
    status: 'completed',
    type: 'subscription',
    method: 'card',
    reference: 'TXN001234',
    dueDate: '2025-01-15',
    createdAt: '2025-01-15T08:30:00Z'
  },
  {
    id: '2',
    amount: '75.00',
    date: '2025-01-12',
    description: 'Recycling bonus payment',
    status: 'pending',
    type: 'refund',
    method: 'bank_transfer',
    reference: 'REF567890',
    dueDate: '2025-01-20',
    createdAt: '2025-01-12T14:20:00Z'
  },
  {
    id: '3',
    amount: '200.00',
    date: '2025-01-10',
    description: 'Bulk waste disposal fee',
    status: 'completed',
    type: 'pickup',
    method: 'digital_wallet',
    reference: 'TXN002468',
    dueDate: '2025-01-10',
    createdAt: '2025-01-10T16:45:00Z'
  },
  {
    id: '4',
    amount: '45.25',
    date: '2025-01-08',
    description: 'Electronic waste processing',
    status: 'failed',
    type: 'pickup',
    method: 'card',
    reference: 'TXN003691',
    dueDate: '2025-01-08',
    createdAt: '2025-01-08T10:15:00Z'
  },
  {
    id: '5',
    amount: '90.00',
    date: '2025-01-05',
    description: 'Commercial waste pickup',
    status: 'completed',
    type: 'pickup',
    method: 'cash',
    reference: 'TXN004820',
    dueDate: '2025-01-05',
    createdAt: '2025-01-05T12:00:00Z'
  },
  {
    id: '6',
    amount: '50.00',
    date: '2025-01-03',
    description: 'Late payment penalty',
    status: 'pending',
    type: 'penalty',
    method: 'card',
    reference: 'PEN001234',
    dueDate: '2025-01-25',
    createdAt: '2025-01-03T09:30:00Z'
  },
  {
    id: '7',
    amount: '180.00',
    date: '2025-01-01',
    description: 'Quarterly subscription fee',
    status: 'completed',
    type: 'subscription',
    method: 'bank_transfer',
    reference: 'SUB987654',
    dueDate: '2025-01-01',
    createdAt: '2025-01-01T00:01:00Z'
  },
  {
    id: '8',
    amount: '25.00',
    date: '2024-12-28',
    description: 'Express pickup service',
    status: 'cancelled',
    type: 'pickup',
    method: 'digital_wallet',
    reference: 'EXP147258',
    dueDate: '2024-12-28',
    createdAt: '2024-12-28T11:20:00Z'
  }
];

// Sample eco rewards
export const sampleEcoRewards: EcoReward[] = [
  {
    id: '1',
    title: '10% Discount at EcoMart',
    description: 'Save on eco-friendly products at participating EcoMart stores',
    pointsCost: 100,
    category: 'Shopping',
    available: true,
    icon: '🛒'
  },
  {
    id: '2',
    title: '$5 Voucher at Gadong Cafe',
    description: 'Enjoy a discount on food and beverages',
    pointsCost: 150,
    category: 'Food & Beverage',
    available: true,
    icon: '☕'
  },
  {
    id: '3',
    title: 'Free Movie Ticket',
    description: 'Complimentary movie ticket at Times Cinema',
    pointsCost: 300,
    category: 'Entertainment',
    available: true,
    icon: '🎬'
  },
  {
    id: '4',
    title: 'Eco-Friendly Tote Bag',
    description: 'Reusable shopping bag made from recycled materials',
    pointsCost: 200,
    category: 'Merchandise',
    available: false,
    icon: '👜'
  },
  {
    id: '5',
    title: 'Plant a Tree Certificate',
    description: 'Sponsor a tree planting in Brunei forest reserve',
    pointsCost: 500,
    category: 'Environmental',
    available: true,
    icon: '🌱'
  }
];

// Leaderboard data
export const ecoLeaderboard = [
  { rank: 1, name: 'Kiulap Mart (Siti Nurhaliza)', points: 890, role: 'Business' },
  { rank: 2, name: 'Ahmad Rahman', points: 245, role: 'Household' },
  { rank: 3, name: 'Haji Sulaiman', points: 189, role: 'Household' },
  { rank: 4, name: 'Green Solutions Ltd', points: 156, role: 'Business' },
  { rank: 5, name: 'Fatimah Abdullah', points: 134, role: 'Household' }
];

// Role-based navigation permissions
export const rolePermissions = {
  Household: {
    canAccess: ['dashboard', 'profile', 'pickup-requests', 'pickup-history', 'eco-rewards', 'payments', 'settings'],
    canViewOthers: false,
    canSchedule: true,
    canViewRoutes: false,
    canManageUsers: false,
    canViewMetrics: false,
    dashboardStats: ['totalPickups', 'carbonSaved', 'ecoPoints']
  },
  Business: {
    canAccess: ['dashboard', 'profile', 'pickup-requests', 'pickup-history', 'eco-rewards', 'recycling-metrics', 'environmental-reports', 'payments', 'settings'],
    canViewOthers: false,
    canSchedule: true,
    canViewRoutes: false,
    canManageUsers: false,
    canViewMetrics: true,
    dashboardStats: ['recyclingRate', 'pickupVolume', 'impactReport', 'csrPoints']
  },
  'Waste Operator': {
    canAccess: ['dashboard', 'route-planner', 'pickup-requests', 'environmental-reports', 'payments', 'settings'],
    canViewOthers: false,
    canSchedule: false,
    canViewRoutes: true,
    canManageUsers: false,
    canViewMetrics: false,
    dashboardStats: ['todaysPickups', 'routeList', 'completedPickups']
  },
  Admin: {
    canAccess: ['dashboard', 'profile', 'pickup-requests', 'pickup-history', 'eco-rewards', 'recycling-metrics', 'environmental-reports', 'route-planner', 'payments', 'settings'],
    canViewOthers: true,
    canSchedule: true,
    canViewRoutes: true,
    canManageUsers: true,
    canViewMetrics: true,
    dashboardStats: ['allUsers', 'systemMetrics', 'totalImpact', 'platformStats']
  }
};

// Role-specific dashboard data
export const roleDashboardData = {
  Household: {
    totalPickups: 12,
    carbonSaved: 45.2,
    ecoPoints: 245,
    nextPickup: '2025-01-10',
    binStatus: 'Ready for collection'
  },
  Business: {
    recyclingRate: 78,
    pickupVolume: 1250,
    impactReport: 'Excellent',
    csrPoints: 890,
    monthlyTrend: '+12%',
    sustainabilityScore: 'A+'
  },
  'Waste Operator': {
    todaysPickups: 24,
    routeList: ['Kiulap Area', 'Gadong Central', 'Jerudong'],
    completedPickups: 18,
    pendingPickups: 6,
    currentLocation: 'Kiulap Plaza',
    vehicleStatus: 'Active'
  },
  Admin: {
    allUsers: 1247,
    systemMetrics: 'Good',
    totalImpact: '12.8 tons CO₂',
    platformStats: '94% uptime',
    activeOperators: 8,
    monthlyGrowth: '+5.2%'
  }
};