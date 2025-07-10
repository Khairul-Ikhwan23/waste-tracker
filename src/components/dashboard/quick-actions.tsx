import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Coins } from "lucide-react";

const quickActions = [
  {
    title: "Schedule Pickup",
    icon: Plus,
    color: "green-primary hover:bg-green-600",
    textColor: "text-white"
  },
  {
    title: "View Reports",
    icon: FileText,
    color: "bg-blue-600 hover:bg-blue-700",
    textColor: "text-white"
  },
  {
    title: "Check Rewards",
    icon: Coins,
    color: "bg-purple-600 hover:bg-purple-700",
    textColor: "text-white"
  }
];

export default function QuickActions() {
  return (
    <Card className="border border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
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
