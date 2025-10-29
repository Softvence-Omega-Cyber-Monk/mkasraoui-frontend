

import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetActivitiesQuery } from "@/redux/features/AdminDiyActivity/activityApi";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

interface Activity {
  id: string;
  title: string;
  theme?: string;
  video?: string;
  description?: string;
  difficulty?: string;
  avg_rating?: number;
  total_review?: number;
}

const DiyActivities: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
   
  const [ratingFilter, setRatingFilter] = useState<number | "">("");

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

  // 🔍 Filtering logic
  const filtered = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch =
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase());

      
      
      const matchesRating = ratingFilter === "" || activity.avg_rating === ratingFilter;

      return matchesSearch && matchesRating;
    });
  }, [activities, searchTerm,  ratingFilter]);

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

  if (isLoading) return <p>Loading activities...</p>;
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
     <div className=" rounded-lg   px-3  ">
       <div className="flex flex-col md:flex-row gap-4 mb-5   rounded-lg bg-white p-6 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-4 text-gray-400" size={20} />
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
      </div>
     </div>

      {/* Activities Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No activities found matching your criteria.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-3 gap-6 mb-6">
          {paginated.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-md hover:shadow-lg transition-all"
            >
              <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
                {activity.video ? (
                  <video
                    src={activity.video}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src="/placeholder.png"
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col">
                <h3 className="mb-2 line-clamp-2 text-lg font-medium">
                  {activity.title}
                </h3>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex">{renderStars(activity.avg_rating || 0)}</div>
        <span className="text-sm font-medium text-gray-900">
  {activity?.avg_rating != null
    ? (activity.avg_rating % 1 === 0
        ? Number(activity.avg_rating)
        : Number(activity.avg_rating).toFixed(1))
    : '0'}
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
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
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
//   const [theme, setTheme] = useState<string>("");
//   const [difficulty, setDifficulty] = useState<string>("");
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

//       const matchesTheme =
//         !theme || (activity.theme && activity.theme.toLowerCase() === theme.toLowerCase());

//       const matchesDifficulty =
//         !difficulty ||
//         (activity.difficulty && activity.difficulty.toLowerCase() === difficulty.toLowerCase());

//       const matchesRating = ratingFilter === "" || activity.avg_rating === ratingFilter;

//       return matchesSearch && matchesTheme && matchesDifficulty && matchesRating;
//     });
//   }, [activities, searchTerm, theme, difficulty, ratingFilter]);

//   // 🎨 Dynamic filter options
//     const availableRatings = useMemo(() => Array.from(new Set(activities.map(a => a.avg_rating ?? 0))).sort((a, b) => a - b), [activities]);

//   // Pagination
//   const totalPages = Math.ceil(filtered.length / activitiesPerPage);
//   const paginated = useMemo(() => {
//     const start = (page - 1) * activitiesPerPage;
//     return filtered.slice(start, start + activitiesPerPage);
//   }, [page, filtered]);

//   if (isLoading) return <p>Loading activities...</p>;
//   if (isError) return <p>Error fetching activities.</p>;

//   const renderStars = (rating: number) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//     for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
//     if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
//     for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);

//     return stars;
//   };

//   return (
//     <div className="container mx-auto mt-1">
//       {/* Header */}
//       {/* <div className="mb-8">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="text-4xl">🎨</div>
//           <h1 className="text-4xl font-bold text-gray-800">DIY Activities</h1>
//         </div>
//         <p className="text-lg text-gray-600">Explore creative activities and filter by theme, difficulty, or rating ⭐</p>
//       </div> */}

//       {/* Filters */}
//       <div className=" flex flex-col md:flex-row gap-4 mb-20 rounded-lg bg-white p-6 shadow-sm">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-4 text-gray-400" size={20} />
//           <input
//             type="text"
//             placeholder="Search themes, activities, or keywords..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

        

        

