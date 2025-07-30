import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { EcoLocation, ECO_CATEGORIES } from "@/lib/eco-map-data";
import { X, Save, Trash2 } from "lucide-react";

const BRUNEI_DISTRICTS = ["Brunei-Muara", "Belait", "Tutong", "Temburong"];

interface FacilityFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number } | null;
  coordinates: [number, number] | null;
  editingFacility: EcoLocation | null;
  onSave: (facility: Omit<EcoLocation, 'id'>) => void;
  onDelete?: (id: string) => void;
}

export default function FacilityFormPopup({
  isOpen,
  onClose,
  position,
  coordinates,
  editingFacility,
  onSave,
  onDelete
}: FacilityFormPopupProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    category: "" as keyof typeof ECO_CATEGORIES,
    address: "",
    district: "",
    hours: "",
    contact: "",
    services: [] as string[],
    wasteTypes: [] as string[]
  });

  useEffect(() => {
    if (editingFacility) {
      setFormData({
        name: editingFacility.name,
        category: editingFacility.category,
        address: editingFacility.address,
        district: editingFacility.district,
        hours: editingFacility.hours,
        contact: editingFacility.contact || "",
        services: editingFacility.services,
        wasteTypes: editingFacility.wasteTypes
      });
    } else {
      setFormData({
        name: "",
        category: "" as keyof typeof ECO_CATEGORIES,
        address: "",
        district: "",
        hours: "",
        contact: "",
        services: [],
        wasteTypes: []
      });
    }
  }, [editingFacility, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coordinates && !editingFacility) {
      toast({
        title: "Error",
        description: "Coordinates are required",
        variant: "destructive"
      });
      return;
    }

    const facilityData = {
      ...formData,
      coordinates: editingFacility ? editingFacility.coordinates : coordinates!,
    };

    onSave(facilityData);
    onClose();
    
    toast({
      title: "Success",
      description: editingFacility ? "Facility updated successfully" : "Facility added successfully"
    });
  };

  const handleDelete = () => {
    if (editingFacility && onDelete) {
      onDelete(editingFacility.id);
      onClose();
      toast({
        title: "Success",
        description: "Facility deleted successfully"
      });
    }
  };

  const addService = (service: string) => {
    if (service && !formData.services.includes(service)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, service]
      }));
    }
  };

  const removeService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  const addWasteType = (type: string) => {
    if (type && !formData.wasteTypes.includes(type)) {
      setFormData(prev => ({
        ...prev,
        wasteTypes: [...prev.wasteTypes, type]
      }));
    }
  };

  const removeWasteType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      wasteTypes: prev.wasteTypes.filter(t => t !== type)
    }));
  };

  if (!isOpen) return null;

  const isMobile = window.innerWidth < 768;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ zIndex: 2000 }}
    >
      <Card 
        className={`w-full bg-white shadow-xl ${
          isMobile 
            ? 'max-w-sm max-h-[90vh] mx-2' 
            : 'max-w-md max-h-[85vh]'
        } overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {editingFacility ? "Edit Facility" : "Add New Facility"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="name">Facility Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Green Recycling Center"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    category: value as keyof typeof ECO_CATEGORIES 
                  }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent 
                    className="z-[3000]" 
                    position="popper"
                    sideOffset={4}
                  >
                    {Object.entries(ECO_CATEGORIES).map(([key, category]) => (
                      <SelectItem key={key} value={key}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="e.g., Jalan Subok, Kampong Subok"
                required
              />
            </div>

            <div>
              <Label htmlFor="district">District *</Label>
              <Select
                value={formData.district}
                onValueChange={(value) => setFormData(prev => ({ ...prev, district: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent 
                  className="z-[3000]" 
                  position="popper"
                  sideOffset={4}
                >
                  {BRUNEI_DISTRICTS.map(district => (
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
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="+673 xxx xxxx"
              />
            </div>

            <div>
              <Label htmlFor="hours">Operating Hours *</Label>
              <Input
                id="hours"
                value={formData.hours}
                onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
                placeholder="e.g., Mon-Fri: 8:00 AM - 5:00 PM"
                required
              />
            </div>

            <div>
              <Label className="text-sm">Services</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Add service and press Enter..."
                  className="text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addService(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <div className="flex flex-wrap gap-1">
                  {formData.services.map(service => (
                    <Badge 
                      key={service} 
                      variant="secondary"
                      className="cursor-pointer text-xs"
                      onClick={() => removeService(service)}
                    >
                      {service} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm">Waste Types</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Add waste type and press Enter..."
                  className="text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addWasteType(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <div className="flex flex-wrap gap-1">
                  {formData.wasteTypes.map(type => (
                    <Badge 
                      key={type} 
                      variant="outline"
                      className="cursor-pointer text-xs"
                      onClick={() => removeWasteType(type)}
                    >
                      {type} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3">
              {editingFacility && !editingFacility.isReadOnly && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Facility
                </Button>
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="green-primary flex-1">
                  <Save className="w-4 h-4 mr-1" />
                  {editingFacility ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}