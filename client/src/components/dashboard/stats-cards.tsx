import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Scale, Sparkles, Users } from "lucide-react";

const stats = [
  {
    title: "Total Pickups This Month",
    value: "247",
    change: "+12% from last month",
    icon: Trash2,
    color: "green-light",
    iconColor: "text-green-primary"
  },
  {
    title: "Total Waste Diverted",
    value: "3,450 kg",
    change: "+8% from last month",
    icon: Scale,
    color: "green-light",
    iconColor: "text-green-primary"
  },
  {
    title: "Carbon Credits Earned",
    value: "156",
    change: "+15% from last month",
    icon: Sparkles,
    color: "green-light",
    iconColor: "text-green-primary"
  },
  {
    title: "Active Recyclers",
    value: "89",
    change: "+23% from last month",
    icon: Users,
    color: "green-light",
    iconColor: "text-green-primary"
  }
];

export default function StatsCards() {
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
