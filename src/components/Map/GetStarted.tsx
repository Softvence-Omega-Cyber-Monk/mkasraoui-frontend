import { useEffect, useState } from "react";

import map from "../../assets/logo/Location.svg";
import mapUp from "../../assets/logo/dashboardMap.svg";
import MapModal from "./MapModal";
import { forwardGeocode, reverseGeocode } from "@/lib/geocoding";

interface GetStartedProps {
  location: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  onLocationChange: (location: { lat: number; lng: number } | null) => void;
  onDestinationChange: (
    destination: { lat: number; lng: number } | null,
  ) => void;
  onLocationAddressChange: (address: string) => void;
  onDestinationAddressChange: (address: string) => void;
}

const GetStarted = ({
  location,
  destination,
  onLocationChange,
  onDestinationChange,
  onLocationAddressChange,
  onDestinationAddressChange,
}: GetStartedProps) => {
  const [showMap, setShowMap] = useState(false);
  const [mapType, setMapType] = useState<"location" | "destination">(
    "location",
  );

  const [locationAddress, setLocationAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      if (location && !locationAddress) {
        const addr = await reverseGeocode(location.lat, location.lng);
        if (active && addr) {
          setLocationAddress(addr);
          onLocationAddressChange(addr);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [location]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (destination && !destinationAddress) {
        const addr = await reverseGeocode(destination.lat, destination.lng);
        if (active && addr) {
          setDestinationAddress(addr);
          onDestinationAddressChange(addr);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [destination]);

  const handleMapSelect = async (lat: number, lng: number) => {
    const coords = { lat, lng };
    const addr = await reverseGeocode(lat, lng);
    if (mapType === "location") {
      setLocationAddress(
        addr || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`,
      );
      onLocationChange(coords);
      if (addr) onLocationAddressChange(addr);
    } else {
      setDestinationAddress(
        addr || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`,
      );
      onDestinationChange(coords);
      if (addr) onDestinationAddressChange(addr);
    }
    setShowMap(false);
  };

  const openLocationMap = () => {
    setMapType("location");
    setShowMap(true);
  };

  // Debounced forward geocoding when user types address
  useEffect(() => {
    const id = setTimeout(async () => {
      if (!locationAddress || locationAddress.trim().length < 4) return;
      const coords = await forwardGeocode(locationAddress.trim());
      if (coords) onLocationChange(coords);
    }, 700);
    return () => clearTimeout(id);
  }, [locationAddress, onLocationChange]);

  useEffect(() => {
    const id = setTimeout(async () => {
      if (!destinationAddress || destinationAddress.trim().length < 4) return;
      const coords = await forwardGeocode(destinationAddress.trim());
      if (coords) onDestinationChange(coords);
    }, 700);
    return () => clearTimeout(id);
  }, [destinationAddress, onDestinationChange]);

  return (
    <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-center">
      {/* Input Section */}
      <div className="w-full lg:w-1/2">
        <div className="gap-6 space-y-8">
          <div className="space-y-4">
            {/* Location Input */}
            <div>
              <div className="relative w-full">
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                  <img src={map} className="h-6 w-6" />
                </div>

                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="Enter starting location"
                  className="border-dark-3 text-dark-3 w-full rounded-lg border py-4 pr-10 pl-10 focus:outline-none"
                />

                <div
                  className="absolute top-1/2 right-2 flex h-10 w-16 -translate-y-1/2 items-center justify-center overflow-hidden rounded text-gray-500"
                  style={{
                    backgroundImage: `url('/mapBg.svg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={openLocationMap}
                >
                  <img src={mapUp} alt="" />
                </div>
              </div>
            </div>
          </div>

          {/* Map modal */}
          <MapModal
            isOpen={showMap}
            onClose={() => setShowMap(false)}
            onSelect={handleMapSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
