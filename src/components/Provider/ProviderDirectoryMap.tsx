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
                    <p>Price: {provider.priceRange}</p>
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

/* Google  map Implementation */

// import { useGetProvidersQuery } from "@/redux/features/property/propertyApi";
// import PageLoader from "../Shared/PageLoader";

// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import { useState } from "react";

// const containerStyle = {
//   width: "100%",
//   height: "600px",
//   borderRadius: "12px",
// };

// export default function ProviderDirectoryMap() {
//   const { data, isLoading, error } = useGetProvidersQuery({
//     limit: 50,
//     page: 1,
//   });

//   const providers = (data?.data?.data ?? []).filter(
//     (provider) => provider.isApproved,
//   );

//   // Google Maps loader
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string, // put your API key in .env
//   });

//   const [selectedProvider, setSelectedProvider] = useState<any>(null);

//   if (isLoading)
//     return (
//       <div className="mt-16 p-6 text-center">
//         <PageLoader />
//       </div>
//     );

//   if (error)
//     return (
//       <div className="mt-16 p-6 text-center text-red-500">
//         Failed to load providers.
//       </div>
//     );

//   // Default center (use first provider or fallback)
//   const defaultPosition: google.maps.LatLngLiteral =
//     providers.length > 0
//       ? { lat: providers[0].latitude, lng: providers[0].longitude }
//       : { lat: 0, lng: 0 };

//   return (
//     <div className="mx-auto max-w-7xl">
//       <div className="h-[600px] w-full rounded-lg shadow-lg">
//         {isLoaded ? (
//           <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={defaultPosition}
//             zoom={5}
//           >
//             {providers.map((provider) => (
//               <Marker
//                 key={provider.id}
//                 position={{ lat: provider.latitude, lng: provider.longitude }}
//                 onClick={() => setSelectedProvider(provider)}
//               />
//             ))}

//             {selectedProvider && (
//               <InfoWindow
//                 position={{
//                   lat: selectedProvider.latitude,
//                   lng: selectedProvider.longitude,
//                 }}
//                 onCloseClick={() => setSelectedProvider(null)}
//               >
//                 <div>
//                   <h3 className="font-bold">
//                     {selectedProvider.bussinessName}
//                   </h3>
//                   <p>{selectedProvider.contactName}</p>
//                   <p>{selectedProvider.serviceArea}</p>
//                   <p>Price: {selectedProvider.priceRange}</p>
//                 </div>
//               </InfoWindow>
//             )}
//           </GoogleMap>
//         ) : (
//           <div className="p-6 text-center">Loading map...</div>
//         )}
//       </div>
//     </div>
//   );
// }

/* part-3 */

// import { useGetProvidersQuery } from "@/redux/features/property/propertyApi";
// import PageLoader from "../Shared/PageLoader";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import { useState } from "react";

// // Map container style
// const containerStyle = {
//   width: "100%",
//   height: "600px",
//   borderRadius: "12px",
// };

// // Define provider type (replace with your actual type if available)
// interface Provider {
//   id: string | number;
//   bussinessName: string;
//   contactName: string;
//   serviceArea: string;
//   priceRange: string;
//   latitude: number;
//   longitude: number;
//   isApproved: boolean;
// }

// export default function ProviderDirectoryMap() {
//   const { data, isLoading, error } = useGetProvidersQuery({
//     limit: 50,
//     page: 1,
//   });

//   const providers: Provider[] = (data?.data?.data ?? []).filter(
//     (provider: Provider) => provider.isApproved,
//   );

//   // Google Maps loader
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
//   });

//   const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
//     null,
//   );

//   // Default center (first provider or fallback)
//   const defaultPosition: google.maps.LatLngLiteral =
//     providers.length > 0
//       ? { lat: providers[0].latitude, lng: providers[0].longitude }
//       : { lat: 0, lng: 0 };

//   if (isLoading)
//     return (
//       <div className="mt-16 p-6 text-center">
//         <PageLoader />
//       </div>
//     );

//   if (error)
//     return (
//       <div className="mt-16 p-6 text-center text-red-500">
//         Failed to load providers.
//       </div>
//     );

//   return (
//     <div className="mx-auto max-w-7xl">
//       <div className="h-[600px] w-full rounded-lg shadow-lg">
//         {isLoaded ? (
//           <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={defaultPosition}
//             zoom={5}
//           >
//             {/* Render markers */}
//             {providers.map((provider) => (
//               <Marker
//                 key={provider.id}
//                 position={{ lat: provider.latitude, lng: provider.longitude }}
//                 onClick={() => setSelectedProvider(provider)}
//               />
//             ))}

//             {/* Info window */}
//             {selectedProvider && (
//               <InfoWindow
//                 position={{
//                   lat: selectedProvider.latitude,
//                   lng: selectedProvider.longitude,
//                 }}
//                 onCloseClick={() => setSelectedProvider(null)}
//               >
//                 <div className="p-2">
//                   <h3 className="font-bold">
//                     {selectedProvider.bussinessName}
//                   </h3>
//                   <p>{selectedProvider.contactName}</p>
//                   <p>{selectedProvider.serviceArea}</p>
//                   <p>Price: {selectedProvider.priceRange}</p>
//                 </div>
//               </InfoWindow>
//             )}
//           </GoogleMap>
//         ) : (
//           <div className="p-6 text-center">Loading map...</div>
//         )}
//       </div>
//     </div>
//   );
// }
