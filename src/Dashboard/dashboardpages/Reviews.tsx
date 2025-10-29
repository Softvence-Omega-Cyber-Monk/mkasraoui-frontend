import { SlDislike, SlLike } from "react-icons/sl";
import Analytics from "../components/reviews/Analytics";
import { useGetProviderReviewsQuery } from "@/redux/features/review/providerReviewApi";
import PageLoader from "@/components/Shared/PageLoader";
import Title from "@/components/Shared/Title";

function Reviews() {
  const { data: reviews = [], isLoading } = useGetProviderReviewsQuery();

  // render stars based on rating
  const renderStars = (rating: number) => {
    const rounded = Math.round(rating);
    const filledStars = "★".repeat(rounded);
    const emptyStars = "☆".repeat(5 - rounded);
    return (
      <div className="mb-2 flex">
        <span className="text-yellow-400">{filledStars}</span>
        {emptyStars && <span className="text-gray-300">{emptyStars}</span>}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div>
        <PageLoader />
      </div>
    );
  }

  return (
    <div>
      <div className="w-full space-y-6">
        <Title title="Reviews & Ratings" />

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="gap-4">
              <div className="flex gap-4">
                <img
                  src={
                    review.user?.avatar ||
                    "https://ui-avatars.com/api/?name=" + review.user?.name
                  }
                  alt={review.user?.name}
                  className="h-10 w-10 rounded-full"
                />
                <div className="mb-1 items-center gap-2">
                  <div className="font-semibold text-gray-900">
                    {review.user?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                {renderStars(review.rating)}

                <p className="mb-3 text-gray-700">"{review.description}"</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <SlLike />
                    <span>0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <SlDislike />
                    <span>0</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 mb-8">
          <Analytics />
        </div>
      </div>
    </div>
  );
}

export default Reviews;
