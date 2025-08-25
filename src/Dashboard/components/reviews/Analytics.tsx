import { Star } from "lucide-react";

function Analytics() {
  const ratingData = [
    { stars: 5, percentage: 60 },
    { stars: 4, percentage: 25 },
    { stars: 3, percentage: 10 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="mb-8 text-3xl font-semibold">Analytics</h2>

        <div className="flex gap-12">
          {/* Left side - Overall rating */}
          <div className="flex flex-col">
            <div className="text-foreground mb-2 text-5xl font-bold">4.7</div>

            {/* Stars */}
            <div className="mb-2 flex gap-1">
              {[1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <Star className="h-5 w-5 text-gray-300" />
            </div>

            <div className="text-muted-foreground text-sm">150 reviews</div>
          </div>

          {/* Right side - Rating breakdown */}
          <div className="flex-1 space-y-2">
            {ratingData.map((item) => (
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
                  {item.percentage}%
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