//         <select
//           value={ratingFilter}
//           onChange={(e) => setRatingFilter(e.target.value === "" ? "" : Number(e.target.value))}
//           className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 pr-8 outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">All Ratings</option>
//           {availableRatings.map((r) => <option key={r} value={r}>{r === 0 ? "Unrated" : r}</option>)}
//         </select>
//       </div>

//       {/* Activities Grid */}
//       {filtered.length === 0 ? (
//         <p className="text-center text-gray-500 py-10">No activities found matching your criteria.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//           {paginated.map((activity) => (
//             <div key={activity.id} className="flex flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-md hover:shadow-lg transition-all">
//               <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
//                 {activity.video ? (
//                   <video src={activity.video} className="w-full h-full object-cover" autoPlay muted loop playsInline />
//                 ) : (
//                   <img src="/placeholder.png" alt={activity.title} className="w-full h-full object-cover" />
//                 )}
//               </div>
//               <div className="flex-1 p-4 flex flex-col">
//                 <h3 className="mb-2 line-clamp-2 text-lg font-medium">{activity.title}</h3>
//                 <div className="mb-4 flex items-center gap-2">
//                   <div className="flex">{renderStars(activity.avg_rating || 0)}</div>
//                   <span className="text-sm font-medium text-gray-900">{activity.avg_rating}</span>
//                   <span className="text-sm text-gray-500">({activity.total_review} reviews)</span>
//                 </div>
//                 <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">{activity.description}</p>
//                 <Link
//                   to={`/diyboxeactivity/activity/${activity.id}`}
//                   className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
//                 >
//                   View Details <ChevronRight size={16} />
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mb-10">
//           <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50">Prev</button>
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button key={i + 1} onClick={() => setPage(i + 1)} className={`px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 ${page === i + 1 ? "bg-gray-200 font-bold" : ""}`}>
//               {i + 1}
//             </button>
//           ))}
//           <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50">Next</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DiyActivities;












// import { useMemo, useState } from "react";
// import { ChevronRight, Search, Star } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useGetActivitiesQuery } from "@/redux/features/AdminDiyActivity/activityApi";

// interface Activity {
//   id: string;
//   title: string;
//   theme?: string;
//   video?: string;
//   description?: string;
//   difficulty?: string;
//   avg_rating?: number;
//   total_review?: number;
//   createdAt?: string;
// }

// const DiyActivities: React.FC = () => {
//   const [page, setPage] = useState<number>(1);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [theme, setTheme] = useState<string>("");
//   const [difficulty, setDifficulty] = useState<string>("");
//   const [ratingFilter, setRatingFilter] = useState<number | "">(""); // Rating filter

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

//       const matchesTheme =
//         !theme ||
//         (activity.theme && activity.theme.toLowerCase() === theme.toLowerCase());

//       const matchesDifficulty =
//         !difficulty ||
//         (activity.difficulty &&
//           activity.difficulty.toLowerCase() === difficulty.toLowerCase());

//       const matchesRating =
//         ratingFilter === "" || activity.avg_rating === ratingFilter;

//       return matchesSearch && matchesTheme && matchesDifficulty && matchesRating;
//     });
//   }, [activities, searchTerm, theme, difficulty, ratingFilter]);

//   // 🎨 Dynamic options for filters
//   const availableThemes = useMemo(() => {
//     const themes = new Set<string>();
//     activities.forEach((a) => a.theme && themes.add(a.theme));
//     return Array.from(themes);
//   }, [activities]);

//   const availableDifficulties = useMemo(() => {
//     const diffs = new Set<string>();
//     activities.forEach((a) => a.difficulty && diffs.add(a.difficulty));
//     return Array.from(diffs);
//   }, [activities]);

//   const availableRatings = useMemo(() => {
//     const setRatings = new Set<number>();
//     activities.forEach((a) => setRatings.add(a.avg_rating || 0));
//     return Array.from(setRatings).sort((a, b) => a - b);
//   }, [activities]);

