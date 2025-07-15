import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AddressDto } from '@/types/address';
import { useLanguage } from '@/contexts/LanguageContext';

// Fix default marker icon for leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AddressMapProps {
  addresses: AddressDto[];
  height?: string;
  className?: string;
}

const AddressMap: React.FC<AddressMapProps> = ({ 
  addresses, 
  height = "400px",
  className = ""
}) => {
  const { t, isRTL } = useLanguage();

  // Filter addresses that have coordinates
  const addressesWithCoords = addresses.filter(
    addr => addr.locationLat && addr.locationLong
  );

  // Calculate center point for the map
  const getMapCenter = () => {
    if (addressesWithCoords.length === 0) {
      return [24.7136, 46.6753]; // Default to Riyadh, Saudi Arabia
    }
    
    if (addressesWithCoords.length === 1) {
      return [
        parseFloat(addressesWithCoords[0].locationLat!),
        parseFloat(addressesWithCoords[0].locationLong!)
      ];
    }

    // Calculate center of all addresses
    const lats = addressesWithCoords.map(addr => parseFloat(addr.locationLat!));
    const lngs = addressesWithCoords.map(addr => parseFloat(addr.locationLong!));
    
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    
    return [centerLat, centerLng];
  };

  const center = getMapCenter();

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <MapContainer
        center={center as [number, number]}
        zoom={addressesWithCoords.length <= 1 ? 13 : 10}
        className="h-full w-full rounded-lg"
        style={{ height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {addressesWithCoords.map((address) => (
          <Marker
            key={address.id}
            position={[
              parseFloat(address.locationLat!),
              parseFloat(address.locationLong!)
            ]}
          >
            <Popup>
              <div className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="font-semibold mb-1">
                  {address.addressName || address.street}
                </h3>
                {address.street && (
                  <p className="text-gray-600 mb-1">{address.street}</p>
                )}
                {address.city?.name && (
                  <p className="text-gray-600 mb-1">{address.city.name}</p>
                )}
                {address.famousSign && (
                  <p className="text-gray-500 text-xs">
                    🏷️ {address.famousSign}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default AddressMap; 