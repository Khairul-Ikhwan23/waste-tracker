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
import MobileTestHelper from "@/components/mobile-test-helper";
import MobileNav from "@/components/dashboard/mobile-nav";
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Test Helper */}
      <MobileTestHelper />
      
      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden lg:block">
        <Sidebar 
          isOpen={true} 
          onClose={() => {}}
          isMobile={false}
        />
      </div>

      {/* Main Content - Full width on mobile */}
      <div className={`${isMobile ? 'w-full' : 'lg:ml-0'} flex-1`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-3 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-0 sm:h-16 space-y-3 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                      Welcome, {currentUser.name}
                    </h1>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium w-fit">
                      Viewing as: {currentUser.role}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    Monitor your environmental impact and manage waste efficiently
                  </p>
                </div>
              </div>
              
              {/* Mobile Navigation - Vertical Layout */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 sm:items-center">
                <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-4">
                  <RoleSwitcher />
                  <NotificationDropdown />
                </div>
                <Button 
                  className="green-primary hover:bg-green-600 text-white w-full sm:w-auto mobile-touch-target"
                  onClick={() => navigate("/pickup-requests")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Request New Pickup
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Mobile Navigation - Only visible on mobile */}
          {isMobile && <MobileNav />}

          {/* Stats Cards */}
          <StatsCards />

          {/* Operator-specific Status Update */}
          <OperatorPickupStatus />

          {/* Chart and Recent Activity */}
          <div className="mobile-linear lg:grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="mobile-hide-chart lg:block">
              <WasteChart />
            </div>
            <RecentActivity />
          </div>

          {/* Quick Actions - Hidden on mobile since navigation is above */}
          <div className="hidden lg:block">
            <QuickActions />
          </div>
        </main>
      </div>
    </div>
  );
}
