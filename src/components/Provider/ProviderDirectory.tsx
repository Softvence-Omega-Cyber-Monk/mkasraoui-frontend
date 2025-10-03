import {
  CircleDollarSign,
  ListIcon,
  Map,
  MapPin,
  Search,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetProvidersQuery } from "@/redux/features/property/propertyApi";
import PageLoader from "../Shared/PageLoader";
import ProviderDirectoryMap from "./ProviderDirectoryMap";

export default function ProviderDirectory() {
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // ✅ Fetch providers with filters
  const { data, isLoading, error } = useGetProvidersQuery({
    limit: 10,
    page: 1,
    search,
    serviceCategory: category || undefined,
    priceRange: priceRange || undefined,
  });

  // const providers = data?.data?.data ?? [];
  const providers = (data?.data?.data ?? []).filter(
    (provider) => provider.isApproved,
  );

  console.log("all data provider:", providers);

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
              <option value="PHOTOGRAPHY">Photography</option>
              <option value="FOOD_CATERING">Food Catering</option>
              <option value="DECORATION">Decoration</option>
              <option value="MUSIC">Music</option>
            </select>

            {/* Price Range */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto"
            >
              <option value="">All Price Ranges</option>
              <option value="$0-$100">$0 - $100</option>
              <option value="$100-$500">$100 - $500</option>
              <option value="$500-$1000">$500 - $1000</option>
              <option value="$1000+">$1000+</option>
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
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="overflow-hidden rounded-lg border border-[#DFE1E6] bg-white"
                >
                  <div className="p-5 pb-0">
                    <span className="text-secorndary inline-block rounded-lg border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-black">
                      {provider.serviceCategory?.[0] ?? "Unknown"}
                    </span>
                    <div className="float-right flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {/* <span>{provider.avg_ratting ?? 0}</span> */}
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
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4.5 w-4.5" />
                        <span className="text-sm">{provider.serviceArea}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5A5C5F]">
                        <CircleDollarSign className="h-4.5 w-4.5" />
                        <span className="text-base">{provider.priceRange}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 xl:flex-row">
                      <Link
                        to={`/home/provider/${provider.id}`}
                        className="flex-1 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 hover:bg-gray-500 hover:text-white"
                      >
                        View Profile
                      </Link>
                      <Link
                        to={`/home/request-quote?providerId=${provider.id}`}
                        className="hover:bg-secondary-dark flex-1 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center text-black hover:text-white"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            <ProviderDirectoryMap />
          </div>
        )}
      </div>
    </div>
  );
}

// <div className="overflow-hidden rounded-lg bg-white shadow-sm">
//   <div id="map" className="relative h-96 w-full">
//     <iframe
//       src="https://www.openstreetmap.org/export/embed.html?bbox=90.3000%2C23.7000%2C90.5000%2C23.8500&layer=mapnik&marker=23.7800%2C90.4000"
//       width="100%"
//       height="100%"
//       frameBorder="0"
//       style={{ border: 0 }}
//       allowFullScreen
//       title="Dhaka Map"
//     ></iframe>
//   </div>
// </div>
