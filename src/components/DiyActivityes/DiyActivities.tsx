
import { useState, useMemo } from "react";
import { ChevronRight, Play } from "lucide-react";
import { useGetActivitiesQuery } from "@/redux/features/AdminDiyActivity/activityApi";

interface Activity {
  id: number;
  title: string;
  theme: string;
  images?: string[];
  video?: string;
  time?: string;
  difficulty?: string;
  materials?: string[] | string;
  instruction_sheet?: string[] | string;
  description?: string;
}

const DiyActivities: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [page, setPage] = useState<number>(1);
  const activitiesPerPage = 9;

  const { data: activitiesData, isLoading, isError } = useGetActivitiesQuery();

  // Ensure all activities have 'theme'
  const activities: Activity[] = activitiesData?.data.map((a: any) => ({
    ...a,
    theme: a.theme || "General",
  })) || [];

  const filtered = useMemo(() => activities, [activities]);

  const totalPages = Math.ceil(filtered.length / activitiesPerPage);

  const paginated = useMemo(() => {
    const start = (page - 1) * activitiesPerPage;
    return filtered.slice(start, start + activitiesPerPage);
  }, [page, filtered]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handleCloseModal = () => setSelectedActivity(null);

  const toArray = (data?: string[] | string): string[] => {
    if (!data) return [];
    return Array.isArray(data) ? data : data.split(";").map(s => s.trim()).filter(Boolean);
  };

  if (isLoading) return <p>Loading activities...</p>;
  if (isError) return <p>Error fetching activities.</p>;

  return (
    <div className="container mx-auto mt-10">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">🎨</div>
          <h1 className="text-4xl font-bold text-gray-800">DIY Activities</h1>
        </div>
        <p className="text-lg text-gray-600">
          Explore amazing themed decorations and celebrations for your perfect party
        </p>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
                  src={activity.images?.[0] || "/placeholder.png"}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
              )}
              {activity.video && (
                <button
                  onClick={() => setSelectedVideo(activity.video!)}
                  className="absolute inset-0 flex items-center justify-center hover:cursor-pointer bg-black/30 hover:bg-black/40 transition"
                >
                  <div className="bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition">
                    <Play size={22} fill="white" />
                  </div>
                </button>
              )}
            </div>
            <div className="flex-1 p-4 flex flex-col">
              <h3 className="mb-2 line-clamp-2 text-lg font-medium">{activity.title}</h3>
              <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">{activity.description}</p>
              <button
                onClick={() => setSelectedActivity(activity)}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
              >
                View Details <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex z-99999 justify-center items-center gap-2 mb-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1.5 border rounded-lg hover:cursor-pointer text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1.5 border rounded-lg hover:cursor-pointer text-gray-600 hover:bg-gray-100 ${
                page === i + 1 ? "bg-gray-200 font-bold" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1.5 border rounded-lg hover:cursor-pointer text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative bg-black rounded-lg overflow-hidden max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <video src={selectedVideo} controls autoPlay className="w-full h-auto rounded-lg" />
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-2 text-white hover:cursor-pointer bg-black/60 hover:bg-black/80 rounded-full p-2 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <h2 className="text-2xl p-6 font-bold text-gray-800 tracking-wide">
              {selectedActivity.title}
            </h2>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 hover:cursor-pointer text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition"
            >
              ✕
            </button>

            <div className="relative  w-full mt-4 p-3 h-72 md:h-80 rounded-t-2xl overflow-hidden">
              {selectedActivity.video ? (
                <video
                  src={selectedActivity.video}
                  controls
                  autoPlay
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <img
                  src={selectedActivity.images?.[0] || "/placeholder.png"}
                  alt={selectedActivity.title}
                  className="w-full h-full rounded-2xl object-cover"
                />
              )}
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-2 flex-wrap text-sm">
                {selectedActivity.difficulty && (
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                    {selectedActivity.difficulty}
                  </span>
                )}
                {selectedActivity.time && (
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                    ⏱ {selectedActivity.time}
                  </span>
                )}
              </div>

              {selectedActivity.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">About this Activity</h3>
                  <div
                    className="text-gray-700 prose"
                    dangerouslySetInnerHTML={{ __html: selectedActivity.description }}
                  />
                </div>
              )}

              {toArray(selectedActivity.materials).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">🧺 Materials Needed</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {toArray(selectedActivity.materials).map((m, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-gray-700 transition hover:bg-indigo-50"
                      >
                        <span className="font-bold text-indigo-600">✓</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedActivity.instruction_sheet &&
                typeof selectedActivity.instruction_sheet === "string" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      🪄 Step-by-Step Instructions
                    </h3>
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedActivity.instruction_sheet }}
                      className="prose mt-4"
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiyActivities;




























