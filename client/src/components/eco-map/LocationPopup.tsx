import { EcoLocation, ECO_CATEGORIES } from '@/lib/eco-map-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  Recycle,
  Building,
  ExternalLink
} from 'lucide-react';

interface LocationPopupProps {
  location: EcoLocation;
  userLocation?: [number, number] | null;
}

export default function LocationPopup({ location, userLocation }: LocationPopupProps) {
  const category = ECO_CATEGORIES[location.category];

  const handleGetDirections = () => {
    const [lat, lng] = location.coordinates;
    const destination = `${lat},${lng}`;
    
    // Try to open in Google Maps first, fallback to basic maps
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    const fallbackUrl = `https://maps.google.com/maps?q=${lat},${lng}`;
    
    try {
      window.open(googleMapsUrl, '_blank');
    } catch {
      window.open(fallbackUrl, '_blank');
    }
  };

  const handleCall = () => {
    if (location.contact) {
      window.open(`tel:${location.contact}`, '_self');
    }
  };

  return (
    <div className="w-80 max-w-sm">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start gap-2 mb-2">
          <div 
            className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 leading-tight">
              {location.name}
            </h3>
            <Badge 
              variant="outline" 
              className="mt-1 text-xs"
              style={{ 
                borderColor: category.color,
                color: category.color 
              }}
            >
              {category.icon} {category.name}
            </Badge>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 mb-3 text-sm">
        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-gray-700">{location.address}</p>
          <p className="text-gray-500 text-xs">{location.district} District</p>
        </div>
      </div>

      {/* Hours */}
      <div className="flex items-start gap-2 mb-3 text-sm">
        <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-gray-700">{location.hours}</p>
        </div>
      </div>

      {/* Contact */}
      {location.contact && (
        <div className="flex items-center gap-2 mb-3 text-sm">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <button
            onClick={handleCall}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {location.contact}
          </button>
        </div>
      )}

      <Separator className="my-3" />

      {/* Services */}
      {location.services.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Building className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Services</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {location.services.map((service, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Waste Types */}
      {location.wasteTypes.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Recycle className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Accepted Waste</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {location.wasteTypes.map((wasteType, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs"
                style={{ 
                  borderColor: category.color,
                  color: category.color 
                }}
              >
                {wasteType}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleGetDirections}
          size="sm"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <Navigation className="w-4 h-4 mr-1" />
          Directions
        </Button>
        {location.contact && (
          <Button
            onClick={handleCall}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
          >
            <Phone className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Additional Info */}
      <div className="mt-3 pt-3 border-t text-xs text-gray-500">
        <p>Click outside to close this popup</p>
      </div>
    </div>
  );
}