//   // Pagination
//   const totalPages = Math.ceil(filtered.length / activitiesPerPage);
//   const paginated = useMemo(() => {
//     const start = (page - 1) * activitiesPerPage;
//     return filtered.slice(start, start + activitiesPerPage);
//   }, [page, filtered]);

//   if (isLoading) return <p>Loading activities...</p>;
//   if (isError) return <p>Error fetching activities.</p>;

//   return (
//     <div className="container mx-auto mt-10">
//       {/* ===== Header ===== */}
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="text-4xl">🎨</div>
//           <h1 className="text-4xl font-bold text-gray-800">DIY Activities</h1>
//         </div>
//         <p className="text-lg text-gray-600">
//           Explore creative activities and filter by theme, difficulty, or rating ⭐
//         </p>
//       </div>

//       {/* ===== Filters ===== */}
//       <div className="mb-8 bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4">
//         {/* Search */}
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-3 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder="Search activities..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg py-2 pl-9 pr-3 focus:ring-2 focus:ring-[#223B7D] outline-none"
//           />
//         </div>

        

     

//         {/* Rating filter */}
//         <select
//           value={ratingFilter}
//           onChange={(e) =>
//             setRatingFilter(e.target.value === "" ? "" : Number(e.target.value))
//           }
//           className="border border-gray-300 cursor-pointer rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#223B7D] outline-none flex items-center"
//         >
//           <option value="">All Ratings</option>
//           {availableRatings.map((r) => (
//             <option key={r} value={r}>
//               {r === 0 ? "Unrated" : `${r}`}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* ===== Activities Grid ===== */}
//       {filtered.length === 0 ? (
//         <p className="text-center text-gray-500 py-10">
//           No activities found matching your criteria.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//           {paginated.map((activity) => (
//             <div
//               key={activity.id}
//               className="flex flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-md hover:shadow-lg transition-all"
//             >
//               <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
//                 {activity.video ? (
//                   <video
//                     src={activity.video}
//                     className="w-full h-full object-cover"
//                     autoPlay
//                     muted
//                     loop
//                     playsInline
//                   />
//                 ) : (
//                   <img
//                     src="/placeholder.png"
//                     alt={activity.title}
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>
//               <div className="flex-1 p-4 flex flex-col">
//                 <h3 className="mb-2 line-clamp-2 text-lg font-medium">
//                   {activity.title}
//                 </h3>

//                 {/* Rating display */}
//                 <p className="mb-2 text-sm text-[#5A5C5F] flex items-center gap-2">
//                   {/* <Star size={14} className="text-yellow-500" /> */}
//                   <strong>Rating:</strong>{" "}
//                   {activity.avg_rating === 0
//                     ? "Unrated"
//                     : activity.avg_rating + "⭐"}{" "}
//                    <span>(Total: {activity.total_review})</span>
//                 </p>

//                 <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">
//                   {activity.description}
//                 </p>





//                 <Link
//                   to={`/diyboxeactivity/activity/${activity.id}`}
//                   className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
//                 >
//                   View Details <ChevronRight size={16} />
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ===== Pagination ===== */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mb-10">
//           <button
//             onClick={() => setPage(page - 1)}
//             disabled={page === 1}
//             className="px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Prev
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setPage(i + 1)}
//               className={`px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 ${
//                 page === i + 1 ? "bg-gray-200 font-bold" : ""
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button
//             onClick={() => setPage(page + 1)}
//             disabled={page === totalPages}
//             className="px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DiyActivities;








// import { useMemo, useState } from "react";
// import { ChevronRight, Search } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useGetActivitiesQuery } from "@/redux/features/AdminDiyActivity/activityApi";

// interface Activity {
//   id: string;
//   title: string;
//   video?: string;
//   description?: string;
//   rating?: number; // avg_rating
//   createdAt?: string;
// }

// const DiyActivities: React.FC = () => {
//   const [page, setPage] = useState<number>(1);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [ratingFilter, setRatingFilter] = useState<number | "">(""); // Rating filter

//   const activitiesPerPage = 9;
//   const { data: activitiesData, isLoading, isError } = useGetActivitiesQuery();

