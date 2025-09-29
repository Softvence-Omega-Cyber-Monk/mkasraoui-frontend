import { useGetProviderMetaQuery } from "@/redux/features/user/dashboardApi";
import { Calendar, FileText, MessageSquare, Star } from "lucide-react";
import PageLoader from "../Shared/PageLoader";
import { useGetProviderQuotesQuery } from "@/redux/features/quotes/quotesApi";

const ProviderCard = () => {
  const { data, isLoading, isError } = useGetProviderMetaQuery();

  const { data: quotesData } = useGetProviderQuotesQuery({
    page: 1,
    limit: 1000,
  });

  const colors = ["#FFA600", "#9747FF", "#12CC1E", "#009CDE"];
  const bgColors = ["#FFA6001A", "#9747FF1A", "#12CC1E1A", "#009CDE1A"];

  if (isLoading) {
    return (
      <div>
        <PageLoader />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-center text-red-500">Failed to load provider stats.</p>
    );
  }

  const statusData = [
    {
      title: "Total Booking",
      amount: data.totalBookings,
      icon: <Calendar />,
    },
    {
      title: "Total Review",
      amount: data.totalReview,
      icon: <MessageSquare />,
    },
    {
      title: "All Provider Quote",
      amount: quotesData?.data?.data?.length || 0, // ✅ correct
      icon: <FileText />,
    },
    {
      title: "Average Rating",
      amount: data.avgRating.toFixed(2),
      icon: <Star />,
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 place-items-start gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {statusData.map((single, index) => (
        <div
          key={single.title}
          className="mx-auto flex h-[187px] w-full flex-col justify-between rounded-[16px] border border-[#E5E7EB] bg-white p-5 sm:p-6"
        >
          {/* Top Row */}
          <div className="flex items-center justify-start gap-5">
            <div
              className="flex h-[48px] w-[48px] items-center justify-center rounded-[12px] p-[12px]"
              style={{ backgroundColor: bgColors[index] }}
            >
              <span
                className="flex h-6 w-6 items-center justify-center text-[24px]"
                style={{ color: colors[index] }}
              >
                {single.icon}
              </span>
            </div>

            <h1 className="font-sans text-[18px] leading-[160%] text-black">
              {single.title}
            </h1>
          </div>

          {/* Centered Amount */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <h2 className="font-Robot text-xl font-semibold tracking-[-0.68px] sm:text-2xl md:text-3xl">
              {single.amount}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProviderCard;
