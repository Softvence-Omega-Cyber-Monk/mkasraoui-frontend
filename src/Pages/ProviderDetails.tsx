"use client";
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
import { useState } from "react";
import { useGetProviderByIdQuery } from "@/redux/features/property/propertyApi";
import { useCreateProviderReviewMutation } from "@/redux/features/review/providerReviewApi";
import PageLoader from "@/components/Shared/PageLoader";

export default function ProviderDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: provider, isLoading, error } = useGetProviderByIdQuery(id!);

  const [createReview, { isLoading: isPosting }] =
    useCreateProviderReviewMutation();

  // Local state for review form
  const [rating, setRating] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

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

  const serviceCategories = provider.serviceCategory || [];
  const portfolioImages = provider.portfolioImages || [];
  const reviews = provider.reviews || [];

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !description.trim()) {
      alert("Please add rating and description.");
      return;
    }
    try {
      await createReview({
        rating,
        description,
        providerId: provider.id,
      }).unwrap();
      setRating(0);
      setDescription("");
    } catch (err) {
      console.error("Error posting review:", err);
    }
  };

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
                  {/* <span className="ml-1">{provider.avg_ratting ?? 0}</span> */}
                  <span>{(provider.avg_ratting ?? 0).toFixed(1)}</span>
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

          {/* Review Form */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-black">
              Write a Review
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    className={`h-6 w-6 cursor-pointer ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-700">{rating} / 5</span>
              </div>

              {/* Description */}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Write your review..."
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-100"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPosting}
                className="w-full cursor-pointer rounded-lg bg-[#223B7D] px-4 py-2 font-medium text-white hover:bg-[#152244] disabled:opacity-50"
              >
                {isPosting ? "Posting..." : "Submit Review"}
              </button>
            </form>
          </div>

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
            <Link
              to={`/dashboard/chat-message`}
              className="hover:bg-secondary-dark mb-4 inline-block w-full cursor-pointer rounded-lg border bg-white px-4 py-3 text-center font-medium text-[#223B7D] transition-colors hover:text-white"
            >
              Chat Message
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
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    provider.longitude - 0.01
                  }%2C${provider.latitude - 0.01}%2C${
                    provider.longitude + 0.01
                  }%2C${provider.latitude + 0.01}&layer=mapnik&marker=${
                    provider.latitude
                  }%2C${provider.longitude}`}
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

// export default function ProviderDetails() {
//   const { id } = useParams<{ id: string }>();
//   const { data: provider, isLoading, error } = useGetProviderByIdQuery(id!);

//   if (isLoading) {
//     return (
//       <div className="mt-16 p-6 text-center">
//         <PageLoader />
//       </div>
//     );
//   }

//   if (error || !provider) {
//     return (
//       <div className="mt-16 p-6 text-center text-red-500">
//         Failed to load provider details.
//       </div>
//     );
//   }

//   // Fallback arrays
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
//             <Link
//               to={`/dashboard/chat-message`}
//               className="hover:bg-secondary-dark mb-4 inline-block w-full cursor-pointer rounded-lg border bg-white px-4 py-3 text-center font-medium text-[#223B7D] transition-colors hover:text-white"
//             >
//               Chat Message
//             </Link>
//             {/* <Link
//               to={`/home/request-quote?providerId=${provider.id}`}
//               className="hover:bg-secondary-dark mb-4 inline-block w-full cursor-pointer rounded-lg border bg-white px-4 py-3 text-center font-medium text-[#223B7D] transition-colors hover:text-white"
//             >
//               Chat Message
//             </Link> */}
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