//   // Map API data to include rating
//   const activities: Activity[] =
//     activitiesData?.data.map((a: any) => ({
//       ...a,
//       rating: a.avg_rating ?? 0,
//     })) || [];

//   // Filtering logic (search + rating)
//   const filtered = useMemo(() => {
//     return activities.filter((activity) => {
//       const matchesSearch =
//         activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         activity.description?.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesRating =
//         ratingFilter === "" || activity.rating === ratingFilter;

//       return matchesSearch && matchesRating;
//     });
//   }, [activities, searchTerm, ratingFilter]);

//   // Dynamic rating options (0–5)
//   const availableRatings = useMemo(() => {
//     const revs = new Set<number>();
//     activities.forEach((a) => revs.add(a.rating || 0));
//     return Array.from(revs).sort((a, b) => a - b);
//   }, [activities]);

//   // Pagination
//   const totalPages = Math.ceil(filtered.length / activitiesPerPage);
//   const paginated = useMemo(() => {
//     const start = (page - 1) * activitiesPerPage;
//     return filtered.slice(start, start + activitiesPerPage);
//   }, [page, filtered]);

//   if (isLoading) return <p>Loading activities...</p>;
//   if (isError) return <p>Error fetching activities.</p>;

//   return (
//     <div className="container mx-auto mt-10">
//       {/* ===== Header ===== */}
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="text-4xl">🎨</div>
//           <h1 className="text-4xl font-bold text-gray-800">DIY Activities</h1>
//         </div>
//         <p className="text-lg text-gray-600">Explore amazing activities by rating.</p>
//       </div>

//       {/* ===== Filters ===== */}
//       <div className="mb-8 bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4">
//         {/* Search */}
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-3 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder="Search activities..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg py-2 pl-9 pr-3 focus:ring-2 focus:ring-[#223B7D] outline-none"
//           />
//         </div>

//         {/* Rating filter */}
//         <select
//           value={ratingFilter}
//           onChange={(e) =>
//             setRatingFilter(e.target.value === "" ? "" : Number(e.target.value))
//           }
//           className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#223B7D] outline-none"
//         >
//           <option value="">All Ratings</option>
//           {availableRatings.map((r) => (
//             <option key={r} value={r}>
//               {r === 0 ? "Unrated" : r + "⭐"}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* ===== Activities Grid ===== */}
//       {filtered.length === 0 ? (
//         <p className="text-center text-gray-500 py-10">
//           No activities found matching your criteria.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//           {paginated.map((activity) => (
//             <div
//               key={activity.id}
//               className="flex flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-md hover:shadow-lg transition-all"
//             >
//               <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
//                 {activity.video ? (
//                   <video
//                     src={activity.video}
//                     className="w-full h-full object-cover"
//                     autoPlay
//                     muted
//                     loop
//                     playsInline
//                   />
//                 ) : (
//                   <img
//                     src="/placeholder.png"
//                     alt={activity.title}
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>
//               <div className="flex-1 p-4 flex flex-col">
//                 <h3 className="mb-2 line-clamp-2 text-lg font-medium">
//                   {activity.title}
//                 </h3>
//                 <p className="mb-2 text-sm text-[#5A5C5F]">
//                   <strong>Rating:</strong>{" "}
//                   {activity.rating === 0 ? "Unrated" : activity.rating + "⭐"}
//                 </p>
//                 <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">
//                   {activity.description}
//                 </p>
//                 <Link
//                   to={`/diyboxeactivity/activity/${activity.id}`}
//                   className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
//                 >
//                   View Details <ChevronRight size={16} />
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ===== Pagination ===== */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mb-10">
//           <button
//             onClick={() => setPage(page - 1)}
//             disabled={page === 1}
//             className="px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Prev
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setPage(i + 1)}
//               className={`px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 ${
//                 page === i + 1 ? "bg-gray-200 font-bold" : ""
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button
//             onClick={() => setPage(page + 1)}
//             disabled={page === totalPages}
//             className="px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DiyActivities;















