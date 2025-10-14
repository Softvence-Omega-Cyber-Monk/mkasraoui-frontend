/* liflet map */

import { useGetProvidersQuery } from "@/redux/features/property/propertyApi";
import PageLoader from "../Shared/PageLoader";

// Leaflet imports
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue in Leaflet
delete (L.Icon.Default as any)._getIconUrl;
(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function ProviderDirectoryMap() {
  const { data, isLoading, error } = useGetProvidersQuery({
    limit: 50,
    page: 1,
  });

  const providers = (data?.data?.data ?? []).filter(
    (provider) => provider.isApproved,
  );

  if (isLoading)
    return (
      <div className="mt-16 p-6 text-center">
        <PageLoader />
      </div>
    );

  if (error)
    return (
      <div className="mt-16 p-6 text-center text-red-500">
        Failed to load providers.
      </div>
    );

  // Default center (optional: first provider or fallback coordinates)
  const defaultPosition: [number, number] =
    providers.length > 0
      ? [providers[0].latitude, providers[0].longitude]
      : [0, 0];

  return (
    <div className="">
      <div className="mx-auto max-w-7xl">
        {/* Map */}
        <div className="h-[600px] w-full rounded-lg shadow-lg">
          <MapContainer
            center={defaultPosition}
            zoom={5}
            scrollWheelZoom={true}
            className="h-full w-full rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {providers.map((provider) => (
              <Marker
                key={provider.id}
                position={[provider.latitude, provider.longitude]}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{provider.bussinessName}</h3>
                    <p>{provider.contactName}</p>
                    <p>{provider.serviceArea}</p>
                    <p>Price: {provider.price}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
