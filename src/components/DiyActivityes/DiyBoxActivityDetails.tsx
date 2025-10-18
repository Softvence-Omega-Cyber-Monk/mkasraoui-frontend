import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, FileText, Trash2, Send, Clock } from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetProductActivityQuery,
} from "@/redux/features/AdminDiyActivity/activityApi";
import {
  useCreateDiyBoxActivityReviewMutation,
  useDeleteDiyBoxActivityReviewMutation,
} from "@/redux/features/DiyActivityReviwe/diyBoxActivityReviewApi";
import type { IDiyBoxActivityReview } from "@/redux/types/IDiyBoxActivityReview.type";

interface Activity {
  id: string;
  title: string;
  description?: string;
  video?: string;
  pdfFile?: string;
  materials?: string[] | string;
  instruction_sheet?: string;
  difficulty?: string;
  time?: string;
  images?: string[];
  activityReview?: IDiyBoxActivityReview[];
  avg_rating?: number;
  total_review?: number;
}

const DiyBoxActivityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: activityData, isLoading, isError, refetch } =
    useGetProductActivityQuery(id!);

  const [createReview, { isLoading: isCreating }] =
    useCreateDiyBoxActivityReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] =
    useDeleteDiyBoxActivityReviewMutation();

  const [newReview, setNewReview] = useState<Partial<IDiyBoxActivityReview>>({
    rating: 5,
    description: "",
    productId: id,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading activity...
      </div>
    );

  if (isError || !activityData?.data)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-medium text-lg">
        Error loading activity.
      </div>
    );

  const activity: Activity = activityData.data;
  const activityReviews = activity.activityReview || [];

  const handleAddReview = async () => {
    if (!id || !newReview.description) return;
    try {
      await createReview({ ...newReview, productId: id }).unwrap();
      setNewReview({ rating: 5, description: "", productId: id });
      await refetch();
    } catch {
      alert("Failed to add review.");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(reviewId).unwrap();
      await refetch();
    } catch {
      alert("Failed to delete review.");
    }
  };

  return (
   
      <div className="container mx-auto space-y-6 mt-6">
        <div>
             <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer text-[#223B7D] transition"
        >
          <ArrowLeft size={20} /> Back
        </button>

        </div>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className=""
        >
          <h2 className="text-3xl font-bold text-gray-800">{activity.title}</h2>

          {(activity.difficulty || activity.time) && (
            <div className="flex justify-center gap-3 mt-3 flex-wrap">
              {activity.difficulty && (
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                  🎯 {activity.difficulty}
                </span>
              )}
              {activity.time && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Clock size={14} /> {activity.time}
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl   overflow-hidden"
        >
          {activity.video ? (
            <video
              src={activity.video}
              controls
              className="w-full h-[450px] object-cover"
            />
          ) : (
            <img
              src={activity.images?.[0] || "/placeholder.png"}
              alt={activity.title}
              className="w-full h-[450px] object-cover"
            />
          )}
        </motion.div>

        {/* PDF Section */}
        {activity.pdfFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl"
          >
            <h3 className="text-lg font-semibold   flex items-center gap-2 mb-2">
              <FileText size={18} /> Instruction PDF
            </h3>
            <a
              href={activity.pdfFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              View or download the PDF
            </a>
          </motion.div>
        )}

        {/* Description Section */}
        {activity.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl "
          >
            <h3 className="text-xl font-bold  mb-3">
              About this Activity
            </h3>
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: activity.description }}
            />
          </motion.div>
        )}
        {activity.instruction_sheet && (
        <div className="mb-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 ">
            🪄 Instructions
          </h3>
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: activity.instruction_sheet,
            }}
          />
        </div>
      )}



        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl "
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800"> Reviews</h2>

          {/* Add Review */}
          <div className="mb-8 border-b border-[#D1D5DC] pb-5">
            <h3 className="font-semibold mb-3 text-[#223B7D]">
              Add Your Review
            </h3>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={`cursor-pointer transition-transform duration-150 hover:scale-110 ${
                    i < (newReview.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() =>
                    setNewReview({ ...newReview, rating: i + 1 })
                  }
                />
              ))}
            </div>
            <textarea
              placeholder="Write your review..."
              value={newReview.description}
              onChange={(e) =>
                setNewReview({ ...newReview, description: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={handleAddReview}
              disabled={isCreating}
              className="bg-[#223B7D] cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#041c5e] transition shadow"
            >
              <Send size={16} />
              {isCreating ? "Submitting..." : "Submit Review"}
            </button>
          </div>

          {/* Review List */}
          <motion.div layout className="space-y-4">
            {activityReviews.length === 0 ? (
              <p className="text-gray-600">
                No reviews yet. Be the first to add one!
              </p>
            ) : (
              activityReviews.map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4   rounded-xl bg-gray-50 hover:bg-gray-100 shadow-sm flex justify-between items-start transition"
                >
                  <div>
                    <div className="flex items-center gap-1 mb-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < review.rating ? "currentColor" : "none"}
                          stroke="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-gray-800">{review.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-700 transition cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>
   
  );
};

export default DiyBoxActivityDetails;













// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Star,
//   Clock,
//   ArrowLeft,
//   FileText,
//   Trash2,
//   Send,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import {
//   useGetProductActivityQuery,
// } from "@/redux/features/AdminDiyActivity/activityApi";
// import {
//   useCreateDiyBoxActivityReviewMutation,
//   useDeleteDiyBoxActivityReviewMutation,
// } from "@/redux/features/DiyActivityReviwe/diyBoxActivityReviewApi";
// import type { IDiyBoxActivityReview } from "@/redux/types/IDiyBoxActivityReview.type";

// interface Activity {
//   id: string;
//   title: string;
//   description?: string;
//   video?: string;
//   pdfFile?: string;
//   materials?: string[] | string;
//   instruction_sheet?: string;
//   difficulty?: string;
//   time?: string;
//   images?: string[];
//   activityReview?: IDiyBoxActivityReview[];
//   avg_rating?: number;
//   total_review?: number;
// }

// const DiyBoxActivityDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const {
//     data: activityData,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetProductActivityQuery(id!);

//   const [createReview, { isLoading: isCreating }] =
//     useCreateDiyBoxActivityReviewMutation();
//   const [deleteReview, { isLoading: isDeleting }] =
//     useDeleteDiyBoxActivityReviewMutation();

//   const [newReview, setNewReview] = useState<Partial<IDiyBoxActivityReview>>({
//     rating: 5,
//     description: "",
//     productId: id,
//   });

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-500 animate-pulse text-lg">
//         Loading activity...
//       </div>
//     );

//   if (isError || !activityData?.data)
//     return (
//       <div className="flex justify-center items-center h-screen text-red-600 font-medium text-lg">
//         Error loading activity.
//       </div>
//     );

//   const activity: Activity = activityData.data;
//   const activityReviews = activity.activityReview || [];

//   const toArray = (data?: string[] | string): string[] =>
//     !data
//       ? []
//       : Array.isArray(data)
//       ? data
//       : data.split(";").map((s) => s.trim()).filter(Boolean);

//   const handleAddReview = async () => {
//     if (!id || !newReview.description) return;
//     try {
//       await createReview({ ...newReview, productId: id }).unwrap();
//       setNewReview({ rating: 5, description: "", productId: id });
//       await refetch();
//     } catch {
//       alert("Failed to add review.");
//     }
//   };

//   const handleDeleteReview = async (reviewId: string) => {
//     if (!confirm("Delete this review?")) return;
//     try {
//       await deleteReview(reviewId).unwrap();
//       await refetch();
//     } catch {
//       alert("Failed to delete review.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
//       {/* Top Bar */}
//       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 px-6 flex items-center justify-between shadow-md">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-white hover:text-yellow-300 transition"
//         >
//           <ArrowLeft size={20} /> Back
//         </button>
//         <h1 className="text-2xl font-bold">{activity.title}</h1>
//         <div />
//       </div>

//       {/* Main Content - Split Layout */}
//       <div className="container mx-auto px-4 py-10 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
//         {/* Left Side - Video/Image */}
//         <motion.div
//           initial={{ opacity: 0, x: -40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           className="rounded-2xl overflow-hidden shadow-xl bg-white"
//         >
//           {activity.video ? (
//             <video
//               src={activity.video}
//               controls
//               className="w-full h-[400px] object-cover"
//             />
//           ) : (
//             <img
//               src={activity.images?.[0] || "/placeholder.png"}
//               alt={activity.title}
//               className="w-full h-[400px] object-cover"
//             />
//           )}
//         </motion.div>

//         {/* Right Side - Activity Info */}
//         <motion.div
//           initial={{ opacity: 0, x: 40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//           className="bg-white rounded-2xl shadow-md p-6 flex flex-col space-y-5"
//         >
//           {/* Rating */}
//           {activity.avg_rating !== undefined && (
//             <div className="flex items-center gap-2 text-yellow-500">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   size={20}
//                   fill={i < (activity.avg_rating ?? 0) ? "currentColor" : "none"}
//                   stroke="currentColor"
//                 />
//               ))}
//               <span className="text-gray-700 ml-2">
//                 ({activity.avg_rating ?? 0}/5 • {activity.total_review ?? 0} reviews)
//               </span>
//             </div>
//           )}

//           {/* Description */}
//           {activity.description && (
//             <div>
//               <h3 className="text-xl font-semibold text-indigo-700 mb-2">
//                 About this Activity
//               </h3>
//               <div
//                 className="text-gray-700 leading-relaxed"
//                 dangerouslySetInnerHTML={{ __html: activity.description }}
//               />
//             </div>
//           )}

//           {/* Tags */}
//           <div className="flex flex-wrap gap-3">
//             {activity.difficulty && (
//               <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium shadow-sm">
//                 🎯 {activity.difficulty}
//               </span>
//             )}
//             {activity.time && (
//               <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium shadow-sm flex items-center gap-1">
//                 <Clock size={14} /> {activity.time}
//               </span>
//             )}
//           </div>

//           {/* Materials */}
//           {toArray(activity.materials).length > 0 && (
//             <div>
//               <h3 className="text-lg font-semibold text-indigo-700 mb-2">
//                 🧺 Materials Needed
//               </h3>
//               <ul className="list-disc list-inside text-gray-700 space-y-1">
//                 {toArray(activity.materials).map((m, i) => (
//                   <li key={i}>{m}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* PDF */}
//           {activity.pdfFile && (
//             <div>
//               <h3 className="text-lg font-semibold text-indigo-700 mb-2 flex items-center gap-2">
//                 <FileText size={18} /> Instruction PDF
//               </h3>
//               <a
//                 href={activity.pdfFile}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-indigo-600 hover:underline text-sm"
//               >
//                 View or download PDF
//               </a>
//             </div>
//           )}
//         </motion.div>
//       </div>

//       {/* Bottom - Reviews Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="container mx-auto px-4 max-w-5xl pb-20"
//       >
//         <div className="bg-white rounded-2xl p-8 shadow-lg">
//           <h2 className="text-2xl font-bold mb-6 text-gray-800">⭐ Reviews</h2>

//           {/* Add Review */}
//           <div className="mb-8 border-b pb-5">
//             <h3 className="font-semibold mb-3 text-indigo-700">
//               Add Your Review
//             </h3>
//             <div className="flex gap-1 mb-3">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   size={22}
//                   className="cursor-pointer transition-transform hover:scale-110"
//                   fill={i < (newReview.rating || 0) ? "gold" : "none"}
//                   stroke="gold"
//                   onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
//                 />
//               ))}
//             </div>
//             <textarea
//               placeholder="Write your review..."
//               value={newReview.description}
//               onChange={(e) =>
//                 setNewReview({ ...newReview, description: e.target.value })
//               }
//               className="w-full p-3 border rounded-xl mb-3 focus:ring-2 focus:ring-indigo-300"
//             />
//             <button
//               onClick={handleAddReview}
//               disabled={isCreating}
//               className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition shadow"
//             >
//               <Send size={16} />
//               {isCreating ? "Submitting..." : "Submit Review"}
//             </button>
//           </div>

//           {/* Review List */}
//           <div className="space-y-4">
//             {activityReviews.length === 0 ? (
//               <p className="text-gray-600">
//                 No reviews yet. Be the first to add one!
//               </p>
//             ) : (
//               activityReviews.map((review) => (
//                 <motion.div
//                   key={review.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 shadow-sm flex justify-between items-start transition"
//                 >
//                   <div>
//                     <div className="flex items-center gap-1 mb-1 text-yellow-500">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           size={16}
//                           fill={i < review.rating ? "currentColor" : "none"}
//                           stroke="currentColor"
//                         />
//                       ))}
//                     </div>
//                     <p className="text-gray-800">{review.description}</p>
//                   </div>
//                   <button
//                     onClick={() => handleDeleteReview(review.id)}
//                     disabled={isDeleting}
//                     className="text-red-500 hover:text-red-700 transition"
//                     title="Delete Review"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </motion.div>
//               ))
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default DiyBoxActivityDetails;















// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Star,
//   Clock,
//   ArrowLeft,
//   FileText,
//   Trash2,
//   Send,
//   Sparkles, // Adding a relevant icon for DIY activity box
// } from "lucide-react";
// import { motion } from "framer-motion";
// import {
//   useGetProductActivityQuery,
// } from "@/redux/features/AdminDiyActivity/activityApi";
// import {
//   useCreateDiyBoxActivityReviewMutation,
//   useDeleteDiyBoxActivityReviewMutation,
// } from "@/redux/features/DiyActivityReviwe/diyBoxActivityReviewApi";
// import type { IDiyBoxActivityReview } from "@/redux/types/IDiyBoxActivityReview.type";

// interface Activity {
//   id: string;
//   title: string;
//   description?: string;
//   video?: string;
//   pdfFile?: string;
//   materials?: string[] | string;
//   instruction_sheet?: string;
//   difficulty?: string;
//   time?: string;
//   images?: string[];
//   activityReview?: IDiyBoxActivityReview[];
//   avg_rating?: number;
//   total_review?: number;
// }

// const DiyBoxActivityDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const {
//     data: activityData,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetProductActivityQuery(id!);

//   const [createReview, { isLoading: isCreating }] =
//     useCreateDiyBoxActivityReviewMutation();
//   const [deleteReview, { isLoading: isDeleting }] =
//     useDeleteDiyBoxActivityReviewMutation();

//   const [newReview, setNewReview] = useState<Partial<IDiyBoxActivityReview>>({
//     rating: 5,
//     description: "",
//     productId: id,
//   });

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-500 animate-pulse text-lg">
//         Loading activity...
//       </div>
//     );

//   if (isError || !activityData?.data)
//     return (
//       <div className="flex justify-center items-center h-screen text-red-600 font-medium text-lg">
//         Error loading activity.
//       </div>
//     );

//   const activity: Activity = activityData.data;
//   const activityReviews = activity.activityReview || [];

//   const toArray = (data?: string[] | string): string[] =>
//     !data
//       ? []
//       : Array.isArray(data)
//       ? data
//       : data.split(";").map((s) => s.trim()).filter(Boolean);

//   const handleAddReview = async () => {
//     if (!id || !newReview.description) return;
//     try {
//       await createReview({ ...newReview, productId: id }).unwrap();
//       setNewReview({ rating: 5, description: "", productId: id });
//       await refetch();
//     } catch {
//       alert("Failed to add review.");
//     }
//   };

//   const handleDeleteReview = async (reviewId: string) => {
//     if (!confirm("Delete this review?")) return;
//     try {
//       await deleteReview(reviewId).unwrap();
//       await refetch();
//     } catch {
//       alert("Failed to delete review.");
//     }
//   };

//   // --- Visual Enhancement for Image's Banner Style ---
//   // The original image has a banner style background. We'll use a subtle div
//   // above the main content to mimic this decorative top area.
//   const BannerDecoration = () => (
//     <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden">
//       <div className="w-full h-full bg-gradient-to-r from-pink-100 to-green-100 opacity-70" />
//       <div className="absolute top-0 left-0 w-full flex justify-start pl-6 pt-2 gap-2">
//         {/* Decorative pennant/bunting flags, like in the image */}
//         <span className="text-red-500 transform rotate-12 text-2xl">▲</span>
//         <span className="text-green-500 transform -rotate-6 text-2xl">▲</span>
//         <span className="text-blue-500 transform rotate-45 text-2xl">▲</span>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen relative bg-white">
//       {/* Decorative Banner Top */}
//       <BannerDecoration />

//       {/* Header/Top Bar (Styled to blend with the app) */}
//       <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-4 px-6 flex items-center justify-between shadow-xl">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-white hover:text-yellow-300 transition"
//         >
//           <ArrowLeft size={20} /> Back to Activities
//         </button>
//         <h1 className="text-xl font-extrabold flex items-center gap-2">
//           <Sparkles size={24} className="text-yellow-300" />
//           DIY Activity Details
//         </h1>
//         <div />
//       </div>

//       {/* Main Content - Split Layout */}
//       <div className="container mx-auto px-4 py-10 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start relative z-0">
//         {/* Left Side - Video/Image (Mimicking the Fabric Image) */}
//         <motion.div
//           initial={{ opacity: 0, x: -40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           className="rounded-2xl overflow-hidden shadow-2xl bg-gray-100"
//         >
//           {activity.video ? (
//             <video
//               src={activity.video}
//               controls
//               className="w-full h-[500px] object-cover"
//             />
//           ) : (
//             <img
//               // Using a placeholder that suggests a pile of materials/fabrics
//               src={activity.images?.[0] || "https://images.unsplash.com/photo-1596702758117-910e9f1665a6?fit=crop&w=800&q=80"}
//               alt={activity.title}
//               className="w-full h-[500px] object-cover"
//             />
//           )}
//         </motion.div>

//         {/* Right Side - Activity Info */}
//         <motion.div
//           initial={{ opacity: 0, x: 40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//           className="bg-white rounded-2xl p-8 flex flex-col space-y-6 border border-gray-100 shadow-xl"
//         >
//           {/* Title and Badge (Similar to DIY_Box/10 years) */}
//           <div className="flex justify-between items-center pb-2 border-b">
//             <h2 className="text-4xl font-extrabold text-gray-900">
//               {activity.title}
//             </h2>
//             <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full shadow-md">
//               DIY_BOX {activity.time ? `~${activity.time}` : 'Activity'}
//             </span>
//           </div>

//           {/* Description */}
//           {activity.description && (
//             <div className="space-y-2">
//               <h3 className="text-xl font-semibold text-indigo-700">
//                 Summary
//               </h3>
//               <div
//                 className="text-gray-700 leading-relaxed"
//                 // The description in the original code uses dangerouslySetInnerHTML, keeping it here
//                 dangerouslySetInnerHTML={{ __html: activity.description }}
//               />
//             </div>
//           )}

//           {/* Tags (Difficulty & Time) */}
//           <div className="flex flex-wrap gap-4 pt-2">
//             {activity.difficulty && (
//               <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm">
//                 🎯 Difficulty: <span className="font-bold">{activity.difficulty}</span>
//               </span>
//             )}
//             {activity.time && (
//               <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm">
//                 <Clock size={16} /> Est. Time: <span className="font-bold">{activity.time}</span>
//               </span>
//             )}
//           </div>
          
//           {/* Rating */}
//           {activity.avg_rating !== undefined && (
//             <div className="flex items-center gap-2 text-yellow-500 text-lg">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   size={24}
//                   fill={i < (activity.avg_rating ?? 0) ? "currentColor" : "#e5e7eb"} // Gray for empty stars
//                   stroke="currentColor"
//                 />
//               ))}
//               <span className="text-gray-800 font-semibold ml-1">
//                 {activity.avg_rating?.toFixed(2)}/5
//               </span>
//               <span className="text-gray-500">
//                 ({activity.total_review ?? 0} reviews)
//               </span>
//             </div>
//           )}

//           {/* Materials */}
//           {toArray(activity.materials).length > 0 && (
//             <div className="pt-2">
//               <h3 className="text-xl font-semibold text-indigo-700 mb-2 flex items-center gap-2">
//                 🧺 Materials Needed
//               </h3>
//               <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
//                 {toArray(activity.materials).map((m, i) => (
//                   <li key={i} className="text-base">{m}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* PDF */}
//           {activity.pdfFile && (
//             <div className="pt-2">
            
//               <a
//                 href={activity.pdfFile}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-indigo-600 font-medium hover:underline flex items-center gap-1 transition text-base"
//               >
//                 Download PDF Instructions
//               </a>
//             </div>
//           )}
//         </motion.div>
//       </div>






//       {/* Horizontal Line before reviews for separation */}
//       <hr className="my-10 border-gray-200 container mx-auto max-w-5xl" />
// <div className="flex"><div className=" max-w-5xl mx-auto  ">
//       {activity.instruction_sheet && (
//         <div className="mb-6 p-5 border  rounded-lg bg-white shadow-sm">
//           <h3 className="text-lg font-semibold mb-2 text-indigo-700">
//             🪄 Instructions
//           </h3>
//           <div
//             className="prose"
//             dangerouslySetInnerHTML={{
//               __html: activity.instruction_sheet,
//             }}
//           />
//         </div>
//       )}
// </div>
//       {/* Bottom - Reviews Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="container mx-auto px-4 max-w-5xl pb-20"
//       >
//         <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
//           <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
//             <Star className="text-yellow-500" />
//             Customer Reviews
//           </h2>

//           {/* Add Review */}
//           <div className="mb-10 p-5 border border-indigo-200 rounded-xl bg-indigo-50">
//             <h3 className="text-xl font-semibold mb-3 text-indigo-800">
//               Add Your Review
//             </h3>
//             <div className="flex gap-1 mb-4">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   size={28}
//                   className="cursor-pointer transition-all duration-200 hover:scale-110"
//                   fill={i < (newReview.rating || 0) ? "gold" : "#d1d5db"} // Lighter gray for empty
//                   stroke="gold"
//                   onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
//                 />
//               ))}
//             </div>
//             <textarea
//               placeholder="Share your thoughts on this DIY activity..."
//               value={newReview.description}
//               onChange={(e) =>
//                 setNewReview({ ...newReview, description: e.target.value })
//               }
//               rows={4}
//               className="w-full p-4 border border-gray-300 rounded-xl mb-4 focus:ring-3 focus:ring-indigo-400 focus:border-indigo-400 resize-none"
//             />
//             <button
//               onClick={handleAddReview}
//               disabled={isCreating || !newReview.description || !newReview.rating}
//               className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg disabled:bg-gray-400"
//             >
//               <Send size={18} />
//               {isCreating ? "Submitting..." : "Submit Review"}
//             </button>
//           </div>

//           {/* Review List */}
//           <div className="space-y-6">
//             {activityReviews.length === 0 ? (
//               <p className="text-gray-600 text-lg">
//                 No reviews yet. Be the first to add one! 🎉
//               </p>
//             ) : (
//               activityReviews.map((review) => (
//                 <motion.div
//                   key={review.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="p-5 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white shadow-md flex justify-between items-start transition duration-300"
//                 >
//                   <div className="flex flex-col space-y-2">
//                     <div className="flex items-center gap-1 text-yellow-500">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           size={18}
//                           fill={i < review.rating ? "currentColor" : "none"}
//                           stroke="currentColor"
//                         />
//                       ))}
//                     </div>
//                     <p className="text-gray-800 text-base italic leading-relaxed">
//                       "{review.description}"
//                     </p>
//                     {/* Assuming review has a user field, though not typed in IDiyBoxActivityReview */}
//                     {/* <p className="text-sm text-gray-500 mt-2">- Anonymous User</p> */}
//                   </div>
//                   <button
//                     onClick={() => handleDeleteReview(review.id!)}
//                     disabled={isDeleting}
//                     className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-100"
//                     title="Delete Review"
//                   >
//                     <Trash2 size={20} />
//                   </button>
//                 </motion.div>
//               ))
//             )}
//           </div>
//         </div>
//       </motion.div></div>
//     </div>
//   );
// };

// export default DiyBoxActivityDetails;














 


// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Star, Clock, ArrowLeft, FileText, Trash2, Send } from "lucide-react";
// import {
//   useGetProductActivityQuery,
// } from "@/redux/features/AdminDiyActivity/activityApi";
// import {
//   useCreateDiyBoxActivityReviewMutation,
//   useDeleteDiyBoxActivityReviewMutation,
// } from "@/redux/features/DiyActivityReviwe/diyBoxActivityReviewApi";
// import type { IDiyBoxActivityReview } from "@/redux/types/IDiyBoxActivityReview.type";

// interface Activity {
//   id: string;
//   title: string;
//   description?: string;
//   video?: string;
//   pdfFile?: string;
//   materials?: string[] | string;
//   instruction_sheet?: string;
//   difficulty?: string;
//   time?: string;
//   images?: string[];
//   activityReview?: IDiyBoxActivityReview[];
//   avg_rating?: number;
//   total_review?: number;
// }

// const DiyBoxActivityDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   // ✅ Add refetch to refresh data after adding/deleting reviews
//   const {
//     data: activityData,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetProductActivityQuery(id!);

//   const [createReview, { isLoading: isCreating }] =
//     useCreateDiyBoxActivityReviewMutation();
//   const [deleteReview, { isLoading: isDeleting }] =
//     useDeleteDiyBoxActivityReviewMutation();

//   const [newReview, setNewReview] = useState<Partial<IDiyBoxActivityReview>>({
//     rating: 5,
//     description: "",
//     productId: id,
//   });

//   if (isLoading) return <p className="text-center mt-10">Loading activity...</p>;
//   if (isError || !activityData?.data)
//     return <p className="text-center mt-10">Error loading activity.</p>;

//   const activity: Activity = activityData.data;
//   const activityReviews = activity.activityReview || [];

//   const toArray = (data?: string[] | string): string[] =>
//     !data
//       ? []
//       : Array.isArray(data)
//       ? data
//       : data.split(";").map((s) => s.trim()).filter(Boolean);

//   // ✅ After adding review, instantly refetch
//   const handleAddReview = async () => {
//     if (!id || !newReview.description) return;
//     try {
//       await createReview({ ...newReview, productId: id }).unwrap();
//       setNewReview({ rating: 5, description: "", productId: id });
//       await refetch(); // 👈 instantly updates the page
//     } catch {
//       alert("Failed to add review.");
//     }
//   };

//   // ✅ After deleting review, instantly refetch
//   const handleDeleteReview = async (reviewId: string) => {
//     if (!confirm("Delete this review?")) return;
//     try {
//       await deleteReview(reviewId).unwrap();
//       await refetch(); // 👈 refresh data after deletion
//     } catch {
//       alert("Failed to delete review.");
//     }
//   };

//   return (
//     <div className="container mx-auto mt-10 p-4 max-w-4xl">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition mb-6"
//       >
//         <ArrowLeft size={18} /> Back
//       </button>

//       {/* Title + Rating */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
//         <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
//         {activity?.avg_rating !== undefined && (
//   <div className="flex items-center text-yellow-500 mt-2 md:mt-0">
//     {[...Array(5)].map((_, i) => (
//       <Star
//         key={i}
//         size={18}
//         fill={i < (activity.avg_rating ?? 0) ? "currentColor" : "none"}
//         stroke="currentColor"
//       />
//     ))}
//     <span className="text-gray-600 ml-2">
//       ({activity.avg_rating ?? 0}/5 • {activity.total_review ?? 0} reviews)
//     </span>
//   </div>
// )}
//       </div>

//       {/* Media Section */}
//       <div className="rounded-xl overflow-hidden shadow-lg mb-6">
//         {activity.video ? (
//           <video src={activity.video} controls className="w-full rounded-lg" />
//         ) : (
//           <img
//             src={activity.images?.[0] || "/placeholder.png"}
//             alt={activity.title}
//             className="w-full h-80 object-cover"
//           />
//         )}
//       </div>

//       {/* Description */}
//       {activity.description && (
//         <div className="mb-6 bg-gray-50 p-5 rounded-lg shadow-sm">
//           <h3 className="text-lg font-semibold mb-2 text-indigo-700">
//             About this Activity
//           </h3>
//           <div
//             className="text-gray-700 leading-relaxed"
//             dangerouslySetInnerHTML={{ __html: activity.description }}
//           />
//         </div>
//       )}

//       {/* Tags */}
//       <div className="flex flex-wrap gap-2 mb-6">
//         {activity.difficulty && (
//           <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
//             🎯 {activity.difficulty}
//           </span>
//         )}
//         {activity.time && (
//           <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-1">
//             <Clock size={14} /> {activity.time}
//           </span>
//         )}
//       </div>

//       {/* Materials */}
//       {toArray(activity.materials).length > 0 && (
//         <div className="mb-6 p-5 border rounded-lg bg-white shadow-sm">
//           <h3 className="text-lg font-semibold mb-2 text-indigo-700">
//             🧺 Materials Needed
//           </h3>
//           <ul className="list-disc list-inside text-gray-700 space-y-1">
//             {toArray(activity.materials).map((m, i) => (
//               <li key={i}>{m}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Instructions */}
//       {activity.instruction_sheet && (
//         <div className="mb-6 p-5 border rounded-lg bg-white shadow-sm">
//           <h3 className="text-lg font-semibold mb-2 text-indigo-700">
//             🪄 Instructions
//           </h3>
//           <div
//             className="prose"
//             dangerouslySetInnerHTML={{
//               __html: activity.instruction_sheet,
//             }}
//           />
//         </div>
//       )}

//       {/* PDF File */}
//       {activity.pdfFile && (
//         <div className="mb-8 p-5 bg-gray-50 border rounded-lg shadow-sm">
//           <h3 className="text-lg font-semibold mb-2 text-indigo-700 flex items-center gap-2">
//             <FileText size={18} /> Instruction PDF
//           </h3>
//           <iframe
//             src={activity.pdfFile}
//             className="w-full h-[500px] border rounded-lg"
//             title="PDF Viewer"
//           />
//         </div>
//       )}

//       {/* Reviews Section */}
//       <div className="mt-10">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">⭐ Reviews</h2>

//         {/* Add Review */}
//         <div className="mb-6 bg-white border rounded-lg shadow-md p-5">
//           <h3 className="font-semibold mb-2 text-indigo-700">Add Your Review</h3>
//           <div className="flex gap-1 mb-2">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 size={20}
//                 className="cursor-pointer"
//                 fill={i < (newReview.rating || 0) ? "gold" : "none"}
//                 stroke="gold"
//                 onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
//               />
//             ))}
//           </div>
//           <textarea
//             placeholder="Write your review..."
//             value={newReview.description}
//             onChange={(e) =>
//               setNewReview({ ...newReview, description: e.target.value })
//             }
//             className="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-indigo-300"
//           />
//           <button
//             onClick={handleAddReview}
//             disabled={isCreating}
//             className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-700 transition"
//           >
//             <Send size={16} />
//             {isCreating ? "Submitting..." : "Submit Review"}
//           </button>
//         </div>

//         {/* Review List */}
//         <div className="space-y-4">
//           {activityReviews.length === 0 ? (
//             <p className="text-gray-600">
//               No reviews yet. Be the first to add one!
//             </p>
//           ) : (
//             activityReviews.map((review) => (
//               <div
//                 key={review.id}
//                 className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-start hover:shadow-md transition"
//               >
//                 <div>
//                   <div className="flex items-center gap-1 mb-1 text-yellow-500">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         size={16}
//                         fill={i < review.rating ? "currentColor" : "none"}
//                         stroke="currentColor"
//                       />
//                     ))}
//                   </div>
//                   <p className="text-gray-800">{review.description}</p>
//                 </div>
//                 <button
//                   onClick={() => handleDeleteReview(review.id)}
//                   disabled={isDeleting}
//                   className="text-red-500 hover:text-red-700 transition"
//                   title="Delete Review"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiyBoxActivityDetails;












// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useGetProductActivityQuery } from "@/redux/features/AdminDiyActivity/activityApi";
// import {
//   useCreateDiyBoxActivityReviewMutation,
//   useDeleteDiyBoxActivityReviewMutation,
// } from "@/redux/features/DiyActivityReviwe/diyBoxActivityReviewApi";
// import type { IDiyBoxActivityReview } from "@/redux/types/IDiyBoxActivityReview.type";

// interface Activity {
//   id: string;
//   title: string;
//   description?: string;
//   video?: string;
//   pdfFile?: string;
//   materials?: string[] | string;
//   instruction_sheet?: string;
//   difficulty?: string;
//   time?: string;
//   images?: string[];
//   activityReview?: IDiyBoxActivityReview[];
// }

// const DiyBoxActivityDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   // Fetch the activity by ID
//   const { data: activityData, isLoading, isError   } = useGetProductActivityQuery(id!);

//   const [createReview, { isLoading: isCreating }] = useCreateDiyBoxActivityReviewMutation();
//   const [deleteReview, { isLoading: isDeleting }] = useDeleteDiyBoxActivityReviewMutation();

//   const [newReview, setNewReview] = useState<Partial<IDiyBoxActivityReview>>({
//     rating: 5,
//     description: "",
//     productId: id,
//   });

//   if (isLoading) return <p className="text-center mt-10">Loading activity...</p>;
//   if (isError || !activityData?.data) return <p className="text-center mt-10">Error loading activity.</p>;

//   const activity: Activity = activityData.data;
//   const activityReviews = activity.activityReview || [];

//   const toArray = (data?: string[] | string): string[] => {
//     if (!data) return [];
//     return Array.isArray(data)
//       ? data
//       : data.split(";").map((s) => s.trim()).filter(Boolean);
//   };

//   const handleAddReview = async () => {
//     if (!id) return;
//     try {
//       await createReview({ ...newReview, productId: id }).unwrap();
//       setNewReview({ rating: 5, description: "", productId: id });
//       alert("Review added successfully!");
//     } catch (error: any) {
//       alert(error.message || "Failed to add review");
//     }
//   };

//   const handleDeleteReview = async (reviewId: string) => {
//     if (!confirm("Are you sure you want to delete this review?")) return;
//     try {
//       await deleteReview(reviewId).unwrap();
//       alert("Review deleted successfully!");
//     } catch (error: any) {
//       alert(error.message || "Failed to delete review");
//     }
//   };

//   return (
//     <div className="container mx-auto mt-10 p-4 max-w-4xl">
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//       >
//         ← Back
//       </button>

//       <h1 className="text-3xl font-bold mb-4">{activity.title}</h1>

//       {/* Media Section */}
//       {activity.video ? (
//         <video src={activity.video} controls className="w-full h-auto rounded-lg mb-4" />
//       ) : (
//         <img
//           src={activity.images?.[0] || "/placeholder.png"}
//           alt={activity.title}
//           className="w-full h-auto rounded-lg mb-4"
//         />
//       )}

//       {/* Description */}
//       {activity.description && (
//         <div className="mb-4">
//           <h3 className="text-lg font-semibold mb-2">About this Activity</h3>
//           <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: activity.description }} />
//         </div>
//       )}

//       {/* Difficulty & Time */}
//       {(activity.difficulty || activity.time) && (
//         <div className="flex gap-2 flex-wrap text-sm mb-4">
//           {activity.difficulty && (
//             <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{activity.difficulty}</span>
//           )}
//           {activity.time && (
//             <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">⏱ {activity.time}</span>
//           )}
//         </div>
//       )}

//       {/* Materials */}
//       {toArray(activity.materials).length > 0 && (
//         <div className="mb-4">
//           <h3 className="text-lg font-semibold mb-2">🧺 Materials Needed</h3>
//           <ul className="list-disc list-inside">
//             {toArray(activity.materials).map((m, i) => (
//               <li key={i}>{m}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Instructions */}
//       {activity.instruction_sheet && (
//         <div className="mb-4">
//           <h3 className="text-lg font-semibold mb-2">🪄 Step-by-Step Instructions</h3>
//           <div className="prose" dangerouslySetInnerHTML={{ __html: activity.instruction_sheet }} />
//         </div>
//       )}

//       {/* PDF Viewer */}
//       {activity.pdfFile && (
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2">📄 Instruction PDF</h3>
//           <iframe src={activity.pdfFile} title="PDF Viewer" className="w-full h-[600px] border rounded-lg" />
//         </div>
//       )}

//       {/* Reviews Section */}
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold mb-4">Reviews</h2>

//         {/* Add Review */}
//         <div className="mb-6 p-4 border rounded shadow">
//           <h3 className="font-semibold mb-2">Add a Review</h3>
//           <textarea
//             placeholder="Write your review..."
//             value={newReview.description}
//             onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
//             className="w-full p-2 mb-2 border rounded"
//           />
//           <input
//             type="number"
//             placeholder="Rating (1-5)"
//             value={newReview.rating}
//             min={1}
//             max={5}
//             step={0.5}
//             onChange={(e) => setNewReview({ ...newReview, rating: parseFloat(e.target.value) })}
//             className="w-full p-2 mb-2 border rounded"
//           />
//           <button
//             onClick={handleAddReview}
//             disabled={isCreating}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             {isCreating ? "Adding..." : "Add Review"}
//           </button>
//         </div>

//         {/* List Reviews */}
//         <div className="space-y-4">
//           {activityReviews.length === 0 && <p>No reviews yet. Be the first to add one!</p>}
//           {activityReviews.map((review) => (
//             <div key={review.id} className="p-4 border rounded shadow flex justify-between items-start">
//               <div>
//                 <p><strong>Rating:</strong> {review.rating}</p>
//                 <p><strong>Description:</strong> {review.description}</p>
//               </div>
//               <button
//                 onClick={() => handleDeleteReview(review.id)}
//                 disabled={isDeleting}
//                 className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//               >
//                 {isDeleting ? "Deleting..." : "Delete"}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiyBoxActivityDetails;









 