// import { useState, useMemo } from "react";
// import { ChevronRight, Play } from "lucide-react";
// import { useGetActivitiesQuery } from "@/redux/features/AdminDiyActivity/activityApi";

// interface Activity {
//   id: number;
//   title: string;
//   theme: string;
//   images?: string[];
//   video?: string;
//   time?: string;
//   difficulty?: string;
//   materials?: string[] | string;
//   instruction_sheet?: string[] | string;
//   description?: string;
// }

// const DiyActivities: React.FC = () => {
//   const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
//   const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
//   const [page, setPage] = useState<number>(1);
//   const activitiesPerPage = 9;

//   const { data: activitiesData, isLoading, isError } = useGetActivitiesQuery();

//   console.log(activitiesData)
//   const activities: Activity[] = activitiesData?.data || [];

//   const filtered = useMemo(() => activities, [activities]);

//   const totalPages = Math.ceil(filtered.length / activitiesPerPage);

//   // Get activities for current page
//   const paginated = useMemo(() => {
//     const start = (page - 1) * activitiesPerPage;
//     return filtered.slice(start, start + activitiesPerPage);
//   }, [page, filtered]);

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
//   };

//   const handleCloseModal = () => setSelectedActivity(null);

//   // Helper to convert string or array to array
//   const toArray = (data?: string[] | string): string[] => {
//     if (!data) return [];
//     return Array.isArray(data) ? data : data.split(";").map(s => s.trim()).filter(Boolean);
//   };

//   if (isLoading) return <p>Loading activities...</p>;
//   if (isError) return <p>Error fetching activities.</p>;

//   return (
//     <div className="container mx-auto mt-10">
//       {/* Header */}
//       <div className="mb-12">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="text-4xl">🎨</div>
//           <h1 className="text-4xl font-bold text-gray-800">DIY Activities</h1>
//         </div>
//         <p className="text-lg text-gray-600">
//           Explore amazing themed decorations and celebrations for your perfect party
//         </p>
//       </div>

//       {/* Activities Grid */}
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
//               {activity.video && (
//                 <button
//                   onClick={() => setSelectedVideo(activity.video!)}
//                   className="absolute  inset-0 flex items-center justify-center hover:cursor-pointer bg-black/30 hover:bg-black/40 transition"
//                 >
//                   <div className="bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition">
//                     <Play size={22} fill="white" />
//                   </div>
//                 </button>
//               )}
//             </div>
//             <div className="flex-1 p-4 flex flex-col">
//               <h3 className="mb-2 line-clamp-2 text-lg font-medium">{activity.title}</h3>
//               <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">{activity.description}</p>
//               <button
//                 onClick={() => setSelectedActivity(activity)}
//                 className="mt-auto flex w-full items-center hover:cursor-pointer justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
//               >
//                 View Details <ChevronRight size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex z-99999 justify-center items-center gap-2 mb-10">
//           <button
//             onClick={() => handlePageChange(page - 1)}
//             disabled={page === 1}
//             className="px-3 py-1.5 border rounded-lg hover:cursor-pointer text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Prev
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => handlePageChange(i + 1)}
//               className={`px-3 py-1.5 border rounded-lg hover:cursor-pointer text-gray-600 hover:bg-gray-100 ${
//                 page === i + 1 ? "bg-gray-200 font-bold" : ""
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}

//           <button
//             onClick={() => handlePageChange(page + 1)}
//             disabled={page === totalPages}
//             className="px-3 py-1.5 border rounded-lg hover:cursor-pointer text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Video Modal */}
//       {selectedVideo && (
//         <div
//           className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
//           onClick={() => setSelectedVideo(null)}
//         >
//           <div
//             className="relative bg-black rounded-lg overflow-hidden max-w-3xl w-full"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <video src={selectedVideo} controls autoPlay className="w-full h-auto rounded-lg" />
//             <button
//               onClick={() => setSelectedVideo(null)}
//               className="absolute top-2 right-2 text-white hover:cursor-pointer bg-black/60 hover:bg-black/80 rounded-full p-2 transition"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Activity Details Modal */}
//       {selectedActivity && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
//             <h2 className="text-2xl p-6 font-bold text-gray-800 tracking-wide">
//               {selectedActivity.title}
//             </h2>
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-4 right-4 hover:cursor-pointer text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition"
//             >
//               ✕
//             </button>

