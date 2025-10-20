// src/components/DashboardCard.tsx
import PageLoader from "@/components/Shared/PageLoader";
import { useGetDashboardQuery } from "@/redux/features/user/dashboardApi";
import { FaPoundSign, FaProductHunt, FaUsers } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";

const DashboardCard = () => {
  const { data, isLoading, isError } = useGetDashboardQuery();

  const statusData = data
    ? [
        {
          title: "Total Users",
          amount: data.totalUsers,
          icon: <FaUsers />,
          change: "+10%",
          unit: "for this month",
        },
        {
          title: "Total Products",
          amount: data.totalProducts,
          icon: <MdOutlineProductionQuantityLimits />,
          change: "-5%",
          unit: "for this month",
        },
        {
          title: "Total Providers",
          amount: data.totalProviders,
          icon: <FaProductHunt />,
          change: "+12%",
          unit: "for this month",
        },
        {
          title: "Total Revenue",
          amount: `€${Number(data.totalRevenue).toLocaleString("en-GB", {
            maximumFractionDigits: 0,
          })}`,
          icon: <FaPoundSign />,
          change: "+20%",
          unit: "for this month",
        },
      ]
    : [];

  const colors = ["#FFA600", "#9747FF", "#12CC1E", "#009CDE"];
  const bgColors = ["#FFA6001A", "#9747FF1A", "#12CC1E1A", "#009CDE1A"];

  if (isLoading)
    return (
      <div>
        <PageLoader />
      </div>
    );
  if (isError) return <div>Error fetching dashboard data</div>;

  return (
    <div className="grid w-full grid-cols-1 place-items-start gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {statusData.map((single, index) => {
        // check if change is negative or positive
        const isNegative = single.change.startsWith("-");
        const changeColor = isNegative ? "#FF0000" : "#11981F";
        const cleanChangeText = single.change.replace(/[-+]/, "");

        return (
          <div
            key={single.title}
            className="mx-auto flex h-[187px] w-full flex-col justify-between rounded-[16px] border border-[#E5E7EB] bg-white p-5 sm:p-6"
          >
            {/* Top Row */}
            <div className="flex items-center justify-start gap-5">
              <h1 className="font-sans text-[18px] leading-[160%] text-black">
                {single.title}
              </h1>
            </div>

            {/* Amount + Icon */}
            <div className="flex w-full items-start justify-between">
              <div className="flex items-center justify-start">
                <h2 className="font-Robot text-xl font-semibold tracking-[-0.68px] sm:text-2xl md:text-3xl">
                  {single.amount}
                </h2>
              </div>

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
            </div>

            {/* Bottom Row: Change & Unit */}
            <div className="font-Robot flex items-center justify-start gap-1 text-sm">
              <FaArrowUp
                style={{
                  color: changeColor,
                  transform: isNegative ? "rotate(180deg)" : "none",
                }}
              />
              <span style={{ color: changeColor }}>{cleanChangeText}</span>
              <span className="text-gray-500">{single.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCard;

// // src/components/DashboardCard.tsx
// import PageLoader from "@/components/Shared/PageLoader";
// import { useGetDashboardQuery } from "@/redux/features/user/dashboardApi";
// import { FaPoundSign, FaProductHunt, FaUsers } from "react-icons/fa";
// import { MdOutlineProductionQuantityLimits } from "react-icons/md";

// const DashboardCard = () => {
//   const { data, isLoading, isError } = useGetDashboardQuery();

//   const statusData = data
//     ? [
//         {
//           title: "Total Users",
//           amount: data.totalUsers,
//           icon: <FaUsers />,
//         },
//         {
//           title: "Total Products",
//           amount: data.totalProducts,
//           icon: <MdOutlineProductionQuantityLimits />,
//         },
//         {
//           title: "Total Providers",
//           amount: data.totalProviders,
//           icon: <FaProductHunt />,
//         },
//         {
//           title: "Total Revenue",
//           amount: `$${Number(data.totalRevenue).toLocaleString("en-GB", {
//             maximumFractionDigits: 0,
//           })}`,
//           icon: <FaPoundSign />,
//         },
//       ]
//     : [];

//   const colors = ["#FFA600", "#9747FF", "#12CC1E", "#009CDE"];
//   const bgColors = ["#FFA6001A", "#9747FF1A", "#12CC1E1A", "#009CDE1A"];

//   if (isLoading)
//     return (
//       <div>
//         <PageLoader />
//       </div>
//     );
//   if (isError) return <div>Error fetching dashboard data</div>;

//   return (
//     <div className="grid w-full grid-cols-1 place-items-start gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
//       {statusData.map((single, index) => (
//         <div
//           key={single.title}
//           className="mx-auto flex h-[187px] w-full flex-col justify-center rounded-[16px] border border-[#E5E7EB] bg-white p-5 sm:p-6"
//         >
//           {/* Top Row */}
//           <div className="flex items-center justify-start gap-5">
//             <div
//               className="flex h-[48px] w-[48px] items-center justify-center rounded-[12px] p-[12px]"
//               style={{ backgroundColor: bgColors[index] }}
//             >
//               <span
//                 className="flex h-6 w-6 items-center justify-center text-[24px]"
//                 style={{ color: colors[index] }}
//               >
//                 {single.icon}
//               </span>
//             </div>

//             <h1 className="font-sans text-[18px] leading-[160%] text-black">
//               {single.title}
//             </h1>
//           </div>

//           {/* Centered Amount */}
//           <div className="flex flex-1 flex-col items-center justify-center">
//             <h2 className="font-Robot text-xl font-semibold tracking-[-0.68px] sm:text-2xl md:text-3xl">
//               {single.amount}
//             </h2>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DashboardCard;
