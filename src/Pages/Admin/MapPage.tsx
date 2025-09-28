import { useState } from "react";
import GetStarted from "@/components/Map/GetStarted";

const MapPage = () => {
  // State for location & destination
  const [addPlaceData, setAddPlaceData] = useState<{
    location: { lat: number; lng: number } | null;
    destination: { lat: number; lng: number } | null;
    homeAddress?: string;
    destinationAddress?: string;
  }>({
    location: null,
    destination: null,
  });

  // Helper function to update state
  const handleDataUpdate = (data: Partial<typeof addPlaceData>) => {
    setAddPlaceData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="p-6">
      <GetStarted
        location={addPlaceData.location}
        destination={addPlaceData.destination}
        onLocationChange={(location) => handleDataUpdate({ location })}
        onDestinationChange={(destination) =>
          handleDataUpdate({ destination })
        }
        onLocationAddressChange={(homeAddress) =>
          handleDataUpdate({ homeAddress })
        }
        onDestinationAddressChange={(destinationAddress) =>
          handleDataUpdate({ destinationAddress })
        }
      />
    </div>
  );
};

export default MapPage;