// import { useMemo, useState } from "react";
// import { ChevronRight, Search } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useGetActivitiesQuery } from "@/redux/features/AdminDiyActivity/activityApi";

// interface Activity {
//   id: string;
//   title: string;
//   theme?: string;
//   video?: string;
//   pdfFile?: string;
//   description?: string;
//   difficulty?: string;
//   createdAt?: string;
// }

// const DiyActivities: React.FC = () => {
//   const [page, setPage] = useState<number>(1);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [theme, setTheme] = useState<string>("");
//   const [difficulty, setDifficulty] = useState<string>("");

//   const activitiesPerPage = 9;
//   const { data: activitiesData, isLoading, isError } = useGetActivitiesQuery();
//   console.log(activitiesData);

//   const activities: Activity[] =
//     activitiesData?.data.map((a: any) => ({
//       ...a,
//       theme: a.theme || "General",
//       difficulty: a.difficulty || "Medium",
//     })) || [];

//   // 🔍 Filtering logic
//   const filtered = useMemo(() => {
//     return activities.filter((activity) => {
//       const matchesSearch =
//         activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         activity.description?.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesTheme =
//         !theme ||
//         (activity.theme &&
//           activity.theme.toLowerCase() === theme.toLowerCase());

//       const matchesDifficulty =
//         !difficulty ||
//         (activity.difficulty &&
//           activity.difficulty.toLowerCase() === difficulty.toLowerCase());

//       return matchesSearch && matchesTheme && matchesDifficulty;
//     });
//   }, [activities, searchTerm, theme, difficulty]);

//   // 🎨 Dynamic options for filters
//   const availableThemes = useMemo(() => {
//     const themes = new Set<string>();
//     activities.forEach((a) => a.theme && themes.add(a.theme));
//     return Array.from(themes);
//   }, [activities]);

//   const availableDifficulties = useMemo(() => {
//     const diffs = new Set<string>();
//     activities.forEach((a) => a.difficulty && diffs.add(a.difficulty));
//     return Array.from(diffs);
//   }, [activities]);

//   // Pagination
//   const totalPages = Math.ceil(filtered.length / activitiesPerPage);
//   const paginated = useMemo(() => {
//     const start = (page - 1) * activitiesPerPage;
//     return filtered.slice(start, start + activitiesPerPage);
//   }, [page, filtered]);

//   if (isLoading) return <p>Loading activities...</p>;
//   if (isError) return <p>Error fetching activities.</p>;

//   return (
//     <div className="container mx-auto mt-10">
//       {/* ===== Header ===== */}
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="text-4xl">🎨</div>
//           <h1 className="text-4xl font-bold text-gray-800">DIY Activities</h1>
//         </div>
//         <p className="text-lg text-gray-600">
//           Explore amazing themed activities and projects for creative learners.
//         </p>
//       </div>

//       {/* ===== Filters ===== */}
//       <div className="mb-8 bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4">
//         {/* Search */}
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-3 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder="Search activities..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg py-2 pl-9 pr-3 focus:ring-2 focus:ring-[#223B7D] outline-none"
//           />
//         </div>

//         {/* Theme */}
        

