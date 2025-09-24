// src/Pages/ProviderDetails.tsx
import {
  ArrowLeft,
  CircleDollarSign,
  Clock,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useGetProviderByIdQuery } from "@/redux/features/property/propertyApi";
import PageLoader from "@/components/Shared/PageLoader";

export default function ProviderDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: provider, isLoading, error } = useGetProviderByIdQuery(id!);

  if (isLoading) {
    return (
      <div className="mt-16 p-6 text-center">
        <PageLoader />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="mt-16 p-6 text-center text-red-500">
        Failed to load provider details.
      </div>
    );
  }

  // Fallback arrays
  const serviceCategories = provider.serviceCategory || [];
  const portfolioImages = provider.portfolioImages || [];
  const reviews = provider.reviews || [];

  return (
    <div className="container mx-auto px-4 py-6 xl:px-0">
      {/* Header */}
      <header className="my-8">
        <Link to="/home/providers" className="flex items-center gap-2">
          <ArrowLeft />
          Back to Providers
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header Card */}
          <div className="border-border-primary rounded-lg border bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="bg-secondary mb-4 inline-block rounded-md px-3 py-1 text-xs text-white">
                  {serviceCategories[0] ?? "Unknown"}
                </div>
                <h1 className="mb-4 text-3xl font-bold text-black">
                  {provider.bussinessName ?? "N/A"}
                </h1>
                <div className="text-body mb-4 flex items-center">
                  <MapPin className="mr-2 h-4.5 w-4.5 text-sm" />
                  <span>{provider.serviceArea ?? "N/A"}</span>
                </div>
                <div className="text-body mb-4 flex items-center">
                  <CircleDollarSign className="mr-2 h-4.5 w-4.5" />
                  <span className="text-base font-semibold">
                    {provider.priceRange ?? "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-28">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-current text-yellow-400" />
                  <span className="ml-1">{provider.avg_ratting ?? 0}</span>
                  <span className="ml-1 text-gray-500">
                    ({provider.total_review ?? 0})
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Available weekends</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {serviceCategories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* About Our Services */}
          <div className="border-border-primary rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold text-black">
              About Our Services
            </h2>
            <p className="text-body space-y-4 font-normal">
              {provider.description ?? "No description available."}
            </p>
          </div>

          {/* Portfolio */}
          {portfolioImages.length > 0 && (
            <div className="border-border-primary rounded-lg border bg-white p-6">
              <h2 className="mb-4 text-2xl font-bold text-black">Portfolio</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {portfolioImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square overflow-hidden rounded-lg bg-gray-200"
                  >
                    <img
                      src={img}
                      alt={`Portfolio ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-black">Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-4"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-black">
                        {provider.contactName ?? "Anonymous"}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <div className="mb-4 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (review.rating ?? 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">
                      {review.description ?? "No review text."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Get a Quote */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-black">Get a Quote</h2>
            <Link
              to={`/home/request-quote?providerId=${provider.id}`}
              className="bg-secondary hover:bg-secondary-dark mb-4 inline-block w-full cursor-pointer rounded-lg px-4 py-3 text-center font-medium text-white transition-colors"
            >
              Request Quote
            </Link>
          </div>

          {/* Contact Info */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-black">
              Contact Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Phone className="mr-3 h-4 w-4" />
                <span>{provider.phone ?? "N/A"}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Mail className="mr-3 h-4 w-4" />
                <span>{provider.email ?? "N/A"}</span>
              </div>
              {provider.website && (
                <div className="flex items-center text-gray-700">
                  <Globe className="mr-3 h-4 w-4" />
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              {provider.instagram && (
                <div className="flex items-center text-gray-700">
                  <Instagram className="mr-3 h-4 w-4" />
                  <a
                    href={provider.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    @{provider.bussinessName}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          {provider.latitude && provider.longitude && (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-black">Map</h2>
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${provider.longitude - 0.01}%2C${provider.latitude - 0.01}%2C${provider.longitude + 0.01}%2C${provider.latitude + 0.01}&layer=mapnik&marker=${provider.latitude}%2C${provider.longitude}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen
                  title={provider.bussinessName ?? "Provider Location"}
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// // src/Pages/ProviderDetails.tsx
// import {
//   ArrowLeft,
//   CircleDollarSign,
//   Clock,
//   Globe,
//   Instagram,
//   Mail,
//   MapPin,
//   Phone,
//   Star,
// } from "lucide-react";
// import { Link, useParams } from "react-router-dom";
// import { useGetProviderByIdQuery } from "@/redux/features/property/propertyApi";
// import PageLoader from "@/components/Shared/PageLoader";
// import type { Provider } from "@/redux/types/property.type";

// export default function ProviderDetails() {
//   const { id } = useParams<{ id: string }>();
//   const { data, isLoading, error } = useGetProviderByIdQuery(id!);

//   if (isLoading) {
//     return (
//       <div className="mt-16 p-6 text-center">
//         <PageLoader />
//       </div>
//     );
//   }

//   if (error || !data?.data) {
//     return (
//       <div className="mt-16 p-6 text-center text-red-500">
//         Failed to load provider details.
//       </div>
//     );
//   }

//   const provider: Provider = data!;

//   // Fallback arrays to avoid map errors
//   const serviceCategories = provider.serviceCategory || [];
//   const portfolioImages = provider.portfolioImages || [];
//   const reviews = provider.reviews || [];

//   return (
//     <div className="container mx-auto px-4 py-6 xl:px-0">
//       {/* Header */}
//       <header className="my-8">
//         <Link to="/home/providers" className="flex items-center gap-2">
//           <ArrowLeft />
//           Back to Providers
//         </Link>
//       </header>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* Left Column */}
//         <div className="space-y-6 lg:col-span-2">
//           {/* Header Card */}
//           <div className="border-border-primary rounded-lg border bg-white p-6">
//             <div className="mb-4 flex items-start justify-between">
//               <div>
//                 <div className="bg-secondary mb-4 inline-block rounded-md px-3 py-1 text-xs text-white">
//                   {serviceCategories[0] ?? "Unknown"}
//                 </div>
//                 <h1 className="mb-4 text-3xl font-bold text-black">
//                   {provider.bussinessName ?? "N/A"}
//                 </h1>
//                 <div className="text-body mb-4 flex items-center">
//                   <MapPin className="mr-2 h-4.5 w-4.5 text-sm" />
//                   <span>{provider.serviceArea ?? "N/A"}</span>
//                 </div>
//                 <div className="text-body mb-4 flex items-center">
//                   <CircleDollarSign className="mr-2 h-4.5 w-4.5" />
//                   <span className="text-base font-semibold">
//                     {provider.priceRange ?? "N/A"}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex flex-col items-end gap-28">
//                 <div className="flex items-center">
//                   <Star className="h-5 w-5 fill-current text-yellow-400" />
//                   <span className="ml-1">{provider.avg_ratting ?? 0}</span>
//                   <span className="ml-1 text-gray-500">
//                     ({provider.total_review ?? 0})
//                   </span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <Clock className="mr-2 h-4 w-4" />
//                   <span>Available weekends</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               {serviceCategories.map((cat) => (
//                 <span
//                   key={cat}
//                   className="rounded-full bg-gray-100 px-3 py-1 text-sm"
//                 >
//                   {cat}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* About Our Services */}
//           <div className="border-border-primary rounded-lg border bg-white p-6">
//             <h2 className="mb-4 text-2xl font-bold text-black">
//               About Our Services
//             </h2>
//             <p className="text-body space-y-4 font-normal">
//               {provider.description ?? "No description available."}
//             </p>
//           </div>

//           {/* Portfolio */}
//           {portfolioImages.length > 0 && (
//             <div className="border-border-primary rounded-lg border bg-white p-6">
//               <h2 className="mb-4 text-2xl font-bold text-black">Portfolio</h2>
//               <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//                 {portfolioImages.map((img, idx) => (
//                   <div
//                     key={idx}
//                     className="aspect-square overflow-hidden rounded-lg bg-gray-200"
//                   >
//                     <img
//                       src={img}
//                       alt={`Portfolio ${idx + 1}`}
//                       className="h-full w-full object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Reviews */}
//           {reviews.length > 0 && (
//             <div className="rounded-lg bg-white p-6 shadow-sm">
//               <h2 className="mb-4 text-2xl font-bold text-black">Reviews</h2>
//               <div className="space-y-4">
//                 {reviews.map((review) => (
//                   <div
//                     key={review.id}
//                     className="border-b border-gray-200 pb-4"
//                   >
//                     <div className="mb-1 flex items-center justify-between">
//                       <h3 className="text-lg font-medium text-black">
//                         {provider.contactName ?? "Anonymous"}
//                       </h3>
//                       <span className="text-sm text-gray-500">
//                         {review.createdAt
//                           ? new Date(review.createdAt).toLocaleDateString()
//                           : ""}
//                       </span>
//                     </div>
//                     <div className="mb-4 flex">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <Star
//                           key={star}
//                           className={`h-4 w-4 ${
//                             star <= (review.rating ?? 0)
//                               ? "fill-yellow-400 text-yellow-400"
//                               : "text-gray-300"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <p className="text-gray-700">
//                       {review.description ?? "No review text."}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Column - Sidebar */}
//         <div className="space-y-6">
//           {/* Get a Quote */}
//           <div className="rounded-lg bg-white p-6 shadow-sm">
//             <h2 className="mb-4 text-2xl font-bold text-black">Get a Quote</h2>
//             <Link
//               to={`/home/request-quote?providerId=${provider.id}`}
//               className="bg-secondary hover:bg-secondary-dark mb-4 inline-block w-full cursor-pointer rounded-lg px-4 py-3 text-center font-medium text-white transition-colors"
//             >
//               Request Quote
//             </Link>
//           </div>

//           {/* Contact Info */}
//           <div className="rounded-lg bg-white p-6 shadow-sm">
//             <h2 className="mb-4 text-2xl font-bold text-black">
//               Contact Information
//             </h2>
//             <div className="space-y-3">
//               <div className="flex items-center text-gray-700">
//                 <Phone className="mr-3 h-4 w-4" />
//                 <span>{provider.phone ?? "N/A"}</span>
//               </div>
//               <div className="flex items-center text-gray-700">
//                 <Mail className="mr-3 h-4 w-4" />
//                 <span>{provider.email ?? "N/A"}</span>
//               </div>
//               {provider.website && (
//                 <div className="flex items-center text-gray-700">
//                   <Globe className="mr-3 h-4 w-4" />
//                   <a
//                     href={provider.website}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500"
//                   >
//                     Visit Website
//                   </a>
//                 </div>
//               )}
//               {provider.instagram && (
//                 <div className="flex items-center text-gray-700">
//                   <Instagram className="mr-3 h-4 w-4" />
//                   <a
//                     href={provider.instagram}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500"
//                   >
//                     @{provider.bussinessName}
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Map */}
//           {provider.latitude && provider.longitude && (
//             <div className="rounded-lg bg-white p-6 shadow-sm">
//               <h2 className="mb-4 text-2xl font-bold text-black">Map</h2>
//               <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
//                 <iframe
//                   src={`https://www.openstreetmap.org/export/embed.html?bbox=${provider.longitude - 0.01}%2C${provider.latitude - 0.01}%2C${provider.longitude + 0.01}%2C${provider.latitude + 0.01}&layer=mapnik&marker=${provider.latitude}%2C${provider.longitude}`}
//                   width="100%"
//                   height="100%"
//                   frameBorder="0"
//                   style={{ border: 0 }}
//                   allowFullScreen
//                   title={provider.bussinessName ?? "Provider Location"}
//                 ></iframe>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// import {
//   ArrowLeft,
//   CircleDollarSign,
//   Clock,
//   Globe,
//   Instagram,
//   Mail,
//   MapPin,
//   Phone,
//   Star,
// } from "lucide-react";
// import { Link, useParams } from "react-router-dom";
// import { useGetProviderByIdQuery } from "@/redux/features/property/propertyApi";
// import PageLoader from "@/components/Shared/PageLoader";

// export default function ProviderDetails() {
//   const { id } = useParams<{ id: string }>();

//   const { data, isLoading, error } = useGetProviderByIdQuery(id!);

//   if (isLoading) {
//     return (
//       <div className="mt-16 p-6 text-center">
//         <PageLoader />
//       </div>
//     );
//   }

//   if (error || !data?.data) {
//     return (
//       <div className="mt-16 p-6 text-center text-red-500">
//         Failed to load provider details.
//       </div>
//     );
//   }

//   const provider = data.data;

//   return (
//     <div className="container mx-auto px-4 py-6 xl:px-0">
//       <header className="my-8">
//         <Link to={"/home/providers"} className="flex items-center gap-2">
//           <ArrowLeft />
//           Back to Providers
//         </Link>
//       </header>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* Left Column */}
//         <div className="space-y-6 lg:col-span-2">
//           {/* Header Card */}
//           <div className="border-border-primary rounded-lg border bg-white p-6">
//             <div className="mb-4 flex items-start justify-between">
//               <div>
//                 <div className="bg-secondary mb-4 inline-block rounded-md px-3 py-1 text-xs text-white">
//                   {provider.serviceCategory?.[0] ?? "Unknown"}
//                 </div>
//                 <h1 className="mb-4 text-3xl font-bold text-black">
//                   {provider.bussinessName}
//                 </h1>
//                 <div className="text-body mb-4 flex items-center">
//                   <MapPin className="mr-2 h-4.5 w-4.5 text-sm" />
//                   <span>{provider.serviceArea}</span>
//                 </div>
//                 <div className="text-body mb-4 flex items-center">
//                   <CircleDollarSign className="mr-2 h-4.5 w-4.5" />
//                   <span className="text-base font-semibold">
//                     {provider.priceRange}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex flex-col items-end gap-28">
//                 <div className="flex items-center">
//                   <Star className="h-5 w-5 fill-current text-yellow-400" />
//                   <span className="ml-1">{provider.avg_ratting}</span>
//                   <span className="ml-1 text-gray-500">
//                     ({provider.total_review})
//                   </span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <Clock className="mr-2 h-4 w-4" />
//                   <span>Available weekends</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               {provider.serviceCategory.map((cat) => (
//                 <span
//                   key={cat}
//                   className="rounded-full bg-gray-100 px-3 py-1 text-sm"
//                 >
//                   {cat}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* About Our Services */}
//           <div className="border-border-primary rounded-lg border bg-white p-6">
//             <h2 className="mb-4 text-2xl font-bold text-black">
//               About Our Services
//             </h2>
//             <p className="text-body space-y-4 font-normal">
//               {provider.description}
//             </p>
//           </div>

//           {/* Portfolio */}
//           {provider.portfolioImages && provider.portfolioImages.length > 0 && (
//             <div className="border-border-primary rounded-lg border bg-white p-6">
//               <h2 className="mb-4 text-2xl font-bold text-black">Portfolio</h2>
//               <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//                 {provider.portfolioImages.map((img, idx) => (
//                   <div
//                     key={idx}
//                     className="aspect-square overflow-hidden rounded-lg bg-gray-200"
//                   >
//                     <img
//                       src={img}
//                       alt={`Portfolio ${idx + 1}`}
//                       className="h-full w-full object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Reviews */}
//           {provider.reviews && provider.reviews.length > 0 && (
//             <div className="rounded-lg bg-white p-6 shadow-sm">
//               <h2 className="mb-4 text-2xl font-bold text-black">Reviews</h2>
//               <div className="space-y-4">
//                 {provider.reviews.map((review) => (
//                   <div
//                     key={review.id}
//                     className="border-b border-gray-200 pb-4"
//                   >
//                     <div className="mb-1 flex items-center justify-between">
//                       <h3 className="text-lg font-medium text-black">
//                         {provider.contactName}
//                       </h3>
//                       <span className="text-sm text-gray-500">
//                         {new Date(review.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                     <div className="mb-4 flex">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <Star
//                           key={star}
//                           className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
//                         />
//                       ))}
//                     </div>
//                     <p className="text-gray-700">{review.description}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Column - Sidebar */}
//         <div className="space-y-6">
//           {/* Get a Quote */}
//           <div className="rounded-lg bg-white p-6 shadow-sm">
//             <h2 className="mb-4 text-2xl font-bold text-black">Get a Quote</h2>
//             <Link
//               to={`/home/request-quote?providerId=${provider.id}`}
//               className="bg-secondary hover:bg-secondary-dark mb-4 inline-block w-full cursor-pointer rounded-lg px-4 py-3 text-center font-medium text-white transition-colors"
//             >
//               Request Quote
//             </Link>
//           </div>

//           {/* Contact Info */}
//           <div className="rounded-lg bg-white p-6 shadow-sm">
//             <h2 className="mb-4 text-2xl font-bold text-black">
//               Contact Information
//             </h2>
//             <div className="space-y-3">
//               <div className="flex items-center text-gray-700">
//                 <Phone className="mr-3 h-4 w-4" />
//                 <span>{provider.phone}</span>
//               </div>
//               <div className="flex items-center text-gray-700">
//                 <Mail className="mr-3 h-4 w-4" />
//                 <span>{provider.email}</span>
//               </div>
//               {provider.website && (
//                 <div className="flex items-center text-gray-700">
//                   <Globe className="mr-3 h-4 w-4" />
//                   <a
//                     href={provider.website}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500"
//                   >
//                     Visit Website
//                   </a>
//                 </div>
//               )}
//               {provider.instagram && (
//                 <div className="flex items-center text-gray-700">
//                   <Instagram className="mr-3 h-4 w-4" />
//                   <a
//                     href={provider.instagram}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500"
//                   >
//                     @{provider.bussinessName}
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Map */}
//           <div className="rounded-lg bg-white p-6 shadow-sm">
//             <h2 className="mb-4 text-2xl font-bold text-black">Map</h2>
//             <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
//               <iframe
//                 src={`https://www.openstreetmap.org/export/embed.html?bbox=${provider.longitude - 0.01}%2C${provider.latitude - 0.01}%2C${provider.longitude + 0.01}%2C${provider.latitude + 0.01}&layer=mapnik&marker=${provider.latitude}%2C${provider.longitude}`}
//                 width="100%"
//                 height="100%"
//                 frameBorder="0"
//                 style={{ border: 0 }}
//                 allowFullScreen
//                 title={provider.bussinessName}
//               ></iframe>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import {
//   ArrowLeft,
//   CircleDollarSign,
//   Clock,
//   Globe,
//   Instagram,
//   Mail,
//   MapPin,
//   Phone,
//   Star,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function ProviderDetails() {
//   return (
//     <div className="container mx-auto px-4 py-6 xl:px-0">
//       <header className="my-8">
//         <Link to={"/home/providers"} className="flex items-center gap-2">
//           <ArrowLeft />
//           Back to Providers
//         </Link>
//       </header>
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* Left Column - Main Content */}
//         <div className="space-y-6 lg:col-span-2">
//           {/* Header Card */}
//           <div className="border-border-primary rounded-lg border bg-white p-6">
//             <div className="mb-4 flex items-start justify-between">
//               <div>
//                 <div className="bg-secondary mb-4 inline-block rounded-md px-3 py-1 text-xs text-white">
//                   Baker
//                 </div>
//                 <h1 className="mb-4 text-3xl font-bold text-black">
//                   Sweet Dreams Bakery
//                 </h1>
//                 <div className="text-body mb-4 flex items-center">
//                   <MapPin className="mr-2 h-4.5 w-4.5 text-sm" />
//                   <span>Downtown, NYC</span>
//                 </div>
//                 <div className="text-body mb-4 flex items-center">
//                   <CircleDollarSign className="mr-2 h-4.5 w-4.5" />
//                   <span className="text-base font-semibold">50-200</span>
//                 </div>
//               </div>
//               <div className="flex flex-col items-end gap-28">
//                 <div className="flex items-center">
//                   <Star className="h-5 w-5 fill-current text-yellow-400" />
//                   <span className="ml-1">4.9</span>
//                   <span className="ml-1 text-gray-500">(124)</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <Clock className="mr-2 h-4 w-4" />
//                   <span>Available weekends</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
//                 Custom Cakes
//               </span>
//               <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
//                 Cupcakes
//               </span>
//               <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
//                 Theme Cakes
//               </span>
//             </div>
//           </div>

//           {/* About Our Services */}
//           <div className="border-border-primary rounded-lg border bg-white p-6">
//             <h2 className="mb-4 text-2xl font-bold text-black">
//               About Our Services
//             </h2>
//             <div className="text-body space-y-4 font-normal">
//               <p>
//                 At Sweet Dreams Bakery, we believe every birthday deserves a
//                 cake as unique as the person celebrating. With over 10 years of
//                 experience, our skilled bakers create custom designs for any
//                 theme - from superhero adventures to princess castles, dinosaur
//                 expeditions to unicorn fantasies.
//               </p>
//               <p>
//                 We use only the finest ingredients, including organic flour,
//                 farm-fresh eggs, and real vanilla. Our cakes are not only
//                 beautiful but deliciously moist and flavorful. We offer various
//                 cake flavors including vanilla, chocolate, strawberry, red
//                 velvet, and seasonal specialties.
//               </p>
//               <p>
//                 Our cupcake towers and mini treats are perfect for parties of
//                 any size. We also create matching cookies, cake pops, and
//                 dessert tables to complete your celebration theme.
//               </p>
//             </div>
//           </div>

//           {/* Portfolio */}
//           <div className="border-border-primary rounded-lg border bg-white p-6">
//             <h2 className="mb-4 text-2xl font-bold text-black">Portfolio</h2>
//             <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//               <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
//                 <img
//                   src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop"
//                   alt="Custom cupcakes with decorative toppings"
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//               <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
//                 <img
//                   src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=300&h=300&fit=crop"
//                   alt="Elegant cake display"
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//               <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
//                 <img
//                   src="https://images.unsplash.com/photo-1476834333517-979117ad6f83?w=300&h=300&fit=crop"
//                   alt="Pink decorated cake with roses"
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//               <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
//                 <img
//                   src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&h=300&fit=crop"
//                   alt="Birthday cake with berries"
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Reviews */}
//           <div className="rounded-lg bg-white p-6 shadow-sm">
//             <h2 className="mb-4 text-2xl font-bold text-black">
//               About Our Services
//             </h2>
//             <div className="space-y-4">
//               {/* Review 1 */}
//               <div className="border-b border-gray-200 pb-4">
//                 <div className="mb-1 flex items-center justify-between">
//                   <h3 className="text-lg font-medium text-black">Sarah M.</h3>
//                   <span className="text-sm text-gray-500">2 weeks ago</span>
//                 </div>
//                 <div className="mb-4 flex">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       className="h-4 w-4 fill-current text-yellow-400"
//                     />
//                   ))}
//                 </div>
//                 <p className="text-gray-700">
//                   Absolutely stunning superhero cake for my son's 6th birthday!
//                   The detail was incredible and it tasted even better than it
//                   looked. Highly recommend!
//                 </p>
//               </div>

//               {/* Review 2 */}
//               <div className="border-b border-gray-200 pb-4">
//                 <div className="mb-1 flex items-center justify-between">
//                   <h3 className="text-lg font-medium text-black">Mike R.</h3>
//                   <span className="text-sm text-gray-500">1 month ago</span>
//                 </div>
//                 <div className="mb-4 flex">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       className="h-4 w-4 fill-current text-yellow-400"
//                     />
//                   ))}
//                 </div>
//                 <p className="text-gray-700">
//                   Professional service from start to finish. The princess castle
//                   cake was exactly what my daughter dreamed of. Will definitely
//                   order again!
//                 </p>
//               </div>

//               {/* Review 3 */}
//               <div className="border-b border-gray-200 pb-4">
//                 <div className="mb-1 flex items-center justify-between">
//                   <h3 className="text-lg font-medium text-black">Lisa K.</h3>
//                   <span className="text-sm text-gray-500">2 months ago</span>
//                 </div>
//                 <div className="mb-4 flex">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       className="h-4 w-4 fill-current text-yellow-400"
//                     />
//                   ))}
//                 </div>
//                 <p className="text-gray-700">
//                   Beautiful dinosaur themed cupcakes for our party. Kids loved
//                   them! Only minor issue was delivery was 30 minutes late, but
//                   the quality made up for it.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Sidebar */}
//         <div className="space-y-6">
//           {/* Get a Quote */}
//           <div className="rounded-lg bg-white p-6 shadow-sm">
//             <h2 className="mb-4 text-2xl font-bold text-black">Get a Quote</h2>
//             <Link
//               to={"/home/request-quote"}
//               className="bg-secondary hover:bg-secondary-dark mb-4 inline-block w-full cursor-pointer rounded-lg px-4 py-3 text-center font-medium text-white transition-colors"
//             >
//               Request Quote
//             </Link>
//             {/* <button className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 font-medium text-[#1a1a1a] transition-colors hover:bg-gray-50">
//               Ask A Question
//             </button> */}
//           </div>

//           {/* Contact Information */}
//           <div className="rounded-lg bg-white p-6 shadow-sm">
//             <h2 className="mb-4 text-2xl font-bold text-black">
//               Contact Information
//             </h2>
//             <div className="space-y-3">
//               <div className="flex items-center text-gray-700">
//                 <Phone className="mr-3 h-4 w-4" />
//                 <span>(555) 123-4567</span>
//               </div>
//               <div className="flex items-center text-gray-700">
//                 <Mail className="mr-3 h-4 w-4" />
//                 <span>orders@sweetdreamsbakery.com</span>
//               </div>
//               <div className="flex items-center text-gray-700">
//                 <Globe className="mr-3 h-4 w-4" />
//                 <span>Visit Website</span>
//               </div>
//               <div className="flex items-center text-gray-700">
//                 <Instagram className="mr-3 h-4 w-4" />
//                 <span>@sweetdreamsbakery</span>
//               </div>
//             </div>
//           </div>

//           {/* At a Glance */}
//           <div className="rounded-lg bg-white p-6 shadow-sm">
//             <h2 className="mb-4 text-2xl font-bold text-black">At a Glance</h2>
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Response Time</span>
//                 <span className="font-medium">Within 2 hours</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Lead Time</span>
//                 <span className="font-medium">2-3 weeks</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Experience</span>
//                 <span className="font-medium">10+ years</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Parties Served</span>
//                 <span className="font-medium">500+</span>
//               </div>
//             </div>
//           </div>

//           {/* Map */}
//           <div className="rounded-lg bg-white p-6 shadow-sm">
//             <h2 className="mb-4 text-2xl font-bold text-black">Map</h2>
//             <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
//               <iframe
//                 src="https://www.openstreetmap.org/export/embed.html?bbox=90.3000%2C23.7000%2C90.5000%2C23.8500&layer=mapnik&marker=23.7800%2C90.4000"
//                 width="100%"
//                 height="100%"
//                 frameBorder="0"
//                 style={{ border: 0 }}
//                 allowFullScreen
//                 title="Dhaka Map"
//               ></iframe>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
