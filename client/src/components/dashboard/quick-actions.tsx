import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Coins, Truck, BarChart3, Route } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "wouter";

export default function QuickActions() {
  const { currentUser } = useUser();
  const [, navigate] = useLocation();

  // Define actions based on user role
  const getQuickActions = () => {
    const baseActions = [
      {
        title: "Schedule Pickup",
        icon: Plus,
        color: "green-primary hover:bg-green-600",
        textColor: "text-white",
        path: "/pickup-requests",
        roles: ["Household", "Business", "Waste Operator", "Admin"]
      },
      {
        title: "Check Rewards",
        icon: Coins,
        color: "bg-purple-600 hover:bg-purple-700",
        textColor: "text-white",
        path: "/eco-rewards",
        roles: ["Household", "Business", "Waste Operator", "Admin"]
      }
    ];

    // Add role-specific actions
    const roleSpecificActions = [];

    if (currentUser.role === "Business" || currentUser.role === "Admin") {
      roleSpecificActions.push({
        title: "View Reports",
        icon: FileText,
        color: "bg-blue-600 hover:bg-blue-700",
        textColor: "text-white",
        path: "/environmental-reports",
        roles: ["Business", "Admin"]
      });
    }

    if (currentUser.role === "Waste Operator" || currentUser.role === "Admin") {
      roleSpecificActions.push({
        title: "Route Planner",
        icon: Route,
        color: "bg-orange-600 hover:bg-orange-700",
        textColor: "text-white",
        path: "/route-planner",
        roles: ["Waste Operator", "Admin"]
      });
    }

    if (currentUser.role === "Admin") {
      roleSpecificActions.push({
        title: "Analytics",
        icon: BarChart3,
        color: "bg-indigo-600 hover:bg-indigo-700",
        textColor: "text-white",
        path: "/recycling-metrics",
        roles: ["Admin"]
      });
    }

    return [...baseActions, ...roleSpecificActions].filter(action => 
      action.roles.includes(currentUser.role)
    );
  };

  const quickActions = getQuickActions();

  return (
    <Card className="border border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-1 ${quickActions.length === 2 ? 'md:grid-cols-2' : quickActions.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-4`}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                onClick={() => navigate(action.path)}
                className={`p-4 ${action.color} ${action.textColor} rounded-lg transition-colors duration-200 flex items-center justify-center h-12`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {action.title}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