//         {/* Difficulty */}
//         <select
//           value={difficulty}
//           onChange={(e) => setDifficulty(e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#223B7D] outline-none"
//         >
//           <option value="">All Difficulties</option>
//           {availableDifficulties.map((diff) => (
//             <option key={diff} value={diff}>
//               {diff}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* ===== Activities Grid ===== */}
//       {filtered.length === 0 ? (
//         <p className="text-center text-gray-500 py-10">
//           No activities found matching your criteria.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//           {paginated.map((activity) => (
//             <div
//               key={activity.id}
//               className="flex flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-md hover:shadow-lg transition-all"
//             >
//               <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
//                 {activity.video ? (
//                   <video
//                     src={activity.video}
//                     className="w-full h-full object-cover"
//                     autoPlay
//                     muted
//                     loop
//                     playsInline
//                   />
//                 ) : (
//                   <img
//                     src="/placeholder.png"
//                     alt={activity.title}
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>
//               <div className="flex-1 p-4 flex flex-col">
//                 <h3 className="mb-2 line-clamp-2 text-lg font-medium">
//                   {activity.title}
//                 </h3>
//                 <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">
//                   {activity.description}
//                 </p>
//                 <Link
//                   to={`/diyboxeactivity/activity/${activity.id}`}
//                   className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
//                 >
//                   View Details <ChevronRight size={16} />
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ===== Pagination ===== */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mb-10">
//           <button
//             onClick={() => setPage(page - 1)}
//             disabled={page === 1}
//             className="px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Prev
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setPage(i + 1)}
//               className={`px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 ${
//                 page === i + 1 ? "bg-gray-200 font-bold" : ""
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button
//             onClick={() => setPage(page + 1)}
//             disabled={page === totalPages}
//             className="px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DiyActivities;







// import { useMemo, useState } from "react";
// import { ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useGetActivitiesQuery } from "@/redux/features/AdminDiyActivity/activityApi";

// interface Activity {
//   id: number;
//   title: string;
//   theme: string;
//   images?: string[];
//   video?: string;
//   pdfFile?: string;
//   time?: string;
//   difficulty?: string;
//   materials?: string[] | string;
//   instruction_sheet?: string[] | string;
//   description?: string;
// }

// const DiyActivities: React.FC = () => {
//   const [page, setPage] = useState<number>(1);
//   const activitiesPerPage = 9;
//   const { data: activitiesData, isLoading, isError } = useGetActivitiesQuery();
// console.log(activitiesData)
//   const activities: Activity[] = activitiesData?.data.map((a: any) => ({
//     ...a,
//     theme: a.theme || "General",
//   })) || [];

//   const filtered = useMemo(() => activities, [activities]);
//   const totalPages = Math.ceil(filtered.length / activitiesPerPage);

//   const paginated = useMemo(() => {
//     const start = (page - 1) * activitiesPerPage;
//     return filtered.slice(start, start + activitiesPerPage);
//   }, [page, filtered]);

//   if (isLoading) return <p>Loading activities...</p>;
//   if (isError) return <p>Error fetching activities.</p>;

//   return (
//     <div className="container mx-auto mt-10">
//       <div className="mb-12">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="text-4xl">🎨</div>
//           <h1 className="text-4xl font-bold text-gray-800">DIY Activities</h1>
//         </div>
//         <p className="text-lg text-gray-600">
//           Explore amazing themed decorations and celebrations for your perfect party
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//         {paginated.map((activity) => (
//           <div
//             key={activity.id}
//             className="flex flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-md hover:shadow-lg transition-all"
//           >
//             <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
//               {activity.video ? (
//                 <video
//                   src={activity.video}
//                   className="w-full h-full object-cover"
//                   autoPlay
//                   muted
//                   loop
//                   playsInline
//                 />
//               ) : (
//                 <img
//                   src={activity.images?.[0] || "/placeholder.png"}
//                   alt={activity.title}
//                   className="w-full h-full object-cover"
//                 />
//               )}
//             </div>
//             <div className="flex-1 p-4 flex flex-col">
//               <h3 className="mb-2 line-clamp-2 text-lg font-medium">{activity.title}</h3>
//               <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">{activity.description}</p>
//               <Link
//                 to={`/diyboxeactivity/activity/${activity.id}`}
//                 className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
//               >
//                 View Details <ChevronRight size={16} />
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>

//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mb-10">
//           <button
//             onClick={() => setPage(page - 1)}
//             disabled={page === 1}
//             className="px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Prev
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setPage(i + 1)}
//               className={`px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 ${
//                 page === i + 1 ? "bg-gray-200 font-bold" : ""
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button
//             onClick={() => setPage(page + 1)}
//             disabled={page === totalPages}
//             className="px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DiyActivities;








