import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/contexts/UserContext";
import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Menu, User, Edit, Save, X } from "lucide-react";
import { BRUNEI_LOCATIONS, WASTE_TYPES } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function UserProfile() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { currentUser, updateProfile } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    address: currentUser.address,
    preferredWasteTypes: currentUser.preferredWasteTypes,
    binOwnership: currentUser.binOwnership
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully",
    });
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address,
      preferredWasteTypes: currentUser.preferredWasteTypes,
      binOwnership: currentUser.binOwnership
    });
    setIsEditing(false);
  };

  const toggleWasteType = (wasteType: string) => {
    setFormData(prev => ({
      ...prev,
      preferredWasteTypes: prev.preferredWasteTypes.includes(wasteType)
        ? prev.preferredWasteTypes.filter(type => type !== wasteType)
        : [...prev.preferredWasteTypes, wasteType]
    }));
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
          <div className="px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between min-h-16 py-2 sm:py-0">
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
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Profile</h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                    Manage your personal information and preferences
                  </p>
                  <p className="text-xs text-gray-600 mt-1 sm:hidden">
                    Manage profile
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!isEditing ? (
                  <Button 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="green-primary hover:bg-green-600 text-white"
                  >
                    <Edit className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={handleSave}
                      className="green-primary hover:bg-green-600 text-white"
                    >
                      <Save className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Save Changes</span>
                    </Button>
                    <Button 
                      onClick={handleCancel}
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-primary" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Avatar and Role */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-4xl">
                      {currentUser.avatar}
                    </div>
                    <Badge className="text-sm px-3 py-1">
                      {currentUser.role}
                    </Badge>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-sm text-gray-600">{currentUser.role}</p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        {isEditing ? (
                          <Select 
                            value={formData.address} 
                            onValueChange={(value) => setFormData({...formData, address: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {BRUNEI_LOCATIONS.map((location) => (
                                <SelectItem key={location} value={location}>{location}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id="address"
                            value={formData.address}
                            disabled
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Waste Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Waste Type Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {WASTE_TYPES.map((wasteType) => (
                    <div key={wasteType} className="flex items-center space-x-2">
                      <Checkbox
                        id={wasteType}
                        checked={formData.preferredWasteTypes.includes(wasteType)}
                        onCheckedChange={() => toggleWasteType(wasteType)}
                        disabled={!isEditing}
                      />
                      <Label htmlFor={wasteType} className="text-sm">
                        {wasteType.replace(' (Municipal Solid Waste)', '')}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bin Ownership */}
            <Card>
              <CardHeader>
                <CardTitle>Bin Ownership</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentUser.binOwnership.map((bin, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {bin}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-primary">{currentUser.ecoPoints}</p>
                    <p className="text-sm text-gray-600">EcoPoints</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-gray-600">Pickups This Month</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">78%</p>
                    <p className="text-sm text-gray-600">Recycling Rate</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}