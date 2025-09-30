// src/components/DashboardCard.tsx
import PageLoader from "@/components/Shared/PageLoader";
import { useGetDashboardQuery } from "@/redux/features/user/dashboardApi";
import { FaPoundSign, FaProductHunt, FaUsers } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";

const DashboardCard = () => {
  const { data, isLoading, isError } = useGetDashboardQuery();

  const statusData = data
    ? [
        {
          title: "Total Users",
          amount: data.totalUsers,
          icon: <FaUsers />,
        },
        {
          title: "Total Products",
          amount: data.totalProducts,
          icon: <MdOutlineProductionQuantityLimits />,
        },
        {
          title: "Total Providers",
          amount: data.totalProviders,
          icon: <FaProductHunt />,
        },
        {
          title: "Total Revenue",
          amount: `$${Number(data.totalRevenue).toLocaleString("en-GB", {
            maximumFractionDigits: 0,
          })}`,
          icon: <FaPoundSign />,
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
      {statusData.map((single, index) => (
        <div
          key={single.title}
          className="mx-auto flex h-[187px] w-full flex-col justify-center rounded-[16px] border border-[#E5E7EB] bg-white p-5 sm:p-6"
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

export default DashboardCard;

// import { AiFillDollarCircle } from "react-icons/ai";
// import { BiMessageDetail } from "react-icons/bi";
// import { FaBorderAll, FaArrowUp } from "react-icons/fa";
// import { MdOutlineOutbox } from "react-icons/md";

// const DashboardCard = () => {
//   const statusData = [
//     {
//       title: "Total Clients",
//       amount: "154",
//       change: "↓ 12%",
//       unit: "for this month",
//       icon: <AiFillDollarCircle />,
//     },
//     {
//       title: "Total Releases",
//       amount: "1,254",
//       change: "↓ 12%",
//       unit: "for this month",
//       icon: <FaBorderAll />,
//     },
//     {
//       title: "Active Submissions",
//       amount: "42",
//       change: "↓ 12%",
//       unit: "for this month",
//       icon: <MdOutlineOutbox />,
//     },
//     {
//       title: "Total Revenue",
//       amount: "$856k",
//       change: "↓ -8%",
//       unit: "for this month",
//       icon: <BiMessageDetail />,
//     },
//   ];

//   const colors = ["#FFA600", "#9747FF", "#12CC1E", "#009CDE"];
//   const bgColors = ["#FFA6001A", "#9747FF1A", "#12CC1E1A", "#009CDE1A"]; // 10% opacity in hex

//   return (
//     <div className="grid w-full grid-cols-1 place-items-start gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
//       {statusData.map((single, index) => {
//         const isNegative = single.change.includes("-");
//         const changeColor = isNegative ? "#E35A5F" : "#12CC1E";
//         const cleanChangeText = single.change.replace(/[↓↑]/g, "").trim();

//         return (
//           <div
//             key={single.title}
//             className="mx-auto flex h-[187px] w-full flex-col justify-between rounded-[16px] border border-[#E5E7EB] bg-white p-5 sm:p-6"
//           >
//             {/* Top Row */}
//             <div className="flex items-center justify-start gap-5">
//               <div
//                 className="flex h-[48px] w-[48px] items-center justify-center rounded-[12px] p-[12px]"
//                 style={{ backgroundColor: bgColors[index] }}
//               >
//                 <span
//                   className="flex h-6 w-6 items-center justify-center text-[24px]"
//                   style={{ color: colors[index] }}
//                 >
//                   {single.icon}
//                 </span>
//               </div>

//               <h1 className="font-sans text-[18px] leading-[160%] text-black">
//                 {single.title}
//               </h1>
//             </div>

//             {/* Centered Amount */}
//             <div className="flex flex-1 flex-col items-center justify-center">
//               <h2 className="font-Robot text-xl font-semibold tracking-[-0.68px] sm:text-2xl md:text-3xl">
//                 {single.amount}
//               </h2>
//             </div>

//             {/* Bottom Row: Change & Unit */}
//             <div className="font-Robot flex items-center justify-start gap-1 text-sm">
//               <FaArrowUp
//                 style={{
//                   color: changeColor,
//                   transform: isNegative ? "rotate(180deg)" : "none",
//                 }}
//               />
//               <span style={{ color: changeColor }}>{cleanChangeText}</span>
//               <span className="text-[#067d12]">{single.unit}</span>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default DashboardCard;
