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
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="ml-12 lg:ml-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Welcome, {currentUser.name}
                    </h1>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Viewing as: {currentUser.role}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Monitor your environmental impact and manage waste efficiently
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-4">
                  <RoleSwitcher />
                  <NotificationDropdown />
                  <Button 
                    className="green-primary hover:bg-green-600 text-white"
                    onClick={() => navigate("/pickup-requests")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Request New Pickup
                  </Button>
                </div>
                
                {/* Mobile Menu */}
                <div className="sm:hidden flex items-center space-x-2">
                  <RoleSwitcher />
                  <NotificationDropdown />
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 mobile-touch-target"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="px-4 sm:px-6 lg:px-8 py-8 mobile-spacing">
          {/* Stats Cards */}
          <StatsCards />

          {/* Operator-specific Status Update */}
          <OperatorPickupStatus />

          {/* Chart and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <WasteChart />
            <RecentActivity />
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </main>
      </div>
    </div>
  );
}
