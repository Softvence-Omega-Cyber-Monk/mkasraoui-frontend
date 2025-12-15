import { useParams, useNavigate } from "react-router-dom";
import { CircleCheckBig } from "lucide-react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useEffect, useState } from "react";

import PremiumBanner from "@/components/Home/PremiumBanner";
import MyHeader from "@/components/MyHeader/MyHeader";
import {
  useGetDIYProductByIdQuery,
  useCreateReviewMutation,
} from "@/redux/features/diyProducts/diyProductsApi";
import { useGetMeQuery } from "../redux/features/user/userApi";
import PageLoader from "@/components/Shared/PageLoader";

export default function DiyBoxDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetDIYProductByIdQuery(id!);
  console.log(data);
  const { data: userData } = useGetMeQuery();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // console.log({ firstUser: userData?.email });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

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

  const [activeTab, setActiveTab] = useState("whats-included");
  const tabs = [
    { id: "whats-included", label: "What's Included" },
    { id: "activities", label: "Activities" },
    { id: "tutorial", label: "Tutorial" },
    { id: "reviews", label: "Reviews" },
  ];

  if (isLoading)
    return (
      <div className="py-10 text-center">
        <PageLoader />
      </div>
    );
  if (error || !data)
    return <div className="py-10 text-center">Something went wrong.</div>;

  const product = data;
  const isPremium = userData?.subscription?.some(plan => plan.plan_name === "Premium Subscriber");

  const handleSubmitReview = async () => {
    if (!comment.trim()) return;
    try {
      await createReview({
        productId: product.id,
        rating,
        description: comment,
      }).unwrap();
      setComment("");
      setRating(5);
      refetch();
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  // Tab content
  const renderContent = () => {
    switch (activeTab) {
      case "whats-included":
        return (
          <div className="rounded-xl border border-[#DFE1E6] bg-white p-8">
            <h2 className="mb-8 text-2xl text-gray-900">
              Everything You Need for an Amazing Party
            </h2>
            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
              {product.included?.map((item: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <CircleCheckBig className="text-[#22C55E]" />
                  <span className="leading-relaxed text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "activities":
        return (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {product.activities?.map((item) => (
              <div
                key={item.id}
                className="shadow-card hover:shadow-card-hover cursor-pointer rounded-xl border border-[#DFE1E6] bg-white p-6 transition-all duration-200"
              >
                <div className="space-y-3">
                  <h3 className="text-xl leading-tight font-medium text-[#191919]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5A5C5F]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      case "tutorial":
        return product.tutorial ? (
          // <div className="py-10">
          //   <div className="rounded-2xl bg-[#DFE1E6]/60 p-6 text-center">
          //     <Play className="mx-auto h-12 w-12 text-[#223B7D]" />
          //     <h2 className="mt-4 mb-2 text-xl font-medium sm:text-2xl">
          //       Tutorial Video
          //     </h2>
          //     <p className="text-base sm:text-lg">Watch how to use this box</p>
          //     <a
          //       href={product.tutorial}
          //       target="_blank"
          //       rel="noopener noreferrer"
          //       className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#223B7D] px-6 py-3 text-white hover:bg-blue-800"
          //     >
          //       <Play /> Watch Tutorial
          //     </a>
          //   </div>
          // </div>
          <div className="py-10">
            <div className="rounded-2xl bg-[#DFE1E6]/60 p-6 text-center">
              <h2 className="mt-4 mb-4 text-xl font-medium sm:text-2xl">
                Tutorial Video
              </h2>
              {/* <p className="mb-6 text-base sm:text-lg">
                Watch how to use this box
              </p> */}

              <video
                src={product.tutorial}
                controls
                controlsList="nodownload"
                preload="metadata"
                className="mx-auto w-full rounded-xl shadow-lg"
                onContextMenu={(e) => e.preventDefault()} // disables right-click download
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500">
            No tutorial available
          </div>
        );
      case "reviews":
        return (
          <div className="rounded-xl border border-[#DFE1E6] bg-white p-6">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Customer Reviews
            </h2>
            {!product.reviews.length ? (
              <p className="py-10 text-center text-gray-500">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              <div className="mb-6 space-y-6">
                {product.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-6 last:border-0"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">
                        Anonymous User
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="leading-relaxed text-gray-700">
                      {review.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 border-t pt-6">
              <h3 className="mb-2 text-lg font-medium">Leave a Review</h3>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-medium">Rating:</span>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="rounded border border-gray-300 px-2 py-1"
                >
                  {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                className="w-full rounded border border-gray-300 p-2"
                rows={4}
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="mt-2 w-full cursor-pointer rounded bg-[#223B7D] px-4 py-2 font-semibold text-white hover:bg-blue-900 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-0 md:pb-20">
      <MyHeader
        title=" "
        subtitle="r"
        className="-z-1 text-3xl sm:text-5xl md:text-6xl"
      />
      <div className="container mx-auto -mt-84">
        <div className="overflow-hidden rounded-2xl p-4">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Product Images */}

            <div className="lg:w-1/2">
              <div
                className="relative mb-4 h-[70vh] w-auto cursor-zoom-in overflow-hidden rounded-xl"
                onMouseMove={(e) => {
                  const img = e.currentTarget.querySelector(
                    "img",
                  ) as HTMLImageElement;
                  const { left, top, width, height } =
                    e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - left) / width) * 100;
                  const y = ((e.clientY - top) / height) * 100;
                  img.style.transformOrigin = `${x}% ${y}%`;
                  img.style.transform = "scale(2)";
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector(
                    "img",
                  ) as HTMLImageElement;
                  img.style.transformOrigin = "center center";
                  img.style.transform = "scale(1)";
                }}
              >
                <img
                  src={selectedImage || product.imges?.[0]}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-300 ease-in-out"
                />
              </div>

              <div className="flex gap-3">
                {product.imges?.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`h-20 w-20 cursor-pointer overflow-hidden rounded-xl border-2 ${
                      selectedImage === img
                        ? "border-[#223B7D]"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(img)} // Set the clicked image as main image
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Product Details */}
            <div className="p-6 lg:w-1/2 lg:p-8">
              <div className="mb-4 flex gap-2">
                <span className="rounded-full bg-[#223B7D] px-3 py-2 text-sm text-white">
                  {product.product_type}
                </span>
                <span className="rounded-full bg-[#58C06478]/70 px-3 py-2 text-sm text-[#19AE19]">
                  {product.age_range}
                </span>
              </div>
              <h3 className="font-fredoka mb-2 text-xl font-semibold text-[#191919] md:text-3xl">
                {product.title}
              </h3>
              <p className="mb-4 w-[80%] text-lg text-[#5A5C5F]">
                {product.description}
              </p>
              <div className="mb-4 flex items-center gap-4 text-xl">
                <div className="flex items-center">
                  {renderStars(product.avg_rating ?? 0)}
                </div>
                <span className="font-semibold text-gray-900">
                  {product.avg_rating.toFixed(2)}
                </span>
                <span className="text-gray-500">
                  ({product.total_review} reviews)
                </span>
              </div>
              <div className="mt-8 mb-6 md:mb-12">
                {/* <span className="text-3xl font-bold text-[#223B7D] md:text-5xl">${ product.discounted_price}</span> */}

                <span className="text-3xl font-bold text-[#223B7D] md:text-5xl">
                  €{isPremium ? product.discounted_price : product.price}
                </span>
              </div>

              {/* Shop Now - Navigate to Checkout with directBuy */}
              <button
                onClick={() =>
                  navigate("/home/diyboxChackout", {
                    state: { directBuy: product },
                  })
                }
                className="hover:bg-secondary-light w-full cursor-pointer rounded-lg bg-[#223B7D] px-8 py-4 font-semibold text-white transition-colors duration-200"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div></div> */}

      {/* Tabs */}
      <div className="mx-auto mt-10 max-w-7xl px-4">
        <div className="overflow-hidden rounded-lg p-4">
          <div className="flex overflow-x-scroll rounded-xl border-b border-gray-200 bg-[#F5F5F5] p-2 md:overflow-x-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 cursor-pointer px-6 py-3 text-center font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "rounded-md bg-[#223B7D] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-10 mb-18 bg-white">{renderContent()}</div>
        </div>
      </div>

      <PremiumBanner />
    </div>
  );
}

// import { useParams, useNavigate } from "react-router-dom";
// import { CircleCheckBig, Play } from "lucide-react";
// import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import { useEffect, useState } from "react";

// import PremiumBanner from "@/components/Home/PremiumBanner";
// import MyHeader from "@/components/MyHeader/MyHeader";
// import { useGetDIYProductByIdQuery, useCreateReviewMutation, } from "@/redux/features/diyProducts/diyProductsApi";
// import { useGetMeQuery } from "../redux/features/user/userApi";
// import PageLoader from "@/components/Shared/PageLoader";

// export default function DiyBoxDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { data, isLoading, error, refetch } = useGetDIYProductByIdQuery(id!);
//   console.log(data)
//   const { data: userData } = useGetMeQuery();
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   // console.log({ firstUser: userData?.email });
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "auto" });
//   }, [id]);

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

//   const [activeTab, setActiveTab] = useState("whats-included");
//   const tabs = [
//     { id: "whats-included", label: "What's Included" },
//     { id: "activities", label: "Activities" },
//     { id: "tutorial", label: "Tutorial" },
//     { id: "reviews", label: "Reviews" },
//   ];

//   if (isLoading) return <div className="text-center py-10"><PageLoader /></div>;
//   if (error || !data) return <div className="text-center py-10">Something went wrong.</div>;

//   const product = data;
//   const firstUser = userData
//   const isPremium = firstUser?.subscription?.[0]?.plan_name === "Premium Subscriber";

//   console.log(firstUser)
//   const handleSubmitReview = async () => {
//     if (!comment.trim()) return;
//     try {
//       await createReview({ productId: product.id, rating, description: comment }).unwrap();
//       setComment("");
//       setRating(5);
//       refetch();
//     } catch (err) {
//       console.error("Failed to submit review", err);
//     }
//   };

//   // Tab content
//   const renderContent = () => {
//     switch (activeTab) {
//       case "whats-included":
//         return (
//           <div className="rounded-xl border border-[#DFE1E6] bg-white p-8">
//             <h2 className="mb-8 text-2xl text-gray-900">Everything You Need for an Amazing Party</h2>
//             <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
//               {product.included?.map((item: string, index: number) => (
//                 <div key={index} className="flex items-start space-x-3">
//                   <CircleCheckBig className="text-[#22C55E]" />
//                   <span className="leading-relaxed text-gray-700">{item}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       case "activities":
//         return (
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//             {product.activities?.map((item) => (
//               <div
//                 key={item.id}
//                 className="shadow-card hover:shadow-card-hover cursor-pointer rounded-xl border border-[#DFE1E6] bg-white p-6 transition-all duration-200"
//               >
//                 <div className="space-y-3">
//                   <h3 className="text-xl leading-tight font-medium text-[#191919]">{item.title}</h3>
//                   <p className="text-sm leading-relaxed text-[#5A5C5F]">{item.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         );
//       case "tutorial":
//         return product.tutorial ? (
//           <div className="py-10">
//             <div className="rounded-2xl bg-[#DFE1E6]/60 p-6 text-center">
//               <Play className="mx-auto h-12 w-12 text-[#223B7D]" />
//               <h2 className="mt-4 mb-2 text-xl font-medium sm:text-2xl">Tutorial Video</h2>
//               <p className="text-base sm:text-lg">Watch how to use this box</p>
//               <a
//                 href={product.tutorial}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#223B7D] px-6 py-3 text-white hover:bg-blue-800"
//               >
//                 <Play /> Watch Tutorial
//               </a>
//             </div>
//           </div>
//         ) : (
//           <div className="py-10 text-center text-gray-500">No tutorial available</div>
//         );
//       case "reviews":
//         return (
//           <div className="rounded-xl border border-[#DFE1E6] bg-white p-6">
//             <h2 className="mb-6 text-2xl font-semibold text-gray-900">Customer Reviews</h2>
//             {!product.reviews.length ? (
//               <p className="text-center text-gray-500 py-10">No reviews yet. Be the first to review!</p>
//             ) : (
//               <div className="space-y-6 mb-6">
//                 {product.reviews.map((review) => (
//                   <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-semibold text-gray-900">Anonymous User</span>
//                       <span className="text-sm text-gray-500">
//                         {new Date(review.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2 mb-2">
//                       {renderStars(review.rating)}
//                       <span className="text-sm text-gray-600">{review.rating.toFixed(1)}</span>
//                     </div>
//                     <p className="text-gray-700 leading-relaxed">{review.description}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <div className="mt-6 border-t pt-6">
//               <h3 className="mb-2 text-lg font-medium">Leave a Review</h3>
//               <div className="flex items-center gap-2 mb-2">
//                 <span className="text-sm font-medium">Rating:</span>
//                 <select
//                   value={rating}
//                   onChange={(e) => setRating(Number(e.target.value))}
//                   className="rounded border border-gray-300 px-2 py-1"
//                 >
//                   {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5].map((r) => (
//                     <option key={r} value={r}>
//                       {r}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <textarea
//                 className="w-full rounded border border-gray-300 p-2"
//                 rows={4}
//                 placeholder="Write your review..."
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//               />
//               <button
//                 onClick={handleSubmitReview}
//                 disabled={isSubmitting}
//                 className="mt-2 w-full rounded bg-[#223B7D] px-4 py-2 font-semibold text-white hover:bg-blue-900 disabled:opacity-50 cursor-pointer"
//               >
//                 {isSubmitting ? "Submitting..." : "Submit Review"}
//               </button>
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="pb-0 md:pb-20">
//       <MyHeader title=" " subtitle="r" className="-z-1 text-3xl sm:text-5xl md:text-6xl" />
//       <div className="container mx-auto -mt-84">
//         <div className="overflow-hidden rounded-2xl p-4">
//           <div className="flex flex-col lg:flex-row">
//             {/* Left side - Product Images */}

//             <div className="lg:w-1/2">
//               {/* <div className="mb-4 h-[70vh] w-auto">
//     <img
//       src={selectedImage || product.imges?.[0]} // Show selected image or default first image
//       alt={product.title}
//       className="h-full w-full rounded-xl object-cover"
//     />
//   </div> */}

//               <div
//                 className="mb-4 h-[70vh] w-auto overflow-hidden rounded-xl relative cursor-zoom-in"
//                 onMouseMove={(e) => {
//                   const img = e.currentTarget.querySelector("img") as HTMLImageElement;
//                   const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
//                   const x = ((e.clientX - left) / width) * 100;
//                   const y = ((e.clientY - top) / height) * 100;
//                   img.style.transformOrigin = `${x}% ${y}%`;
//                   img.style.transform = "scale(2)";
//                 }}
//                 onMouseLeave={(e) => {
//                   const img = e.currentTarget.querySelector("img") as HTMLImageElement;
//                   img.style.transformOrigin = "center center";
//                   img.style.transform = "scale(1)";
//                 }}
//               >
//                 <img
//                   src={selectedImage || product.imges?.[0]}
//                   alt={product.title}
//                   className="h-full w-full object-cover transition-transform duration-300 ease-in-out"
//                 />
//               </div>

//               <div className="flex gap-3">
//                 {product.imges?.map((img: string, idx: number) => (
//                   <div
//                     key={idx}
//                     className={`h-20 w-20 overflow-hidden rounded-xl border-2 cursor-pointer ${selectedImage === img ? "border-[#223B7D]" : "border-transparent"
//                       }`}
//                     onClick={() => setSelectedImage(img)} // Set the clicked image as main image
//                   >
//                     <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right side - Product Details */}
//             <div className="p-6 lg:w-1/2 lg:p-8">
//               <div className="mb-4 flex gap-2">
//                 <span className="rounded-full bg-[#223B7D] px-3 py-2 text-sm text-white">{product.product_type}</span>
//                 <span className="rounded-full bg-[#58C06478]/70 px-3 py-2 text-sm text-[#19AE19]">{product.age_range}</span>
//               </div>
//               <h3 className="font-fredoka mb-2 text-xl font-semibold text-[#191919] md:text-3xl">{product.title}</h3>
//               <p className="mb-4 w-[80%] text-lg text-[#5A5C5F]">{product.description}</p>
//               <div className="mb-4 flex items-center gap-4 text-xl">
//                 <div className="flex items-center">{renderStars(product.avg_rating ?? 0)}</div>
//                 <span className="font-semibold text-gray-900">{product.avg_rating.toFixed(2)}</span>
//                 <span className="text-gray-500">({product.total_review} reviews)</span>
//               </div>
//               <div className="mt-8 mb-6 md:mb-12">
//                 {/* <span className="text-3xl font-bold text-[#223B7D] md:text-5xl">${ product.discounted_price}</span> */}

//                 <span className="text-3xl font-bold text-[#223B7D] md:text-5xl">
//                   €{!isPremium ? product.discounted_price : product.price}
//                 </span>
//               </div>

//               {/* Shop Now - Navigate to Checkout with directBuy */}
//               <button
//                 onClick={() => navigate("/home/diyboxChackout", { state: { directBuy: product } })}
//                 className="hover:bg-secondary-light w-full cursor-pointer rounded-lg bg-[#223B7D] px-8 py-4 font-semibold text-white transition-colors duration-200"
//               >
//                 Shop Now
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* <div></div> */}

//       {/* Tabs */}
//       <div className="mx-auto mt-10 max-w-7xl px-4">
//         <div className="overflow-hidden rounded-lg p-4">
//           <div className="flex overflow-x-scroll rounded-xl border-b border-gray-200 bg-[#F5F5F5] p-2 md:overflow-x-hidden">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex-1 cursor-pointer px-6 py-3 text-center font-medium transition-colors duration-200 ${activeTab === tab.id ? "rounded-md bg-[#223B7D] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//           <div className="mt-10 mb-18 bg-white">{renderContent()}</div>
//         </div>
//       </div>

//       <PremiumBanner />
//     </div>
//   );
// }
