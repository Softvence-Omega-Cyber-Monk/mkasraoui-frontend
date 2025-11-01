import { ListIcon, Map, MapPin, Search, Star } from "lucide-react";
import { HiOutlineCurrencyEuro } from "react-icons/hi";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetProvidersQuery } from "@/redux/features/property/propertyApi";
import PageLoader from "../Shared/PageLoader";
import ProviderDirectoryMap from "./ProviderDirectoryMap";
import { IoCalendarClearOutline } from "react-icons/io5";

export default function ProviderDirectory() {
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [rating, setRating] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(6); // default visible providers

  // Fetch providers
  const { data, isLoading, error } = useGetProvidersQuery({
    limit: 100000, // fetch enough data for frontend filtering
    page: 1,
    search,
    serviceCategory: category || undefined,
  });
  console.log("procxgfdfgsdfgdfsgdf", data);
  // Extract unique categories dynamically
  useEffect(() => {
    if (data?.data?.data) {
      const uniqueCategories = Array.from(
        new Set(
          data.data.data
            .map((provider: any) => provider.serviceCategory)
            .flat(),
        ),
      );
      setCategories(uniqueCategories);
    }
  }, [data]);

  // Frontend filters: approved providers
  let providers = (data?.data?.data ?? []).filter(
    (provider) => provider.isApproved,
  );

  // Frontend filter: rating
  if (rating) {
    const minRating = parseFloat(rating);
    providers = providers.filter(
      (provider) => (provider.avg_ratting ?? 0) >= minRating,
    );
  }

  // Frontend filter: price
  if (priceRange) {
    const [minPriceStr, maxPriceStr] = priceRange.split("-");
    const minPrice = parseFloat(minPriceStr);
    const maxPrice = parseFloat(maxPriceStr);
    providers = providers.filter(
      (provider) => provider.price >= minPrice && provider.price <= maxPrice,
    );
  }

  if (isLoading) {
    return (
      <div className="mt-16 p-6 text-center">
        <PageLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 p-6 text-center text-red-500">
        Failed to load providers.
      </div>
    );
  }

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 6); // load 6 more on click
  };

  return (
    <div className="mt-16 min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Search + Filters */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search providers, services, or specialties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Service Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace("_", " ")}
                </option>
              ))}
            </select>

            {/* Price Range Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto"
            >
              <option value="">All Prices</option>
              <option value="0-100">0 - 100</option>
              <option value="101-200">101 - 200</option>
              <option value="201-300">201 - 300</option>
              <option value="301-500">301 - 500</option>
            </select>

            {/* Rating Filter */}
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto"
            >
              <option value="">All Ratings</option>
              <option value="1">1+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
        </div>

        {/* Toggle List / Map */}
        <div className="mb-6 flex justify-end">
          <div className="flex rounded-lg bg-white shadow-sm">
            <button
              onClick={() => setActiveTab("list")}
              className={`flex cursor-pointer items-center gap-2 rounded-l-lg px-4 py-2 ${
                activeTab === "list"
                  ? "bg-secondary text-white"
                  : "text-gray-600"
              }`}
            >
              <ListIcon className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`flex cursor-pointer items-center gap-2 rounded-r-lg px-4 py-2 ${
                activeTab === "map"
                  ? "bg-secondary text-white"
                  : "text-gray-600"
              }`}
            >
              <Map className="h-4 w-4" />
              Map
            </button>
          </div>
        </div>

        {/* Conditional View */}
        {activeTab === "list" ? (
          <>
            <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {providers.slice(0, visibleCount).map((provider) => (
                <div
                  key={provider.id}
                  className="overflow-hidden rounded-lg border border-[#DFE1E6] bg-white"
                >
                  <div className="p-5 pb-0">
                    <span className="text-secorndary inline-block rounded-xl border border-gray-300 bg-[#223B7D] px-3 py-1 text-sm text-white">
                      {provider.serviceCategory?.[0] ?? "Unknown"}
                    </span>
                    <div className="float-right flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{(provider.avg_ratting ?? 0).toFixed(1)}</span>
                      <span className="text-gray-500">
                        ({provider.total_review ?? 0})
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-5 flex items-center gap-3">
                      <img
                        src={
                          provider.portfolioImages?.[0] ??
                          "https://via.placeholder.com/150"
                        }
                        alt={provider.bussinessName}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {provider.bussinessName}
                      </h3>
                    </div>

                    <p className="mb-4 text-xs leading-relaxed text-[#5A5C5F]">
                      {provider.description.split(" ").slice(0, 20).join(" ")}
                    </p>
                    <div className="mb-4 space-y-2">
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="h-5 w-5" />
                        <span className="text-sm">
                          {provider.serviceArea
                            ?.split(" ")
                            .slice(0, 5) // take first 4 words
                            .join(" ")}
                          {provider.serviceArea?.split(" ").length > 4
                            ? "..."
                            : ""}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <IoCalendarClearOutline className="h-5 w-5" />
                        <span className="text-sm">
                          {provider.createdAt
                            ?.split(" ")
                            .slice(0, 1) // take first 4 words
                            .join(" ")}
                          {provider.createdAt?.split(" ").length > 2
                            ? "..."
                            : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[#5A5C5F]">
                        <HiOutlineCurrencyEuro className="h-5 w-5" />
                        <span className="text-base"> € {provider.price}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 xl:flex-row">
                      <Link
                        to={`/home/provider/${provider.id}`}
                        className="hover:bg-secondary-dark inline-block w-full cursor-pointer rounded-lg border bg-white px-4 py-3 text-center font-medium text-[#223B7D] transition-colors hover:text-white"
                      >
                        View Profile
                      </Link>
                      <Link
                        to={`/home/request-quote?providerId=${provider.id}`}
                        className="bg-secondary hover:bg-secondary-dark inline-block w-full cursor-pointer rounded-lg px-4 py-3 text-center font-medium text-white transition-colors"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < providers.length && (
              <div className="flex justify-end">
                <button
                  onClick={handleSeeMore}
                  className="cursor-pointer rounded-lg bg-[#223B7D] px-6 py-3 text-white transition-colors hover:bg-[#07194b]"
                >
                  View More
                </button>
              </div>
            )}
          </>
        ) : (
          <ProviderDirectoryMap />
        )}
      </div>
    </div>
  );
}

// import {
//   CircleDollarSign,
//   ListIcon,
//   Map,
//   MapPin,
//   Search,
//   Star,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useGetProvidersQuery } from "@/redux/features/property/propertyApi";
// import PageLoader from "../Shared/PageLoader";
// import ProviderDirectoryMap from "./ProviderDirectoryMap";

// export default function ProviderDirectory() {
//   const [activeTab, setActiveTab] = useState<"list" | "map">("list");
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   const [price] = useState("");

//   const [categories, setCategories] = useState<string[]>([]);

//   // ✅ Fetch providers with filters
//   const { data, isLoading, error } = useGetProvidersQuery({
//     limit: 10,
//     page: 1,
//     search,
//     serviceCategory: category || undefined,
//     price: price || undefined,
//   });

//   // Extract unique categories dynamically
//   useEffect(() => {
//     if (data?.data?.data) {
//       const uniqueCategories = Array.from(
//         new Set(
//           data.data.data
//             .map((provider: any) => provider.serviceCategory)
//             .flat(),
//         ),
//       );
//       setCategories(uniqueCategories);
//     }
//   }, [data]);

//   // const providers = data?.data?.data ?? [];
//   const providers = (data?.data?.data ?? []).filter(
//     (provider) => provider.isApproved,
//   );

//   console.log("all data provider:", providers);

//   if (isLoading) {
//     return (
//       <div className="mt-16 p-6 text-center">
//         <PageLoader />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mt-16 p-6 text-center text-red-500">
//         Failed to load providers.
//       </div>
//     );
//   }

//   return (
//     <div className="mt-16 min-h-screen p-6">
//       <div className="mx-auto max-w-7xl">
//         {/* Search + Filters */}
//         <div className="mb-6 rounded-lg bg-white p-4 shadow-sm sm:p-6">
//           <div className="flex flex-col gap-4 md:flex-row md:items-center">
//             {/* Search Input */}
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

//             {/* Service Category */}

//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto"
//             >
//               <option value="">All Categories</option>
//               {categories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat.replace("_", " ")}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Toggle List / Map */}
//         <div className="mb-6 flex justify-end">
//           <div className="flex rounded-lg bg-white shadow-sm">
//             <button
//               onClick={() => setActiveTab("list")}
//               className={`flex cursor-pointer items-center gap-2 rounded-l-lg px-4 py-2 ${
//                 activeTab === "list"
//                   ? "bg-secondary text-white"
//                   : "text-gray-600"
//               }`}
//             >
//               <ListIcon className="h-4 w-4" />
//               List
//             </button>
//             <button
//               onClick={() => setActiveTab("map")}
//               className={`flex cursor-pointer items-center gap-2 rounded-r-lg px-4 py-2 ${
//                 activeTab === "map"
//                   ? "bg-secondary text-white"
//                   : "text-gray-600"
//               }`}
//             >
//               <Map className="h-4 w-4" />
//               Map
//             </button>
//           </div>
//         </div>

//         {/* Conditional View */}
//         {activeTab === "list" ? (
//           <>
//             <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {providers.map((provider) => (
//                 <div
//                   key={provider.id}
//                   className="overflow-hidden rounded-lg border border-[#DFE1E6] bg-white"
//                 >
//                   <div className="p-5 pb-0">
//                     <span className="text-secorndary inline-block rounded-lg border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-black">
//                       {provider.serviceCategory?.[0] ?? "Unknown"}
//                     </span>
//                     <div className="float-right flex items-center gap-1">
//                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       {/* <span>{provider.avg_ratting ?? 0}</span> */}
//                       <span>{(provider.avg_ratting ?? 0).toFixed(1)}</span>
//                       <span className="text-gray-500">
//                         ({provider.total_review ?? 0})
//                       </span>
//                     </div>
//                   </div>

//                   <div className="p-5">
//                     <div className="mb-5 flex items-center gap-3">
//                       <img
//                         src={
//                           provider.portfolioImages?.[0] ??
//                           "https://via.placeholder.com/150"
//                         }
//                         alt={provider.bussinessName}
//                         className="h-12 w-12 rounded-lg object-cover"
//                       />
//                       <h3 className="text-2xl font-semibold text-gray-900">
//                         {provider.bussinessName}
//                       </h3>
//                     </div>

//                     <p className="mb-4 text-xs leading-relaxed text-[#5A5C5F]">
//                       {provider.description.split(" ").slice(0, 20).join(" ")}
//                     </p>
//                     <div className="mb-4 space-y-2">
//                       <div className="flex items-center gap-2 text-gray-600">
//                         <MapPin className="h-4.5 w-4.5" />
//                         <span className="text-sm">{provider.serviceArea}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-[#5A5C5F]">
//                         <CircleDollarSign className="h-4.5 w-4.5" />
//                         <span className="text-base">{provider.price}</span>
//                       </div>
//                     </div>
//                     <div className="flex flex-col gap-3 xl:flex-row">
//                       <Link
//                         to={`/home/provider/${provider.id}`}
//                         className="flex-1 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 hover:bg-gray-500 hover:text-white"
//                       >
//                         View Profile
//                       </Link>
//                       <Link
//                         to={`/home/request-quote?providerId=${provider.id}`}
//                         className="hover:bg-secondary-dark flex-1 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center text-black hover:text-white"
//                       >
//                         Request Quote
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <div>
//             <ProviderDirectoryMap />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