//             <div className="relative w-full mt-4 p-3 h-72 md:h-80 rounded-t-2xl overflow-hidden">
//               {selectedActivity.video ? (
//                 <video
//                   src={selectedActivity.video}
//                   controls
//                   autoPlay
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <img
//                   src={selectedActivity.images?.[0] || "/placeholder.png"}
//                   alt={selectedActivity.title}
//                   className="w-full h-full object-cover"
//                 />
//               )}
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Difficulty & Time */}
//               <div className="flex gap-2 flex-wrap text-sm">
//                 {selectedActivity.difficulty && (
//                   <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
//                     {selectedActivity.difficulty}
//                   </span>
//                 )}
//                 {selectedActivity.time && (
//                   <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
//                     ⏱ {selectedActivity.time}
//                   </span>
//                 )}
//               </div>

//               {/* Description */}
//               {selectedActivity.description && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-2">About this Activity</h3>
//                   <div
//                     className="text-gray-700 prose"
//                     dangerouslySetInnerHTML={{ __html: selectedActivity.description }}
//                   />
//                 </div>
//               )}

//               {/* Materials */}
//               {toArray(selectedActivity.materials).length > 0 && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-3">🧺 Materials Needed</h3>
//                   <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                     {toArray(selectedActivity.materials).map((m, i) => (
//                       <li
//                         key={i}
//                         className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 transition"
//                       >
//                         <span className="text-indigo-600 font-bold">✓</span> {m}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

            


// {selectedActivity.instruction_sheet && typeof selectedActivity.instruction_sheet === "string" && (
//   <div>
//     <h3 className="text-lg font-semibold text-gray-800 mb-3">🪄 Step-by-Step Instructions</h3>

//    <div dangerouslySetInnerHTML={{ __html: selectedActivity.instruction_sheet }} className="prose mt-4" />

//   </div>
// )}

 



//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DiyActivities;





















// import { useState, useMemo } from "react";
// import { ChevronRight, Play } from "lucide-react";
// import { useGetActivitiesQuery } from "@/redux/features/AdminDiyActivity/activityApi";

// interface Activity {
//   id: number;
//   title: string;
//   theme: string;
//   images?: string[];
//   video?: string;
//   time?: string;
//   difficulty?: string;
//   materials?: string[] | string;
//   instruction_sheet?: string[] | string;
//   description?: string;
// }

// const DiyActivities: React.FC = () => {
//   const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
//   const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
//   const [page, setPage] = useState<number>(1);
//   const activitiesPerPage = 9;

//   const { data: activitiesData, isLoading, isError } = useGetActivitiesQuery();
//   const activities: Activity[] = activitiesData?.data || [];

//   const filtered = useMemo(() => activities, [activities]);

//   const indexOfLastActivity = page * activitiesPerPage;
//   const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
//   const paginated = filtered.slice(indexOfFirstActivity, indexOfLastActivity);
//   const totalPages = Math.ceil(filtered.length / activitiesPerPage);

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
//   };

//   if (isLoading) return <p>Loading activities...</p>;
//   if (isError) return <p>Error fetching activities.</p>;

//   const handleCloseModal = () => setSelectedActivity(null);

//   // Helper to convert string or array to array
//   const toArray = (data?: string[] | string): string[] => {
//     if (!data) return [];
//     return Array.isArray(data) ? data : data.split(";").map(s => s.trim()).filter(Boolean);
//   };

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

//       {/* Activities Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
//               {activity.video && (
//                 <button
//                   onClick={() => setSelectedVideo(activity.video!)}
//                   className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
//                 >
//                   <div className="bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition">
//                     <Play size={22} fill="white" />
//                   </div>
//                 </button>
//               )}
//             </div>

//             <div className="flex-1 p-4 flex flex-col">
//               <h3 className="mb-2 line-clamp-2 text-lg font-medium">{activity.title}</h3>
//               <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">{activity.description}</p>
//               <button
//                 onClick={() => setSelectedActivity(activity)}
//                 className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
//               >
//                 View Details <ChevronRight size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       Pagination
//       {filtered.length > 0 && (
//         <div className="mt-6 flex items-center justify-center gap-3">
//           <button
//             onClick={() => handlePageChange(page - 1)}
//             disabled={page <= 1}
//             className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="text-sm text-gray-700 font-medium">{page} / {totalPages}</span>
//           <button
//             onClick={() => handlePageChange(page + 1)}
//             disabled={page >= totalPages}
//             className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}



// {filtered.length > 0 && (
//         <div className="mt-6 flex items-center justify-between px-4 py-3">
//           <div className="text-sm text-gray-600">
//             Showing <span className="font-medium">{paginatedBlogs.length}</span>{" "}
//             of <span className="font-medium">{total}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page <= 1}
//               className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:cursor-pointer hover:bg-gray-100 disabled:opacity-50"
//             >
//               Prev
//             </button>
//             <div className="min-w-[50px] rounded-md border bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
//               {page} / {totalPages}
//             </div>
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page >= totalPages}
//               className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:cursor-pointer hover:bg-gray-100 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}








