import { Star } from "lucide-react";
import { useGetProviderReviewsQuery } from "@/redux/features/review/providerReviewApi";

function Analytics() {
  const { data: reviews = [], isLoading } = useGetProviderReviewsQuery();

  if (isLoading) {
    return <div className="text-gray-600">Loading analytics...</div>;
  }

  if (!reviews.length) {
    return <div className="text-red-500">No reviews yet.</div>;
  }

  // ---- Calculate average rating ----
  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalRating / totalReviews;

  // ---- Rating breakdown ----
  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = (count / totalReviews) * 100;
    return { stars, percentage };
  });

  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="mb-8 text-3xl font-semibold">Analytics</h2>

        <div className="flex gap-12">
          {/* Left side - Overall rating */}
          <div className="flex flex-col">
            <div className="text-foreground mb-2 text-5xl font-bold">
              {averageRating.toFixed(1)}
            </div>

            {/* Stars */}
            <div className="mb-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className="text-muted-foreground text-sm">
              {totalReviews} reviews
            </div>
          </div>

          {/* Right side - Rating breakdown */}
          <div className="flex-1 space-y-2">
            {breakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-foreground w-2 text-sm">
                  {item.stars}
                </span>

                <div className="relative h-2 flex-1 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gray-900"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <span className="text-muted-foreground w-8 text-right text-sm">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;



// import { Star } from "lucide-react";

// function Analytics() {
//   const ratingData = [
//     { stars: 5, percentage: 60 },
//     { stars: 4, percentage: 25 },
//     { stars: 3, percentage: 10 },
//     { stars: 2, percentage: 3 },
//     { stars: 1, percentage: 2 },
//   ];

//   return (
//     <div>
//       <div className="max-w-2xl">
//         <h2 className="mb-8 text-3xl font-semibold">Analytics</h2>

//         <div className="flex gap-12">
//           {/* Left side - Overall rating */}
//           <div className="flex flex-col">
//             <div className="text-foreground mb-2 text-5xl font-bold">4.7</div>

//             {/* Stars */}
//             <div className="mb-2 flex gap-1">
//               {[1, 2, 3, 4].map((star) => (
//                 <Star
//                   key={star}
//                   className="h-5 w-5 fill-yellow-400 text-yellow-400"
//                 />
//               ))}
//               <Star className="h-5 w-5 text-gray-300" />
//             </div>

//             <div className="text-muted-foreground text-sm">150 reviews</div>
//           </div>

//           {/* Right side - Rating breakdown */}
//           <div className="flex-1 space-y-2">
//             {ratingData.map((item) => (
//               <div key={item.stars} className="flex items-center gap-3">
//                 <span className="text-foreground w-2 text-sm">
//                   {item.stars}
//                 </span>

//                 <div className="relative h-2 flex-1 rounded-full bg-gray-200">
//                   <div
//                     className="h-2 rounded-full bg-gray-900"
//                     style={{ width: `${item.percentage}%` }}
//                   />
//                 </div>

//                 <span className="text-muted-foreground w-8 text-right text-sm">
//                   {item.percentage}%
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Analytics;
