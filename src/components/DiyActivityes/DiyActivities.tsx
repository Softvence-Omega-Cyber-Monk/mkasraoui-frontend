import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetActivitiesQuery } from "@/redux/features/AdminDiyActivity/activityApi";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import PageLoader from "../Shared/PageLoader";

interface Activity {
  id: string;
  title: string;
  theme?: string;
  video?: string;
  description?: string;
  difficulty?: string;
  avg_rating?: number;
  total_review?: number;
  age_range: string;
}

const DiyActivities: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [ratingFilter, setRatingFilter] = useState<number | "">("");
  const [ageFilter, setAgeFilter] = useState<string>("");

  const activitiesPerPage = 9;
  const { data: activitiesData, isLoading, isError } = useGetActivitiesQuery();

  const activities: Activity[] =
    activitiesData?.data.map((a: any) => ({
      ...a,
      theme: a.theme || "General",
      difficulty: a.difficulty || "Medium",
      avg_rating: a.avg_rating ?? 0,
      total_review: a.total_review ?? 0,
    })) || [];
  /* Added for dynamic filter age */
  const availableAges = useMemo(() => {
    const agesSet = new Set<string>();
    activities.forEach((activity) => {
      if (activity.age_range) {
        agesSet.add(activity.age_range);
      }
    });
    return Array.from(agesSet).sort();
  }, [activities]);

  // 🔍 Filtering logic
  const filtered = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch =
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating =
        ratingFilter === "" || activity.avg_rating === ratingFilter;

      const matchesAge =
        ageFilter === "" || activity.age_range?.includes(ageFilter);

      return matchesSearch && matchesRating && matchesAge;
    });
  }, [activities, searchTerm, ratingFilter, ageFilter]);

  // 🎨 Dynamic filter options
  // const availableRatings = useMemo(
  //   () =>
  //     Array.from(new Set(activities.map((a) => a.avg_rating ?? 0))).sort((a, b) => a - b),
  //   [activities]
  // );

  // 📄 Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / activitiesPerPage);
  const paginated = useMemo(() => {
    const start = (page - 1) * activitiesPerPage;
    return filtered.slice(start, start + activitiesPerPage);
  }, [page, filtered]);

  const pageFromServer = page; // keeping naming consistent with provided code

  if (isLoading)
    return (
      <p>
        <PageLoader />
      </p>
    );
  if (isError) return <p>Error fetching activities.</p>;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++)
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    if (hasHalfStar)
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    for (let i = 0; i < emptyStars; i++)
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);

    return stars;
  };

  return (
    <div className="container mx-auto mt-1">
      {/* Filters */}
      <div className="rounded-lg px-3">
        <div className="mb-5 flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-4 left-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search themes, activities, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={ratingFilter ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setRatingFilter(val === "" ? "" : Number(val));
            }}
            className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 pr-8 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Ratings</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {/* <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 pr-8 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Ages</option>
            <option value="0-3">0-3 years</option>
            <option value="3-6">3-6 years</option>
            <option value="4-12">4-12 years</option>
            <option value="7-12">7-12 years</option>
            <option value="13-18">13-18 years</option>
          </select> */}
          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 pr-8 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Ages</option>
            {availableAges.map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activities Grid */}
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          No activities found matching your criteria.
        </p>
      ) : (
        <div className="mb-6 grid grid-cols-1 gap-6 px-3 md:grid-cols-2 lg:grid-cols-3">
          {paginated.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col overflow-hidden rounded-lg bg-[#FFFAF5] shadow-md transition-all hover:shadow-lg"
            >
              <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
                {activity.video ? (
                  <video
                    src={activity.video}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src="/placeholder.png"
                    alt={activity.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-2 line-clamp-2 text-lg font-medium">
                  {activity.title}
                </h3>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex">
                    {renderStars(activity.avg_rating || 0)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {activity?.avg_rating != null
                      ? activity.avg_rating % 1 === 0
                        ? Number(activity.avg_rating)
                        : Number(activity.avg_rating).toFixed(1)
                      : "0"}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({activity.total_review} reviews)
                  </span>
                </div>
                <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">
                  {activity.description}
                </p>
                <Link
                  to={`/diyboxeactivity/activity/${activity.id}`}
                  className="hover:bg-secondary-light mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm font-medium text-white transition-all"
                >
                  View Details <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Integrated Pagination System */}
      {filtered.length > 0 && (
        <div className="mt-6 flex items-center justify-between px-4 py-3">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{paginated.length}</span> of{" "}
            <span className="font-medium">{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <div className="min-w-[50px] rounded-md border border-[#E3E3E4] bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700 shadow-sm">
              {pageFromServer} / {totalPages || 1}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiyActivities;

// import { useMemo, useState } from "react";
// import { ChevronRight, Search } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useGetActivitiesQuery } from "@/redux/features/AdminDiyActivity/activityApi";
// import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

// interface Activity {
//   id: string;
//   title: string;
//   theme?: string;
//   video?: string;
//   description?: string;
//   difficulty?: string;
//   avg_rating?: number;
//   total_review?: number;
// }

// const DiyActivities: React.FC = () => {
//   const [page, setPage] = useState<number>(1);
//   const [searchTerm, setSearchTerm] = useState<string>("");

//   const [ratingFilter, setRatingFilter] = useState<number | "">("");

//   const activitiesPerPage = 9;
//   const { data: activitiesData, isLoading, isError } = useGetActivitiesQuery();

//   const activities: Activity[] =
//     activitiesData?.data.map((a: any) => ({
//       ...a,
//       theme: a.theme || "General",
//       difficulty: a.difficulty || "Medium",
//       avg_rating: a.avg_rating ?? 0,
//       total_review: a.total_review ?? 0,
//     })) || [];

//   // 🔍 Filtering logic
//   const filtered = useMemo(() => {
//     return activities.filter((activity) => {
//       const matchesSearch =
//         activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         activity.description?.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesRating =
//         ratingFilter === "" || activity.avg_rating === ratingFilter;

//       return matchesSearch && matchesRating;
//     });
//   }, [activities, searchTerm, ratingFilter]);

//   // 🎨 Dynamic filter options
//   // const availableRatings = useMemo(
//   //   () =>
//   //     Array.from(new Set(activities.map((a) => a.avg_rating ?? 0))).sort((a, b) => a - b),
//   //   [activities]
//   // );

//   // 📄 Pagination
//   const total = filtered.length;
//   const totalPages = Math.ceil(total / activitiesPerPage);
//   const paginated = useMemo(() => {
//     const start = (page - 1) * activitiesPerPage;
//     return filtered.slice(start, start + activitiesPerPage);
//   }, [page, filtered]);

//   const pageFromServer = page; // keeping naming consistent with provided code

//   if (isLoading) return <p>Loading activities...</p>;
//   if (isError) return <p>Error fetching activities.</p>;

//   const renderStars = (rating: number) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//     for (let i = 0; i < fullStars; i++)
//       stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
//     if (hasHalfStar)
//       stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
//     for (let i = 0; i < emptyStars; i++)
//       stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);

//     return stars;
//   };

//   return (
//     <div className="container mx-auto mt-1">
//       {/* Filters */}
//       <div className="rounded-lg px-3">
//         <div className="mb-5 flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm md:flex-row">
//           <div className="relative flex-1">
//             <Search className="absolute top-4 left-3 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search themes, activities, or keywords..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <select
//             value={ratingFilter ?? ""}
//             onChange={(e) => {
//               const val = e.target.value;
//               setRatingFilter(val === "" ? "" : Number(val));
//             }}
//             className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 pr-8 outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Ratings</option>
//             {[1, 2, 3, 4, 5].map((r) => (
//               <option key={r} value={r}>
//                 {r}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Activities Grid */}
//       {filtered.length === 0 ? (
//         <p className="py-10 text-center text-gray-500">
//           No activities found matching your criteria.
//         </p>
//       ) : (
//         <div className="mb-6 grid grid-cols-1 gap-6 px-3 md:grid-cols-2 lg:grid-cols-3">
//           {paginated.map((activity) => (
//             <div
//               key={activity.id}
//               className="flex flex-col overflow-hidden rounded-lg bg-[#FFFAF5] shadow-md transition-all hover:shadow-lg"
//             >
//               <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
//                 {activity.video ? (
//                   <video
//                     src={activity.video}
//                     className="h-full w-full object-cover"
//                     autoPlay
//                     muted
//                     loop
//                     playsInline
//                   />
//                 ) : (
//                   <img
//                     src="/placeholder.png"
//                     alt={activity.title}
//                     className="h-full w-full object-cover"
//                   />
//                 )}
//               </div>
//               <div className="flex flex-1 flex-col p-4">
//                 <h3 className="mb-2 line-clamp-2 text-lg font-medium">
//                   {activity.title}
//                 </h3>
//                 <div className="mb-4 flex items-center gap-2">
//                   <div className="flex">
//                     {renderStars(activity.avg_rating || 0)}
//                   </div>
//                   <span className="text-sm font-medium text-gray-900">
//                     {activity?.avg_rating != null
//                       ? activity.avg_rating % 1 === 0
//                         ? Number(activity.avg_rating)
//                         : Number(activity.avg_rating).toFixed(1)
//                       : "0"}
//                   </span>
//                   <span className="text-sm text-gray-500">
//                     ({activity.total_review} reviews)
//                   </span>
//                 </div>
//                 <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">
//                   {activity.description}
//                 </p>
//                 <Link
//                   to={`/diyboxeactivity/activity/${activity.id}`}
//                   className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm font-medium text-white transition-all hover:bg-[#343f5c]"
//                 >
//                   View Details <ChevronRight size={16} />
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ✅ Integrated Pagination System */}
//       {filtered.length > 0 && (
//         <div className="mt-6 flex items-center justify-between px-4 py-3">
//           <div className="text-sm text-gray-600">
//             Showing <span className="font-medium">{paginated.length}</span> of{" "}
//             <span className="font-medium">{total}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page <= 1}
//               className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
//             >
//               Prev
//             </button>
//             <div className="min-w-[50px] rounded-md border border-[#E3E3E4] bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700 shadow-sm">
//               {pageFromServer} / {totalPages || 1}
//             </div>
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page >= totalPages}
//               className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DiyActivities;
