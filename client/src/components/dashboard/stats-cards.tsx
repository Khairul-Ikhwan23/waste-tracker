import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Scale, Sparkles, Users, Truck, BarChart3, Leaf, Gift, Building, TrendingUp } from "lucide-react";
import { dashboardStats, roleDashboardData } from "@/lib/data";
import { useUser } from "@/contexts/UserContext";

const getRoleStats = (role: string, roleData: any) => {
  switch (role) {
    case 'Household':
      return [
        {
          title: "Total Pickups",
          value: roleData.totalPickups.toString(),
          change: "This month",
          icon: Trash2,
          color: "green-light",
          iconColor: "text-green-primary"
        },
        {
          title: "CO₂ Saved",
          value: `${roleData.carbonSaved} kg`,
          change: "Environmental impact",
          icon: Leaf,
          color: "green-light",
          iconColor: "text-green-primary"
        },
        {
          title: "EcoPoints",
          value: roleData.ecoPoints.toString(),
          change: "Reward balance",
          icon: Gift,
          color: "green-light",
          iconColor: "text-green-primary"
        },
        {
          title: "Next Pickup",
          value: roleData.nextPickup,
          change: roleData.binStatus,
          icon: Scale,
          color: "green-light",
          iconColor: "text-green-primary"
        }
      ];
    case 'Business':
      return [
        {
          title: "Recycling Rate",
          value: `${roleData.recyclingRate}%`,
          change: `${roleData.monthlyTrend} this month`,
          icon: TrendingUp,
          color: "green-light",
          iconColor: "text-green-primary"
        },
        {
          title: "Pickup Volume",
          value: `${roleData.pickupVolume} kg`,
          change: "This month",
          icon: Scale,
          color: "green-light",
          iconColor: "text-green-primary"
        },
        {
          title: "CSR Points",
          value: roleData.csrPoints.toString(),
          change: "Corporate rewards",
          icon: Gift,
          color: "green-light",
          iconColor: "text-green-primary"
        },
        {
          title: "Impact Report",
          value: roleData.impactReport,
          change: `Grade: ${roleData.sustainabilityScore}`,
          icon: BarChart3,
          color: "green-light",
          iconColor: "text-green-primary"
        }
      ];
    case 'Waste Operator':
      return [
        {
          title: "Today's Pickups",
          value: roleData.todaysPickups.toString(),
          change: "Total scheduled",
          icon: Truck,
          color: "green-light",
          iconColor: "text-green-primary"
        },
        {
          title: "Completed",
          value: roleData.completedPickups.toString(),
          change: "Successfully processed",
          icon: Sparkles,
          color: "green-light",
          iconColor: "text-green-primary"
        },
        {
          title: "Pending",
          value: roleData.pendingPickups.toString(),
          change: "Awaiting collection",
          icon: Trash2,
          color: "green-light",
          iconColor: "text-green-primary"
        },
        {
          title: "Vehicle Status",
          value: roleData.vehicleStatus,
          change: `Location: ${roleData.currentLocation}`,
          icon: Users,
          color: "green-light",
          iconColor: "text-green-primary"
        }
      ];
    case 'Admin':
      return [
        {
          title: "Total Users",
          value: roleData.allUsers.toString(),
          change: `${roleData.monthlyGrowth} growth`,
          icon: Users,
          color: "green-light",
          iconColor: "text-green-primary"
        },
        {
          title: "System Status",
          value: roleData.systemMetrics,
          change: `${roleData.platformStats} uptime`,
          icon: BarChart3,
          color: "green-light",
          iconColor: "text-green-primary"
        },
        {
          title: "Total Impact",
          value: roleData.totalImpact,
          change: "Carbon savings",
          icon: Leaf,
          color: "green-light",
          iconColor: "text-green-primary"
        },
        {
          title: "Active Operators",
          value: roleData.activeOperators.toString(),
          change: "Currently working",
          icon: Truck,
          color: "green-light",
          iconColor: "text-green-primary"
        }
      ];
    default:
      return [];
  }
};

export default function StatsCards() {
  const { currentUser } = useUser();
  const roleData = roleDashboardData[currentUser.role as keyof typeof roleDashboardData];
  const stats = getRoleStats(currentUser.role, roleData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 ${stat.color} rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-primary font-medium">{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
