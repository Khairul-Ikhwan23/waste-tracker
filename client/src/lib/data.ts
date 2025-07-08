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
  'Waste Operator'
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