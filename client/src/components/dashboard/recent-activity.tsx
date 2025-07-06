import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Plus, AlertTriangle } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Pickup completed at Green Valley Apartments",
    time: "2 hours ago",
    type: "success",
    icon: CheckCircle,
    iconColor: "text-green-primary",
    bgColor: "green-light"
  },
  {
    id: 2,
    title: "New pickup request submitted",
    time: "4 hours ago",
    type: "info",
    icon: Plus,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 3,
    title: "Recycling target 85% achieved",
    time: "6 hours ago",
    type: "warning",
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-100"
  }
];

export default function RecentActivity() {
  return (
    <Card className="border border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`p-2 ${activity.bgColor} rounded-full`}>
                    <Icon className={`w-4 h-4 ${activity.iconColor}`} />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
