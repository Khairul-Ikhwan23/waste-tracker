import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Menu, Plus, Calendar, MapPin, Trash2 } from "lucide-react";
import { samplePickupRequests, BRUNEI_LOCATIONS, WASTE_TYPES, type PickupRequest } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function PickupRequests() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>(samplePickupRequests);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    wasteType: '',
    date: '',
    time: ''
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.address || !formData.wasteType || !formData.date || !formData.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create new pickup request
    const newRequest: PickupRequest = {
      id: Date.now().toString(),
      name: formData.name,
      address: formData.address,
      wasteType: formData.wasteType,
      date: formData.date,
      time: formData.time,
      zone: `KB-${Math.floor(Math.random() * 10) + 1}`,
      district: 'Brunei-Muara',
      status: 'pending',
      volume: Math.floor(Math.random() * 50) + 10
    };

    setPickupRequests([...pickupRequests, newRequest]);
    setFormData({
      name: '',
      address: '',
      wasteType: '',
      date: '',
      time: ''
    });

    toast({
      title: "Success",
      description: "Pickup request submitted successfully",
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-white shadow-md"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}

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
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="ml-12 lg:ml-0">
                  <h1 className="text-2xl font-bold text-gray-900">Pickup Requests</h1>
                  <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                    Schedule and manage waste pickup requests
                  </p>
                  <p className="text-sm text-gray-600 mt-1 sm:hidden">
                    Schedule pickups
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-green-primary" />
                  New Pickup Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Select value={formData.address} onValueChange={(value) => setFormData({...formData, address: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRUNEI_LOCATIONS.map((location) => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="wasteType">Waste Type</Label>
                    <Select value={formData.wasteType} onValueChange={(value) => setFormData({...formData, wasteType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select waste type" />
                      </SelectTrigger>
                      <SelectContent>
                        {WASTE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full green-primary hover:bg-green-600 text-white">
                    Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Upcoming Pickups */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-primary" />
                  Upcoming Pickups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pickupRequests
                    .filter(req => req.status !== 'completed')
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((request) => (
                    <div key={request.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Trash2 className="w-4 h-4 text-gray-500 mr-2" />
                          <h3 className="font-medium text-gray-900">{request.name}</h3>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {request.address}
                        </div>
                        <div>Type: {request.wasteType}</div>
                        <div>Date: {request.date} at {request.time}</div>
                        <div>Zone: {request.zone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}