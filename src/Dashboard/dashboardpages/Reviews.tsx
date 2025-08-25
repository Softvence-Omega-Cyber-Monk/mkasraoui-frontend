import { SlDislike, SlLike } from "react-icons/sl";
import Analytics from "../components/reviews/Analytics";
function Reviews() {
  const reviews = [
    {
      id: 1,
      name: "Sophia Carter",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      timeAgo: "2 weeks ago",
      rating: 5,
      comment:
        "Absolutely thrilled with the service! The team was incredibly professional and made our event a huge success. Highly recommend!",
      likes: 12,
      dislikes: 2,
    },
    {
      id: 2,
      name: "Liam Bennett",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      timeAgo: "1 month ago",
      rating: 4,
      comment:
        "Great experience overall. The service was good, but there were a few minor issues that could be improved.",
      likes: 8,
      dislikes: 1,
    },
    {
      id: 3,
      name: "Olivia Hayes",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      timeAgo: "2 months ago",
      rating: 5,
      comment:
        "Fantastic! The team went above and beyond to ensure everything was perfect. Will definitely use their services again.",
      likes: 15,
      dislikes: 0,
    },
  ];

  // this is for rendering stars based on rating
  const renderStars = (rating: number) => {
    const filledStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    return (
      <div className="mb-2 flex">
        <span className="text-yellow-400">{filledStars}</span>
        {emptyStars && <span className="text-gray-300">{emptyStars}</span>}
      </div>
    );
  };

  return (
    <div>
      <div className="w-full">
        {/* Main heading */}
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Reviews & Ratings
        </h1>

        {/* Subheading */}
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          List of Reviews
        </h2>

        {/* Reviews list */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="gap-4">
              <div className="flex gap-4">
                <img
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  className="h-10 w-10 rounded-full"
                />
                <div className="mb-1 items-center gap-2">
                  <div className="font-semibold text-gray-900">
                    {review.name}
                  </div>
                  <div className="text-sm text-gray-500">{review.timeAgo}</div>
                </div>
              </div>
              <div className="flex-1">
                {renderStars(review.rating)}

                <p className="mb-3 text-gray-700">"{review.comment}"</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <SlLike />
                    <span>{review.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <SlDislike />
                    <span>{review.dislikes || ""}</span>
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
