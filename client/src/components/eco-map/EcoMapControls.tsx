import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ECO_CATEGORIES } from '@/lib/eco-map-data';
import { MapPin, Filter, Settings, Eye, EyeOff, Edit, X, Search } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface EcoMapControlsProps {
  visibleCategories: Set<string>;
  onCategoryToggle: (category: string) => void;
  proximityRadius: number;
  onProximityChange: (radius: number) => void;
  userLocation: [number, number] | null;
  onLocationRequest: () => void;
  totalLocations: number;
  visibleLocations: number;
  isMobile?: boolean;
  adminMode?: 'none' | 'edit';
  onAdminModeChange?: (mode: 'none' | 'edit') => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  facilityFilter?: string;
  onFacilityFilterChange?: (filter: string) => void;
}

export default function EcoMapControls({
  visibleCategories,
  onCategoryToggle,
  proximityRadius,
  onProximityChange,
  userLocation,
  onLocationRequest,
  totalLocations,
  visibleLocations,
  isMobile = false,
  adminMode = 'none',
  onAdminModeChange,
  searchQuery = '',
  onSearchChange,
  facilityFilter = 'all',
  onFacilityFilterChange
}: EcoMapControlsProps) {
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const { currentUser } = useUser();
  const isAdmin = currentUser.role === 'Admin';

  return (
    <Card className={`${isMobile ? 'mb-4 backdrop-blur-sm bg-white/95' : 'w-80'} shadow-lg`}>
      <CardHeader className={`${isMobile ? 'pb-2' : 'pb-3'}`}>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
            <Filter className="w-5 h-5 text-green-600" />
            Map Controls
          </CardTitle>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1"
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Showing {visibleLocations} of {totalLocations} locations</span>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className={`space-y-${isMobile ? '4' : '6'} ${isMobile ? 'max-h-[40vh] overflow-y-auto' : ''}`}>
          {/* Admin Controls */}
          {isAdmin && (
            <div className="space-y-3 border-b pb-4">
              <Label className="text-sm font-medium">Facility Management</Label>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search facilities..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filter */}
              <Select value={facilityFilter} onValueChange={onFacilityFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  <SelectItem value="editable">Editable Only</SelectItem>
                  <SelectItem value="system">System Only</SelectItem>
                  {Object.entries(ECO_CATEGORIES).map(([key, category]) => (
                    <SelectItem key={key} value={key}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Edit Mode Toggle */}
              <Button
                variant={adminMode === 'edit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onAdminModeChange?.(adminMode === 'edit' ? 'none' : 'edit')}
                className="w-full"
              >
                <Edit className="w-4 h-4 mr-2" />
                {adminMode === 'edit' ? 'Exit Edit Mode' : 'Edit Facilities'}
              </Button>
              
              {adminMode === 'edit' && (
                <p className="text-xs text-gray-600 mt-2 bg-orange-50 p-2 rounded">
                  Click on facilities to edit or delete them. System facilities cannot be modified.
                </p>
              )}
            </div>
          )}

          {/* Location Controls */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Your Location
            </Label>
            <div className="space-y-2">
              <Button
                variant={userLocation ? "outline" : "default"}
                size="sm"
                onClick={onLocationRequest}
                className="w-full"
              >
                {userLocation ? 'Update Location' : 'Get My Location'}
              </Button>
              {userLocation && (
                <div className="text-xs text-gray-500 text-center">
                  Located at {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                </div>
              )}
            </div>
          </div>

          {/* Proximity Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Proximity Filter: {proximityRadius}km radius
            </Label>
            <div className="px-2">
              <Slider
                value={[proximityRadius]}
                onValueChange={(value) => onProximityChange(value[0])}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1km</span>
                <span>25km</span>
                <span>50km</span>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Facility Categories</Label>
            <div className="space-y-3">
              {Object.entries(ECO_CATEGORIES).map(([key, category]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <Label 
                      htmlFor={`category-${key}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {category.icon} {category.name}
                    </Label>
                  </div>
                  <Switch
                    id={`category-${key}`}
                    checked={visibleCategories.has(key)}
                    onCheckedChange={() => onCategoryToggle(key)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  Object.keys(ECO_CATEGORIES).forEach(category => {
                    if (!visibleCategories.has(category)) {
                      onCategoryToggle(category);
                    }
                  });
                }}
                className="flex-1"
              >
                Show All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  visibleCategories.forEach(category => {
                    onCategoryToggle(category);
                  });
                }}
                className="flex-1"
              >
                Hide All
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 pt-2 border-t">
            <Label className="text-xs font-medium text-gray-600">Legend</Label>
            <div className="grid grid-cols-1 gap-1 text-xs">
              {Object.entries(ECO_CATEGORIES).map(([key, category]) => (
                <div key={key} className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs px-1 py-0"
                    style={{ 
                      borderColor: category.color,
                      color: category.color
                    }}
                  >
                    {category.icon}
                  </Badge>
                  <span className="text-gray-600">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}