//       {/* Video Modal */}
//       {selectedVideo && (
//         <div
//           className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
//           onClick={() => setSelectedVideo(null)}
//         >
//           <div
//             className="relative bg-black rounded-lg overflow-hidden max-w-3xl w-full"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <video src={selectedVideo} controls autoPlay className="w-full h-auto rounded-lg" />
//             <button
//               onClick={() => setSelectedVideo(null)}
//               className="absolute top-2 right-2 text-white bg-black/60 hover:bg-black/80 rounded-full p-2 transition"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Activity Modal */}
//       {/* {selectedActivity && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
//             <h2 className="text-2xl p-6 font-bold text-gray-800 tracking-wide">{selectedActivity.title}</h2>
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition"
//             >
//               ✕
//             </button>

//             <div className="relative w-full mt-4 p-3 h-72 md:h-80 rounded-t-2xl overflow-hidden">
//               {selectedActivity.video ? (
//                 <video src={selectedActivity.video} controls autoPlay className="w-full h-full object-cover" />
//               ) : (
//                 <img
//                   src={selectedActivity.images?.[0] || "/placeholder.png"}
//                   alt={selectedActivity.title}
//                   className="w-full h-full object-cover"
//                 />
//               )}
//             </div>

//             <div className="p-6 space-y-8">
//                <div className="flex gap-2 flex-wrap text-sm">
//                 {selectedActivity.difficulty && (
//                   <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{selectedActivity.difficulty}</span>
//                 )}
//                 {selectedActivity.time && (
//                   <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">⏱ {selectedActivity.time}</span>
//                 )}
//               </div>

              
//  {selectedActivity.description && (
//   <div>
//     <h3 className="text-lg font-semibold text-gray-800 mb-2">About this Activity</h3>
//     <div
//       className="text-gray-700 leading-relaxed prose"
//       dangerouslySetInnerHTML={{ __html: selectedActivity.description }}
//     />
//   </div>
// )}

//  {selectedActivity.instruction_sheet && (
//   <div>
//     <h3 className="text-lg font-semibold text-gray-800 mb-3">🪄 Step-by-Step Instructions</h3>
//     <div
//       className="text-gray-700 prose"
//       dangerouslySetInnerHTML={{ __html: selectedActivity.instruction_sheet }}
//     />
//   </div>
// )}






//             </div>
//           </div>
//         </div>
//       )} */}


// {selectedActivity && (
//   <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//     <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
      
//       {/* Title */}
//       <h2 className="text-2xl p-6 font-bold text-gray-800 tracking-wide">
//         {selectedActivity.title}
//       </h2>

//       {/* Close Button */}
//       <button
//         onClick={handleCloseModal}
//         className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition"
//       >
//         ✕
//       </button>

//       {/* Video / Image */}
//       <div className="relative w-full mt-4 p-3 h-72 md:h-80 rounded-t-2xl overflow-hidden">
//         {selectedActivity.video ? (
//           <video
//             src={selectedActivity.video}
//             controls
//             autoPlay
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <img
//             src={selectedActivity.images?.[0] || "/placeholder.png"}
//             alt={selectedActivity.title}
//             className="w-full h-full object-cover"
//           />
//         )}
//       </div>

//       {/* Details */}
//       <div className="p-6 space-y-6">

//         {/* Difficulty & Time */}
//         <div className="flex gap-2 flex-wrap text-sm">
//           {selectedActivity.difficulty && (
//             <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
//               {selectedActivity.difficulty}
//             </span>
//           )}
//           {selectedActivity.time && (
//             <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
//               ⏱ {selectedActivity.time}
//             </span>
//           )}
//         </div>

//         {/* Description (Rich Text) */}
//         {selectedActivity.description && (
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">About this Activity</h3>
//             <div
//               className="text-gray-700 prose"
//               dangerouslySetInnerHTML={{ __html: selectedActivity.description }}
//             />
//           </div>
//         )}

//         {/* Materials */}
//         {toArray(selectedActivity.materials).length > 0 && (
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">🧺 Materials Needed</h3>
//             <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//               {toArray(selectedActivity.materials).map((m, i) => (
//                 <li
//                   key={i}
//                   className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 transition"
//                 >
//                   <span className="text-indigo-600 font-bold">✓</span> {m}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Instruction Sheet (Rich Text) */}
//         {selectedActivity.instruction_sheet && (
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">🪄 Step-by-Step Instructions</h3>
//             <div
//               className="text-gray-700 prose"
//               dangerouslySetInnerHTML={{ __html: selectedActivity.instruction_sheet }}
//             />
//           </div>
//         )}

//       </div>
//     </div>
//   </div>
// )}



//     </div>
//   );
// };

// export default DiyActivities;











 