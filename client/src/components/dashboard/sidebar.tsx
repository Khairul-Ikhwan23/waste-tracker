import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  ClipboardList, 
  FileText, 
  Coins, 
  Settings, 
  Shield,
  X,
  Route,
  TrendingUp,
  Leaf,
  User,
  History,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const navigationItems = [
  { name: "Dashboard", icon: BarChart3, path: "/dashboard" },
  { name: "Pickup Requests", icon: ClipboardList, path: "/pickup-requests" },
  { name: "Route Planner", icon: Route, path: "/route-planner" },
  { name: "Recycling Metrics", icon: TrendingUp, path: "/recycling-metrics" },
  { name: "Environmental Reports", icon: Leaf, path: "/environmental-reports" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Pickup History", icon: History, path: "/pickup-history" },
  { name: "EcoRewards", icon: Gift, path: "/eco-rewards" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const [location, navigate] = useLocation();

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 green-primary">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-white">SBNone</h1>
            <p className="text-xs text-white opacity-90">Smart Waste</p>
          </div>
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-green-600 lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path || (location === "/" && item.path === "/dashboard");
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) onClose();
                }}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full text-left transition-colors",
                  isActive
                    ? "green-light text-green-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-green-primary"
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive
                      ? "text-green-primary"
                      : "text-gray-400 group-hover:text-green-primary"
                  )}
                />
                {item.name}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
