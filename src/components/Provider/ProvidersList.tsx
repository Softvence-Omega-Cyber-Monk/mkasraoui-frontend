


"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetProvidersQuery } from "@/redux/features/property/propertyApi";
import { ArrowRight, CircleDollarSign, MapPin, Star } from "lucide-react";
import Title from "../Shared/Title";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import PageLoader from "../Shared/PageLoader";

const ProvidersList = () => {
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data: user } = useGetMeQuery();
  const { data, isLoading } = useGetProvidersQuery({ limit, page });

  if (isLoading)
    return (
      <div className="flex justify-center py-24">
        <PageLoader />
      </div>
    );

  const providers = data?.data?.data || [];
  const total = data?.data?.total || 9;
  const totalPages = Math.ceil(total / limit);

  if (!providers.length)
    return (
      <div className="flex justify-center py-24">
        <p className="text-lg text-gray-400">No providers found</p>
      </div>
    );

  return (
    <div className="mx-auto space-y-5">
      <Title title="All Service Providers" />

      {/* Providers Grid */}
      <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {providers.map((provider: any) => (
          <div
            key={provider.id}
            className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-transform"
          >
            <div>
              {/* Service Category & Rating */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-secondary inline-block rounded-lg border border-gray-300 bg-gray-50 px-3 py-1 text-sm">
                  {provider.serviceCategory?.[0] ?? "Unknown"}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{(provider.avg_ratting ?? 0).toFixed(1)}</span>
                  <span className="text-gray-500">
                    ({provider.total_review ?? 0})
                  </span>
                </div>
              </div>

              {/* Provider Info */}
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={
                    provider.portfolioImages?.[0] ??
                    "https://via.placeholder.com/150"
                  }
                  alt={provider.bussinessName}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {provider.bussinessName}
                  </h2>
                  <p className="text-gray-600">{provider.contactName}</p>
                </div>
              </div>

              {/* Description */}
              <p className="mb-4 line-clamp-3 text-gray-700">
                {provider.description}
              </p>

              {/* Service Area & Price */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4.5 w-4.5" />
                  <span className="text-sm">{provider.serviceArea}</span>
                </div>
                <div className="flex items-center gap-2 text-[#5A5C5F]">
                  <CircleDollarSign className="h-4.5 w-4.5" />
                  <span className="text-base">{provider.price}</span>
                </div>
              </div>

              {/* Portfolio Images */}
              <div className="mb-4 flex space-x-3">
                {provider.portfolioImages
                  ?.slice(0, 3)
                  .map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative h-20 w-20 overflow-hidden rounded-lg border border-[#D1D5DC] transition-transform hover:scale-105"
                    >
                      <img
                        src={img}
                        alt={`${provider.bussinessName} portfolio`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* View / Update button for logged-in provider */}
            {user?.id === provider.userId && (
              <Link
                to={`/dashboard/providers/${provider.id}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-[#223B7D]  px-5 py-2 font-medium text-white transition-all hover:bg-[#02195a] hover:shadow-lg"
              >
                View / Update <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {providers.length > 0 && (
        <div className="mt-6 flex items-center justify-between px-4 py-3">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">{providers.length}</span> of{" "}
            <span className="font-medium">{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border hover:cursor-pointer px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <div className="min-w-[50px] rounded-md border bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
              {page} / {totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border px-3 hover:cursor-pointer py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvidersList;






















// "use client";
// import { Link } from "react-router-dom";
// import { useGetProvidersQuery } from "@/redux/features/property/propertyApi";
// import { ArrowRight, CircleDollarSign, MapPin, Star } from "lucide-react";
// import Title from "../Shared/Title";
// import { useGetMeQuery } from "@/redux/features/user/userApi";
// import PageLoader from "../Shared/PageLoader";

// const ProvidersList = () => {
//   const { data: user } = useGetMeQuery();
//   const { data, isLoading } = useGetProvidersQuery({ limit: 10, page: 1 });

//   if (isLoading)
//     return (
//       <div className="flex justify-center py-24">
//         <PageLoader />
//       </div>
//     );

//   if (!data?.data?.data?.length)
//     return (
//       <div className="flex justify-center py-24">
//         <p className="text-lg text-gray-400">No providers found</p>
//       </div>
//     );

//   return (
//     <div className="mx-auto space-y-5">
//       <Title title="All Service Providers" />
//       <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
//         {data.data.data.map((provider: any) => (
//           <div
//             key={provider.id}
//             className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-transform"
//           >
//             <div>
//               {/* Service Category & Rating */}
//               <div className="mb-4 flex items-center justify-between">
//                 <span className="text-secondary inline-block rounded-lg border border-gray-300 bg-gray-50 px-3 py-1 text-sm">
//                   {provider.serviceCategory?.[0] ?? "Unknown"}
//                 </span>
//                 <div className="flex items-center gap-1">
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <span>{(provider.avg_ratting ?? 0).toFixed(1)}</span>
//                   <span className="text-gray-500">
//                     ({provider.total_review ?? 0})
//                   </span>
//                 </div>
//               </div>

//               {/* Provider Info */}
//               <div className="mb-4 flex items-center gap-3">
//                 <img
//                   src={
//                     provider.portfolioImages?.[0] ??
//                     "https://via.placeholder.com/150"
//                   }
//                   alt={provider.bussinessName}
//                   className="h-12 w-12 rounded-lg object-cover"
//                 />
//                 <div>
//                   <h2 className="text-2xl font-semibold text-gray-900">
//                     {provider.bussinessName}
//                   </h2>
//                   <p className="text-gray-600">{provider.contactName}</p>
//                 </div>
//               </div>

//               {/* Description */}
//               <p className="mb-4 line-clamp-3 text-gray-700">
//                 {provider.description}
//               </p>

//               {/* Service Area & Price */}
//               <div className="mb-4 space-y-2">
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <MapPin className="h-4.5 w-4.5" />
//                   <span className="text-sm">{provider.serviceArea}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-[#5A5C5F]">
//                   <CircleDollarSign className="h-4.5 w-4.5" />
//                   <span className="text-base">{provider.priceRange}</span>
//                 </div>
//               </div>

//               {/* Portfolio Images */}
//               <div className="mb-4 flex space-x-3">
//                 {provider.portfolioImages
//                   ?.slice(0, 3)
//                   .map((img: string, idx: number) => (
//                     <div
//                       key={idx}
//                       className="relative h-20 w-20 overflow-hidden rounded-lg border border-[#D1D5DC] transition-transform hover:scale-105"
//                     >
//                       <img
//                         src={img}
//                         alt={`${provider.bussinessName} portfolio`}
//                         className="h-full w-full object-cover"
//                       />
//                     </div>
//                   ))}
//               </div>
//             </div>

//             {/* View / Update button for logged-in provider */}
//             {user?.id === provider.userId && (
//               <Link
//                 to={`/dashboard/providers/${provider.id}`}
//                 className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-[#223B7D]  px-5 py-2 font-medium text-white transition-all hover:bg-[#02195a] hover:shadow-lg"
//               >
//                 View / Update <ArrowRight className="h-4 w-4" />
//               </Link>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProvidersList;
