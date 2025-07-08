import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Home, 
  Trash2, 
  BarChart3, 
  MapPin, 
  Settings, 
  User, 
  Gift,
  FileText,
  History,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { rolePermissions } from "@/lib/data";

export default function MobileNav() {
  const { currentUser, currentRole } = useUser();
  const [, navigate] = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const permissions = rolePermissions[currentRole as keyof typeof rolePermissions];

  const allNavItems = [
    {
      name: "Dashboard",
      icon: Home,
      href: "/",
      permission: "canViewDashboard"
    },
    {
      name: "Pickup Requests",
      icon: Trash2,
      href: "/pickup-requests",
      permission: "canRequestPickup"
    },
    {
      name: "Pickup History",
      icon: History,
      href: "/pickup-history",
      permission: "canViewHistory"
    },
    {
      name: "Route Planner",
      icon: MapPin,
      href: "/route-planner",
      permission: "canPlanRoutes"
    },
    {
      name: "Recycling Metrics",
      icon: BarChart3,
      href: "/recycling-metrics",
      permission: "canViewMetrics"
    },
    {
      name: "Environmental Reports",
      icon: FileText,
      href: "/environmental-reports",
      permission: "canViewReports"
    },
    {
      name: "EcoRewards",
      icon: Gift,
      href: "/eco-rewards",
      permission: "canViewRewards"
    },
    {
      name: "Profile",
      icon: User,
      href: "/user-profile",
      permission: "canViewProfile"
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/user-settings",
      permission: "canViewSettings"
    }
  ];

  const availableNavItems = allNavItems.filter(item => 
    permissions[item.permission as keyof typeof permissions]
  );

  const primaryItems = availableNavItems.slice(0, 4);
  const secondaryItems = availableNavItems.slice(4);

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsExpanded(false);
  };

  return (
    <Card className="mb-4 lg:hidden">
      <CardContent className="p-3">
        {/* Primary Navigation - Always Visible */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant="ghost"
                className="h-auto py-3 px-2 flex-col space-y-1 mobile-touch-target"
                onClick={() => handleNavigation(item.href)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Expandable Secondary Navigation */}
        {secondaryItems.length > 0 && (
          <>
            <Button
              variant="outline"
              className="w-full mobile-touch-target"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="mr-2">More Options</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>

            {isExpanded && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {secondaryItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="h-auto py-3 px-2 flex-col space-y-1 mobile-touch-target"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{item.name}</span>
                    </Button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Role Badge */}
        <div className="mt-3 flex justify-center">
          <Badge variant="secondary" className="text-xs">
            {currentRole} Dashboard
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}