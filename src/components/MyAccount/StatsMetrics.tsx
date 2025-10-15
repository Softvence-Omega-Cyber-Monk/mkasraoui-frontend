import { useGetUserMetaQuery } from "@/redux/features/user/userApi";


export default function StatsMetrics() {
  // ✅ Fetch meta data
  const { data: meta, isLoading, isError } = useGetUserMetaQuery();

  // ✅ Show loading or error states
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (isError || !meta) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Failed to load stats</p>
      </div>
    );
  }

  // ✅ Map API response to UI
  const stats = [
    { number: meta.totalCustomOrder ?? 0, label: "Custom Orders" },
    { number: meta.totalQuotes ?? 0, label: "Quotes" },
    { number: meta.totalOrder ?? 0, label: "Total Orders" },
    { number: meta.totalFavorite ?? 0, label: "Favorite Boxes" },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg bg-[#E6EFFF] p-6 text-center sm:p-8"
          >
            <div className="text-secondary font-fredoka mb-2 text-4xl font-bold sm:text-5xl">
              {stat.number}
            </div>
            <div className="text-secondary text-base font-semibold sm:text-lg">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
