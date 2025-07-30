import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Building,
  Phone,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/dashboard/sidebar";
import { Menu } from "lucide-react";
import { EcoLocation, ECO_CATEGORIES, ECO_LOCATIONS } from "@/lib/eco-map-data";
import { navigate } from "wouter/use-browser-location";

const BRUNEI_DISTRICTS = ["Brunei-Muara", "Belait", "Tutong", "Temburong"];

const WASTE_TYPES = [
  "Paper",
  "Plastic",
  "Metal",
  "Glass",
  "Electronic",
  "Organic",
  "Cardboard",
  "Batteries",
  "Textiles",
  "Oil",
  "Hazardous",
];

const SERVICES = [
  "Collection",
  "Processing",
  "Recycling",
  "Sorting",
  "Drop-off",
  "Pickup Service",
  "Composting",
  "Shredding",
  "Disposal",
];

export default function AdminFacilities() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [facilities, setFacilities] = useState<EcoLocation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<EcoLocation | null>(
    null,
  );
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "" as keyof typeof ECO_CATEGORIES,
    address: "",
    district: "",
    hours: "",
    contact: "",
    coordinates: { lat: "", lng: "" },
    services: [] as string[],
    wasteTypes: [] as string[],
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load facilities from localStorage and include existing ECO_LOCATIONS
  useEffect(() => {
    const savedFacilities = localStorage.getItem("admin-facilities");
    const adminFacilities = savedFacilities ? JSON.parse(savedFacilities) : [];

    // Include existing ECO_LOCATIONS as read-only entries
    const existingFacilities = ECO_LOCATIONS.map((location) => ({
      ...location,
      isReadOnly: true,
    }));

    setFacilities([...existingFacilities, ...adminFacilities]);
  }, []);

  // Listen for coordinate selection from EcoMap
  useEffect(() => {
    const handleStorageChange = () => {
      const selectedCoords = localStorage.getItem("selected-coordinates");
      if (selectedCoords) {
        const coords = JSON.parse(selectedCoords);
        setFormData((prev) => ({
          ...prev,
          coordinates: {
            lat: coords[0].toString(),
            lng: coords[1].toString(),
          },
        }));
        // Clear the stored coordinates
        localStorage.removeItem("selected-coordinates");
        toast({
          title: "Coordinates Updated",
          description: `Location set to ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`,
        });
      }
    };

    // Check immediately
    handleStorageChange();

    // Listen for storage events (from other tabs)
    window.addEventListener("storage", handleStorageChange);

    // Also listen for focus events (when returning from map tab)
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, [toast]);

  // Save facilities to localStorage (only admin-added ones)
  const saveFacilities = (newFacilities: EcoLocation[]) => {
    // Separate existing and admin facilities
    const existingFacilities = ECO_LOCATIONS.map((location) => ({
      ...location,
      isReadOnly: true,
    }));
    const adminOnlyFacilities = newFacilities.filter((f) => !f.isReadOnly);

    setFacilities([...existingFacilities, ...adminOnlyFacilities]);
    localStorage.setItem(
      "admin-facilities",
      JSON.stringify(adminOnlyFacilities),
    );
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "" as keyof typeof ECO_CATEGORIES,
      address: "",
      district: "",
      hours: "",
      contact: "",
      coordinates: { lat: "", lng: "" },
      services: [],
      wasteTypes: [],
    });
    setEditingFacility(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.address ||
      !formData.district
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!formData.coordinates.lat || !formData.coordinates.lng) {
      toast({
        title: "Error",
        description: "Please provide valid coordinates",
        variant: "destructive",
      });
      return;
    }

    const facilityData: EcoLocation = {
      id: editingFacility?.id || `admin_${Date.now()}`,
      name: formData.name,
      category: formData.category,
      coordinates: [
        parseFloat(formData.coordinates.lat),
        parseFloat(formData.coordinates.lng),
      ],
      address: formData.address,
      district: formData.district,
      hours: formData.hours || "Contact for hours",
      contact: formData.contact,
      services: formData.services,
      wasteTypes: formData.wasteTypes,
    };

    if (editingFacility) {
      const updatedFacilities = facilities.map((f) =>
        f.id === editingFacility.id ? facilityData : f,
      );
      saveFacilities(updatedFacilities);
      toast({
        title: "Success",
        description: "Facility updated successfully",
      });
    } else {
      saveFacilities([...facilities, facilityData]);
      toast({
        title: "Success",
        description: "Facility added successfully",
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (facility: EcoLocation) => {
    if (facility.isReadOnly) {
      toast({
        title: "Cannot Edit",
        description: "This is a system facility and cannot be modified",
        variant: "destructive",
      });
      return;
    }

    setEditingFacility(facility);
    setFormData({
      name: facility.name,
      category: facility.category,
      address: facility.address,
      district: facility.district,
      hours: facility.hours,
      contact: facility.contact || "",
      coordinates: {
        lat: facility.coordinates[0].toString(),
        lng: facility.coordinates[1].toString(),
      },
      services: facility.services,
      wasteTypes: facility.wasteTypes,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const facilityToDelete = facilities.find((f) => f.id === id);
    if (facilityToDelete?.isReadOnly) {
      toast({
        title: "Cannot Delete",
        description: "This is a system facility and cannot be deleted",
        variant: "destructive",
      });
      return;
    }

    const updatedFacilities = facilities.filter((f) => f.id !== id);
    saveFacilities(updatedFacilities);
    toast({
      title: "Success",
      description: "Facility deleted successfully",
    });
  };

  const handleArrayInput = (
    field: "services" | "wasteTypes",
    value: string,
  ) => {
    if (value && !formData[field].includes(value)) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
    }
  };

  const removeArrayItem = (field: "services" | "wasteTypes", item: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((i) => i !== item),
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isMobile={isMobile}
      />

      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[2000] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-0">
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
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                    Facility Management
                  </h1>
                  <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                    Manage recycling facilities and eco-locations
                  </p>
                </div>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm} className="green-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Facility
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                  <DialogHeader>
                    <DialogTitle>
                      {editingFacility ? "Edit Facility" : "Add New Facility"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Facility Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Enter facility name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              category: value as keyof typeof ECO_CATEGORIES,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ECO_CATEGORIES).map(
                              ([key, category]) => (
                                <SelectItem key={key} value={key}>
                                  {category.icon} {category.name}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Enter full address"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="district">District *</Label>
                        <Select
                          value={formData.district}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              district: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent>
                            {BRUNEI_DISTRICTS.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="contact">Contact</Label>
                        <Input
                          id="contact"
                          value={formData.contact}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              contact: e.target.value,
                            }))
                          }
                          placeholder="+673 xxx xxxx"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="hours">Operating Hours</Label>
                      <Input
                        id="hours"
                        value={formData.hours}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            hours: e.target.value,
                          }))
                        }
                        placeholder="e.g., Mon-Fri: 8:00 AM - 5:00 PM"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lat">Latitude *</Label>
                          <Input
                            id="lat"
                            type="number"
                            step="any"
                            value={formData.coordinates.lat}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                coordinates: {
                                  ...prev.coordinates,
                                  lat: e.target.value,
                                },
                              }))
                            }
                            placeholder="4.5353"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lng">Longitude *</Label>
                          <Input
                            id="lng"
                            type="number"
                            step="any"
                            value={formData.coordinates.lng}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                coordinates: {
                                  ...prev.coordinates,
                                  lng: e.target.value,
                                },
                              }))
                            }
                            placeholder="114.7277"
                            required
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            navigate("/eco-map?select-coords=true#/eco-map")
                          }
                          className="w-full"
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Select Coordinates on Map
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Click to open EcoMap, then click anywhere on the map
                          to get coordinates
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label>Services</Label>
                      <Select
                        onValueChange={(value) =>
                          handleArrayInput("services", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Add services" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICES.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.services.map((service) => (
                          <Badge key={service} variant="secondary">
                            {service}
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem("services", service)
                              }
                              className="ml-2 text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Waste Types</Label>
                      <Select
                        onValueChange={(value) =>
                          handleArrayInput("wasteTypes", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Add waste types" />
                        </SelectTrigger>
                        <SelectContent>
                          {WASTE_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.wasteTypes.map((type) => (
                          <Badge key={type} variant="secondary">
                            {type}
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem("wasteTypes", type)
                              }
                              className="ml-2 text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="green-primary">
                        {editingFacility ? "Update" : "Add"} Facility
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <div className="grid gap-6">
            {facilities.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No facilities added yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start by adding your first eco-facility to the map
                  </p>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="green-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Facility
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {facilities.map((facility) => (
                  <Card key={facility.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {facility.name}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge
                              variant="secondary"
                              style={{
                                backgroundColor:
                                  ECO_CATEGORIES[facility.category].color +
                                  "20",
                                color: ECO_CATEGORIES[facility.category].color,
                              }}
                            >
                              {ECO_CATEGORIES[facility.category].icon}{" "}
                              {ECO_CATEGORIES[facility.category].name}
                            </Badge>
                            {facility.isReadOnly && (
                              <Badge variant="outline" className="text-xs">
                                System
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(facility)}
                            disabled={facility.isReadOnly}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(facility.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={facility.isReadOnly}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-900">
                            {facility.address}
                          </p>
                          <p className="text-xs text-gray-500">
                            {facility.district}
                          </p>
                        </div>
                      </div>

                      {facility.contact && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {facility.contact}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {facility.hours}
                        </span>
                      </div>

                      {facility.wasteTypes.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Waste Types:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {facility.wasteTypes.slice(0, 3).map((type) => (
                              <Badge
                                key={type}
                                variant="outline"
                                className="text-xs"
                              >
                                {type}
                              </Badge>
                            ))}
                            {facility.wasteTypes.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{facility.wasteTypes.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
