"use client";

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

// "use client";

// import { useState } from "react";
// import { Search } from "lucide-react";
// import { useGetProvidersQuery } from "@/redux/features/property/propertyApi";
// import PageLoader from "../Shared/PageLoader";

// // Leaflet imports
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Fix default icon issue in Leaflet
// delete (L.Icon.Default as any)._getIconUrl;
// (L.Icon.Default as any).mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// export default function ProviderDirectoryMap() {
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   const [priceRange, setPriceRange] = useState("");

//   const { data, isLoading, error } = useGetProvidersQuery({
//     limit: 10,
//     page: 1,
//     search,
//     serviceCategory: category || undefined,
//     priceRange: priceRange || undefined,
//   });

//   const providers = (data?.data?.data ?? []).filter(
//     (provider) => provider.isApproved,
//   );

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

//   // Default center (optional: first provider or fallback coordinates)
//   const defaultPosition: [number, number] =
//     providers.length > 0
//       ? [providers[0].latitude, providers[0].longitude]
//       : [0, 0];

//   return (
//     <div className="mt-16 min-h-screen p-6">
//       <div className="mx-auto max-w-7xl">
//         {/* Search + Filters */}
//         <div className="mb-6 rounded-lg bg-white p-4 shadow-sm sm:p-6">
//           <div className="flex flex-col gap-4 md:flex-row md:items-center">
//             <div className="relative w-full md:flex-1">
//               <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search providers, services, or specialties..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//             </div>

//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto"
//             >
//               <option value="">All Categories</option>
//               <option value="PHOTOGRAPHY">Photography</option>
//               <option value="FOOD_CATERING">Food Catering</option>
//               <option value="DECORATION">Decoration</option>
//               <option value="MUSIC">Music</option>
//             </select>

//             <select
//               value={priceRange}
//               onChange={(e) => setPriceRange(e.target.value)}
//               className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto"
//             >
//               <option value="">All Price Ranges</option>
//               <option value="1000-5000">1000-5000</option>
//               <option value="5000-10000">5000-10000</option>
//               <option value="10000-30000">10000-30000</option>
//             </select>
//           </div>
//         </div>

//         {/* Map */}
//         <div className="h-[600px] w-full rounded-lg shadow-lg">
//           <MapContainer
//             center={defaultPosition}
//             zoom={5}
//             scrollWheelZoom={true}
//             className="h-full w-full rounded-lg"
//           >
//             <TileLayer
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             {providers.map((provider) => (
//               <Marker
//                 key={provider.id}
//                 position={[provider.latitude, provider.longitude]}
//               >
//                 <Popup>
//                   <div>
//                     <h3 className="font-bold">{provider.bussinessName}</h3>
//                     <p>{provider.contactName}</p>
//                     <p>{provider.serviceArea}</p>
//                     <p>Price: {provider.priceRange}</p>
//                   </div>
//                 </Popup>
//               </Marker>
//             ))}
//           </MapContainer>
//         </div>
//       </div>
//     </div>
//   );
// }
