import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, Route, MapPin, Clock, Truck, Navigation } from "lucide-react";
import { samplePickupRequests, BRUNEI_DISTRICTS, type PickupRequest } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function RoutePlanner() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>(samplePickupRequests);
  const [isRouteOptimized, setIsRouteOptimized] = useState(false);

  const filteredRequests = selectedDistrict === 'all' 
    ? pickupRequests.filter(req => req.status !== 'completed')
    : pickupRequests.filter(req => req.district === selectedDistrict && req.status !== 'completed');

  const groupedByDistrict = filteredRequests.reduce((acc, request) => {
    if (!acc[request.district]) {
      acc[request.district] = [];
    }
    acc[request.district].push(request);
    return acc;
  }, {} as Record<string, PickupRequest[]>);

  const handlePlanRoute = () => {
    // Sort pickups by zone and time
    const optimizedRequests = filteredRequests.sort((a, b) => {
      if (a.zone !== b.zone) return a.zone.localeCompare(b.zone);
      return a.time.localeCompare(b.time);
    });

    setPickupRequests(prev => [
      ...prev.filter(req => req.status === 'completed'),
      ...optimizedRequests
    ]);
    setIsRouteOptimized(true);
    
    toast({
      title: "Route Optimized",
      description: `Route planned for ${optimizedRequests.length} pickups`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWasteTypeColor = (wasteType: string) => {
    switch (wasteType) {
      case 'MSW (Municipal Solid Waste)': return 'bg-red-100 text-red-800';
      case 'Recyclables': return 'bg-green-100 text-green-800';
      case 'Food Waste': return 'bg-orange-100 text-orange-800';
      case 'Bulky Waste': return 'bg-purple-100 text-purple-800';
      case 'Electronic Waste': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        isMobile={isMobile}
      />

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-3 sm:px-6 lg:px-8">
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between min-h-16 py-2 sm:py-0">
              <div className="flex items-center flex-1 min-w-0 pr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden mr-3 flex-shrink-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Route Planner</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Optimize pickup routes and manage collections
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {BRUNEI_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handlePlanRoute}
                  size="sm"
                  className="green-primary hover:bg-green-600 text-white"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Plan Route
                </Button>
              </div>
            </div>
            
            {/* Mobile Layout */}
            <div className="sm:hidden py-4 space-y-3">
              <div className="flex items-center flex-1 min-w-0 pr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="mr-3 flex-shrink-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 truncate">Route Planner</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Optimize routes
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {BRUNEI_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handlePlanRoute}
                  className="green-primary hover:bg-green-600 text-white w-full"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Plan Route
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Route Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Truck className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Pickups</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredRequests.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <MapPin className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Districts</p>
                    <p className="text-2xl font-bold text-gray-900">{Object.keys(groupedByDistrict).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Est. Time</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredRequests.length * 15}min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Route className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="text-lg font-bold text-gray-900">
                      {isRouteOptimized ? 'Optimized' : 'Pending'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Route Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Route className="w-5 h-5 mr-2 text-green-primary" />
                Pickup Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-gray-600">Pickup ID</th>
                      <th className="text-left p-3 font-medium text-gray-600">Location</th>
                      <th className="text-left p-3 font-medium text-gray-600">Waste Type</th>
                      <th className="text-left p-3 font-medium text-gray-600">Zone</th>
                      <th className="text-left p-3 font-medium text-gray-600">Time</th>
                      <th className="text-left p-3 font-medium text-gray-600">Status</th>
                      <th className="text-left p-3 font-medium text-gray-600">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-mono text-sm">{request.id}</td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-gray-900">{request.name}</p>
                            <p className="text-sm text-gray-600">{request.address}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getWasteTypeColor(request.wasteType)}>
                            {request.wasteType.replace(' (Municipal Solid Waste)', '')}
                          </Badge>
                        </td>
                        <td className="p-3 font-mono text-sm">{request.zone}</td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{request.date}</p>
                            <p className="text-sm text-gray-600">{request.time}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </td>
                        <td className="p-3 font-medium">{request.volume}kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-primary" />
                Route Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Interactive Route Map</p>
                  <p className="text-sm text-gray-500">Brunei waste collection routes visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}