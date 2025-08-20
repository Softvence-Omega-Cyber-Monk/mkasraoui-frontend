import {
  Calendar,
  CircleDollarSign,
  ListIcon,
  Map,
  MapPin,
  Search,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProviderDirectory() {
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");
  const providers = [
    {
      id: 1,
      type: "Baker",
      name: "Sweet Dreams Bakery",
      description:
        "Custom birthday cakes and cupcakes with magical designs that bring your party theme to life.",
      location: "Downtown, NYC",
      availability: "Available weekends",
      price: "$50-200",
      rating: 4.9,
      reviews: 124,
      tags: ["Custom Cakes", "Cupcakes", "Theme Cakes"],
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      type: "Entertainer",
      name: "Giggles The Clown",
      description:
        "Professional children's entertainer with 10+ years experience. Games, jokes, and endless fun!",
      location: "Queens, NYC",
      availability: "Available most days",
      price: "$100-300",
      rating: 4.9,
      reviews: 124,
      tags: ["Clown Shows", "Games", "Comedy"],
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 3,
      type: "Baker",
      name: "Superhero Academy",
      description:
        "Real-life superhero character visits! Interactive training sessions and photo opportunities.",
      location: "Manhattan, NYC",
      availability: "Available weekends",
      price: "$200-500",
      rating: 4.9,
      reviews: 124,
      tags: ["Custom Cakes", "Cupcakes", "Theme Cakes"],
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 4,
      type: "Baker",
      name: "Princess Palace",
      description:
        "Princess character visits with storytelling, singing, and royal makeovers for little ones.",
      location: "Downtown, NYC",
      availability: "Available weekends",
      price: "$50-200",
      rating: 4.9,
      reviews: 124,
      tags: ["Custom Cakes", "Cupcakes", "Theme Cakes"],
      image:
        "https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 5,
      type: "Entertainer",
      name: "Artistic Treats",
      description:
        "Princess character visits with storytelling, singing, and royal makeovers for little ones.",
      location: "Queens, NYC",
      availability: "Available most days",
      price: "$100-300",
      rating: 4.9,
      reviews: 124,
      tags: ["Clown Shows", "Games", "Comedy"],
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 6,
      type: "Baker",
      name: "Sweet Dreams Bakery",
      description:
        "Custom birthday cakes and cupcakes with magical designs that bring your party theme to life.",
      location: "Downtown, NYC",
      availability: "Available weekends",
      price: "$50-200",
      rating: 4.9,
      reviews: 124,
      tags: ["Custom Cakes", "Cupcakes", "Theme Cakes"],
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
  ];

  return (
    <div className="mt-16 min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Search Header */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative w-full md:flex-1">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search providers, services, or specialties..."
                className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <select className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto">
              <option>All Categories</option>
            </select>

            <select className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto">
              <option>All Locations</option>
            </select>

            <select className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto">
              <option>All Price Ranges</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
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

        {/* Conditional Content */}
        {activeTab === "list" ? (
          <>
            {/* Provider Cards Grid */}
            <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="overflow-hidden rounded-lg border border-[#DFE1E6] bg-white"
                >
                  <div className="p-5 pb-0">
                    <span className="text-secorndary bg-secondary inline-block rounded-lg px-3 py-1 text-sm text-white">
                      {provider.type}
                    </span>
                    <div className="float-right flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{provider.rating}</span>
                      <span className="text-gray-500">
                        ({provider.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-5 flex items-center gap-3">
                      <img
                        src={provider.image}
                        alt={provider.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {provider.name}
                      </h3>
                    </div>
                    <p className="mb-4 text-xs leading-relaxed text-[#5A5C5F]">
                      {provider.description}
                    </p>
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4.5 w-4.5" />
                        <span className="text-sm">{provider.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5A5C5F]">
                        <Calendar className="h-4.5 w-4.5" />
                        <span className="text-sm">{provider.availability}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5A5C5F]">
                        <CircleDollarSign className="h-4.5 w-4.5" />
                        <span className="text-base">{provider.price}</span>
                      </div>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {provider.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-[#DFE1E6] bg-white px-2 py-1 text-xs text-[#191919]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-col gap-3 xl:flex-row">
                      <Link
                        to={"/home/provider/1"}
                        className="flex-1 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
                      >
                        View Profile
                      </Link>
                      <Link
                        to={"/home/request-quote"}
                        className="bg-secondary hover:bg-secondary-dark flex-1 cursor-pointer rounded-lg px-4 py-2 text-center text-white"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-right">
              <button className="border-secondary text-secondary cursor-pointer rounded-lg border px-6 py-3 hover:bg-gray-50">
                View All
              </button>
            </div>
          </>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div id="map" className="relative h-96 w-full">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=90.3000%2C23.7000%2C90.5000%2C23.8500&layer=mapnik&marker=23.7800%2C90.4000"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
                title="Dhaka Map"
              ></iframe>

             
              {/* Map controls */}
              <div className="absolute top-4 right-4 space-y-2">
                <button className="rounded-lg bg-white p-2 shadow-lg hover:bg-gray-50">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </button>
                <button className="rounded-lg bg-white p-2 shadow-lg hover:bg-gray-50">
                  <Search className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

           
          </div>
        )}
      </div>
    </div>
  );
}
