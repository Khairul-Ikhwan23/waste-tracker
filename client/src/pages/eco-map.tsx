import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/dashboard/sidebar";
import EcoMapControls from "@/components/eco-map/EcoMapControls";
import LocationPopup from "@/components/eco-map/LocationPopup";
import FacilityFormPopup from "@/components/eco-map/FacilityFormPopup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ECO_LOCATIONS,
  ECO_CATEGORIES,
  BRUNEI_CENTER,
  getLocationsWithinRadius,
  calculateDistance,
  type EcoLocation,
} from "@/lib/eco-map-data";
import { Menu, MapPin, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons for each category
const createCustomIcon = (category: keyof typeof ECO_CATEGORIES) => {
  const categoryInfo = ECO_CATEGORIES[category];
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${categoryInfo.color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        font-size: 12px;
      ">
        ${categoryInfo.icon}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// User location marker
const createUserLocationIcon = () => {
  return L.divIcon({
    className: "user-location-marker",
    html: `
      <div style="
        background-color: #ef4444;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: -8px;
          left: -8px;
          width: 32px;
          height: 32px;
          border: 2px solid #ef4444;
          border-radius: 50%;
          animation: pulse 2s infinite;
          opacity: 0.3;
        "></div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// Component to handle map center updates
function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

export default function EcoMap() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    new Set(Object.keys(ECO_CATEGORIES)),
  );
  const [proximityRadius, setProximityRadius] = useState(25);
  const [mapCenter, setMapCenter] = useState<[number, number]>(BRUNEI_CENTER);
  const [mapZoom, setMapZoom] = useState(10);
  const [allLocations, setAllLocations] = useState<EcoLocation[]>(ECO_LOCATIONS);
  const [isSelectingCoords, setIsSelectingCoords] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [adminMode, setAdminMode] = useState<'none' | 'edit'>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [showFacilityForm, setShowFacilityForm] = useState(false);
  const [editingFacility, setEditingFacility] = useState<EcoLocation | null>(null);
  const [formPosition, setFormPosition] = useState<{ x: number; y: number } | null>(null);

  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Load admin facilities on component mount and when localStorage changes
  useEffect(() => {
    const loadAllFacilities = () => {
      const adminFacilities = localStorage.getItem("admin-facilities");
      const adminFacilitiesParsed = adminFacilities ? JSON.parse(adminFacilities) : [];
      const combined = [...ECO_LOCATIONS, ...adminFacilitiesParsed];
      setAllLocations(combined);
    };

    loadAllFacilities();

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "admin-facilities") {
        loadAllFacilities();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Filter locations based on visible categories, proximity, search, and admin filters
  const filteredLocations = useMemo(() => {
    return allLocations.filter(location => {
      const categoryVisible = visibleCategories.has(location.category);
      
      const withinProximity = !userLocation || 
        calculateDistance(userLocation, location.coordinates) <= proximityRadius;
      
      // Search filter
      const matchesSearch = !searchQuery || 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Admin facility filter
      let matchesFacilityFilter = true;
      if (facilityFilter === 'editable') {
        matchesFacilityFilter = !location.isReadOnly;
      } else if (facilityFilter === 'system') {
        matchesFacilityFilter = !!location.isReadOnly;
      } else if (facilityFilter !== 'all') {
        matchesFacilityFilter = location.category === facilityFilter;
      }
      
      return categoryVisible && withinProximity && matchesSearch && matchesFacilityFilter;
    });
  }, [allLocations, visibleCategories, userLocation, proximityRadius, searchQuery, facilityFilter]);

  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    setVisibleCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Handle proximity radius change
  const handleProximityChange = (radius: number) => {
    setProximityRadius(radius);
  };

  // Request user location
  const handleLocationRequest = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation: [number, number] = [latitude, longitude];
        setUserLocation(newLocation);
        setMapCenter(newLocation);
        setMapZoom(16);
        setIsLoadingLocation(false);

        toast({
          title: "Location Found",
          description: "Your location has been updated on the map",
        });
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);

        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  };

  // MapController component
  const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
    const map = useMap();
    
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom, map]);
    
    return null;
  };

  // Admin Map Click Handler - simplified since we removed add mode
  const AdminMapHandler = () => {
    return null;
  };

  // Handle facility marker clicks in edit mode
  const handleFacilityClick = (facility: EcoLocation) => {
    console.log('Facility clicked:', facility.name, 'Admin mode:', adminMode);
    
    if (adminMode === 'edit') {
      if (facility.isReadOnly) {
        toast({
          title: "Cannot Edit",
          description: "This is a system facility and cannot be modified",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Opening edit form for facility:', facility.name);
      setEditingFacility(facility);
      setFormPosition(null); // Always center for better UX
      setShowFacilityForm(true);
    }
  };

  // Handle facility save
  const handleFacilitySave = (facilityData: Omit<EcoLocation, 'id'>) => {
    if (editingFacility) {
      // Update existing facility
      const updatedFacilities = allLocations.map(f => 
        f.id === editingFacility.id 
          ? { ...facilityData, id: editingFacility.id }
          : f
      );
      setAllLocations(updatedFacilities);
      
      // Update admin facilities in localStorage
      const adminFacilities = updatedFacilities.filter(f => !f.isReadOnly);
      localStorage.setItem("admin-facilities", JSON.stringify(adminFacilities));
    } else {
      // Add new facility
      const newFacility: EcoLocation = {
        ...facilityData,
        id: `admin-${Date.now()}`,
      };
      const updatedFacilities = [...allLocations, newFacility];
      setAllLocations(updatedFacilities);
      
      // Update admin facilities in localStorage
      const adminFacilities = updatedFacilities.filter(f => !f.isReadOnly);
      localStorage.setItem("admin-facilities", JSON.stringify(adminFacilities));
    }
    
    setShowFacilityForm(false);
    setEditingFacility(null);
    setSelectedCoords(null);
    setAdminMode('none');
  };

  // Handle facility delete
  const handleFacilityDelete = (id: string) => {
    const updatedFacilities = allLocations.filter(f => f.id !== id);
    setAllLocations(updatedFacilities);
    
    // Update admin facilities in localStorage
    const adminFacilities = updatedFacilities.filter(f => !f.isReadOnly);
    localStorage.setItem("admin-facilities", JSON.stringify(adminFacilities));
    
    setShowFacilityForm(false);
    setEditingFacility(null);
    setAdminMode('none');
  };

  // Load CSS for Leaflet
  useEffect(() => {
    // Inject Leaflet CSS if not already present
    const existingLink = document.querySelector('link[href*="leaflet"]');
    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Add custom CSS for animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.3; }
        50% { transform: scale(1.2); opacity: 0.1; }
        100% { transform: scale(1); opacity: 0.3; }
      }
      .leaflet-popup-content-wrapper {
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .leaflet-popup-content {
        margin: 16px;
        line-height: 1.4;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
          className="fixed inset-0 bg-black bg-opacity-50 z-[2000] lg:hidden"
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
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                    EcoMap
                  </h1>
                  <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                    Discover recycling facilities and eco-friendly locations in
                    Brunei
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLocationRequest}
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4 mr-2" />
                  )}
                  {isMobile ? "Locate" : "Find Me"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Map Content */}
        <main className="flex-1 h-[calc(100vh-80px)] relative">
          {isMobile ? (
            // Mobile layout: Map full screen with controls at bottom
            <div className="h-full relative">
              {locationError && (
                <Alert className="absolute top-4 left-4 right-4 z-[1000]">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{locationError}</AlertDescription>
                </Alert>
              )}

              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
              >
                <MapController center={mapCenter} zoom={mapZoom} />
                <AdminMapHandler />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User location marker */}
                {userLocation && (
                  <Marker
                    position={userLocation}
                    icon={createUserLocationIcon()}
                  >
                    <Popup>
                      <div className="text-center">
                        <strong>Your Location</strong>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Selected coordinates marker */}
                {selectedCoords && (
                  <Marker
                    position={selectedCoords}
                    icon={L.divIcon({
                      className: "selected-coord-marker",
                      html: `<div style="background: #ff4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                      iconSize: [20, 20],
                      iconAnchor: [10, 10],
                    })}
                  >
                    <Popup>
                      <div className="text-center">
                        <strong>Selected Location</strong>
                        <br />
                        <small>Lat: {selectedCoords[0].toFixed(6)}</small>
                        <br />
                        <small>Lng: {selectedCoords[1].toFixed(6)}</small>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Eco location markers */}
                {filteredLocations.map((location) => (
                  <Marker
                    key={location.id}
                    position={location.coordinates}
                    icon={createCustomIcon(location.category)}
                    eventHandlers={{
                      click: () => {
                        handleFacilityClick(location);
                      },
                    }}
                  >
                    <Popup maxWidth={320} minWidth={300}>
                      <LocationPopup
                        location={location}
                        userLocation={userLocation}
                      />
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Bottom Controls for Mobile */}
              <div className="absolute bottom-4 left-4 right-4 z-[1000] max-h-[60vh] overflow-y-auto">
                <EcoMapControls
                  visibleCategories={visibleCategories}
                  onCategoryToggle={handleCategoryToggle}
                  proximityRadius={proximityRadius}
                  onProximityChange={handleProximityChange}
                  userLocation={userLocation}
                  onLocationRequest={handleLocationRequest}
                  totalLocations={allLocations.length}
                  visibleLocations={filteredLocations.length}
                  isMobile={true}
                  adminMode={adminMode}
                  onAdminModeChange={setAdminMode}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  facilityFilter={facilityFilter}
                  onFacilityFilterChange={setFacilityFilter}
                />
              </div>
            </div>
          ) : (
            // Desktop layout: Side panel and map
            <div className="h-full flex">
              <div className="flex-shrink-0 p-6 bg-gray-50 overflow-y-auto">
                <EcoMapControls
                  visibleCategories={visibleCategories}
                  onCategoryToggle={handleCategoryToggle}
                  proximityRadius={proximityRadius}
                  onProximityChange={handleProximityChange}
                  userLocation={userLocation}
                  onLocationRequest={handleLocationRequest}
                  totalLocations={allLocations.length}
                  visibleLocations={filteredLocations.length}
                  isMobile={false}
                  adminMode={adminMode}
                  onAdminModeChange={setAdminMode}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  facilityFilter={facilityFilter}
                  onFacilityFilterChange={setFacilityFilter}
                />
              </div>

              <div className="flex-1 relative">
                {locationError && (
                  <Alert className="absolute top-4 left-4 right-4 z-[1000]">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{locationError}</AlertDescription>
                  </Alert>
                )}

                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: "100%", width: "100%" }}
                >
                  <MapController center={mapCenter} zoom={mapZoom} />
                  <AdminMapHandler />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* User location marker */}
                  {userLocation && (
                    <Marker
                      position={userLocation}
                      icon={createUserLocationIcon()}
                    >
                      <Popup>
                        <div className="text-center">
                          <strong>Your Location</strong>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Selected coordinates marker */}
                  {selectedCoords && (
                    <Marker
                      position={selectedCoords}
                      icon={L.divIcon({
                        className: "selected-coord-marker",
                        html: `<div style="background: #ff4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                      })}
                    >
                      <Popup>
                        <div className="text-center">
                          <strong>Selected Location</strong>
                          <br />
                          <small>Lat: {selectedCoords[0].toFixed(6)}</small>
                          <br />
                          <small>Lng: {selectedCoords[1].toFixed(6)}</small>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Eco location markers */}
                  {filteredLocations.map((location) => (
                    <Marker
                      key={location.id}
                      position={location.coordinates}
                      icon={createCustomIcon(location.category)}
                      eventHandlers={{
                        click: () => {
                          handleFacilityClick(location);
                        },
                      }}
                    >
                      <Popup maxWidth={320} minWidth={300}>
                        <LocationPopup
                          location={location}
                          userLocation={userLocation}
                        />
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          )}
        </main>

        {/* Facility Form Popup */}
        <FacilityFormPopup
          isOpen={showFacilityForm}
          onClose={() => {
            setShowFacilityForm(false);
            setEditingFacility(null);
            setSelectedCoords(null);
          }}
          position={formPosition}
          coordinates={selectedCoords}
          editingFacility={editingFacility}
          onSave={handleFacilitySave}
          onDelete={handleFacilityDelete}
        />
      </div>
    </div>
  );
}
