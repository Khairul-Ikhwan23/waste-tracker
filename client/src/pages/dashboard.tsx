import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/contexts/UserContext";
import Sidebar from "@/components/dashboard/sidebar";
import StatsCards from "@/components/dashboard/stats-cards";
import WasteChart from "@/components/dashboard/waste-chart";
import RecentActivity from "@/components/dashboard/recent-activity";
import QuickActions from "@/components/dashboard/quick-actions";
import NotificationDropdown from "@/components/dashboard/notification-dropdown";
import RoleSwitcher from "@/components/dashboard/role-switcher";
import OperatorPickupStatus from "@/components/dashboard/operator-pickup-status";

import { Button } from "@/components/ui/button";
import { Plus, Menu, X } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [, navigate] = useLocation();
  const { currentUser } = useUser();

  const toggleMobileMenu = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMobileMenu}
            className="bg-white shadow-md"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between min-h-16 py-2 sm:py-0">
              <div className="flex items-center flex-1 min-w-0 pr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden mr-3 flex-shrink-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                    Welcome, {currentUser.name.split(' ')[0]}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium w-fit">
                      {currentUser.role}
                    </div>
                    <p className="text-xs text-gray-600 hidden lg:block">
                      Monitor your environmental impact
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <div className="hidden lg:flex items-center space-x-4">
                  <RoleSwitcher />
                  <NotificationDropdown />
                  <Button 
                    size="sm"
                    className="green-primary hover:bg-green-600 text-white"
                    onClick={() => navigate("/pickup-requests")}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    <span className="hidden xl:inline">Request New Pickup</span>
                    <span className="xl:hidden">Request</span>
                  </Button>
                </div>
                
                {/* Mobile/Tablet Menu */}
                <div className="lg:hidden flex items-center gap-1">
                  <div className="scale-75 sm:scale-100">
                    <RoleSwitcher />
                  </div>
                  <div className="scale-75 sm:scale-100">
                    <NotificationDropdown />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Stats Cards */}
          <StatsCards />

          {/* Operator-specific Status Update */}
          <OperatorPickupStatus />

          {/* Chart and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="mobile-hide-chart lg:block">
              <WasteChart />
            </div>
            <RecentActivity />
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </main>
      </div>
    </div>
  );
}
