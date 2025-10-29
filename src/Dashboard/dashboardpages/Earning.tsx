import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import {
  useGetOnboardingLinkQuery,
  useLoginDashboardQuery,
} from "@/redux/features/payment/paymentApi";
import Title from "@/components/Shared/Title";

function Earning() {
  const { data: onboardingLink, isFetching: onboardingLoading } =
    useGetOnboardingLinkQuery();
  const { data: dashboardLink, isFetching: dashboardLoading } =
    useLoginDashboardQuery();

  return (
    <div className="min-h-screen space-y-8 bg-gray-50">
      <div>
        <Title title=" Onboarding & Earnings" />
      </div>

      {/* Cards Grid */}
      <div className="grid gap-8 sm:grid-cols-2">
        {/* Onboarding Card */}
        <div className="flex transform flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg">
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              Onboarding
            </h2>
            <p className="text-gray-600">
              Complete your onboarding process to start managing your earnings.
              {onboardingLoading && (
                <span className="ml-2 animate-pulse text-sm text-blue-500">
                  Loading...
                </span>
              )}
            </p>
          </div>
          <button
            className={`mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-white shadow-md transition ${
              onboardingLink?.url
                ? "bg-[#223B7D] hover:bg-[#02195a]"
                : "cursor-not-allowed bg-gray-300"
            }`}
            onClick={() => {
              if (onboardingLink?.url)
                window.open(onboardingLink.url, "_blank");
              else alert("✅ Your onboarding is already completed.");
            }}
            disabled={!onboardingLink?.url || onboardingLoading}
          >
            {onboardingLink?.url ? "Set Onboarding" : "Completed"}
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Earnings Dashboard Card */}
        <div className="flex transform flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg">
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              Earnings Dashboard
            </h2>
            <p className="text-gray-600">
              Access your dashboard to track and manage your earnings in
              real-time.
              {dashboardLoading && (
                <span className="ml-2 animate-pulse text-sm text-green-500">
                  Loading...
                </span>
              )}
            </p>
          </div>
          <button
            className={`mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-white shadow-md transition ${
              dashboardLink?.url
                ? "bg-[#223B7D] hover:bg-[#02195a]"
                : "cursor-not-allowed bg-gray-300"
            }`}
            onClick={() =>
              dashboardLink?.url && window.open(dashboardLink.url, "_blank")
            }
            disabled={!dashboardLink?.url || dashboardLoading}
          >
            {dashboardLink?.url ? "Manage Earnings" : "Unavailable"}
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Earning;

// import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

// import {
//   useGetOnboardingLinkQuery,
//   useLoginDashboardQuery,
// } from "@/redux/features/payment/paymentApi";

// function Earning() {
//   const { data: onboardingLink } = useGetOnboardingLinkQuery();
//   const { data: dashboardLink, isFetching: dashboardLoading } =
//     useLoginDashboardQuery();

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="mx-auto">
//         {/* Header */}
//         <h1 className="mb-8 text-3xl font-bold text-[#121417]">
//           Onboarding and Earnings
//         </h1>
//         <div className="mb-8">
//           <div className="mb-4 flex items-center justify-between">
//             <h2 className="text-2xl font-semibold text-gray-900">GO-</h2>

//             <div className="flex flex-wrap items-center gap-3">
//               {/* Go to Onboarding */}
//               <button
//                 className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition hover:shadow-md ${
//                   onboardingLink?.url
//                     ? "cursor-pointer bg-[#223B7D] hover:bg-[#02195a]"
//                     : "cursor-not-allowed bg-gray-300"
//                 }`}
//                 onClick={() => {
//                   if (onboardingLink?.url) {
//                     window.open(onboardingLink.url, "_blank");
//                   } else {
//                     alert("✅ Your onboarding is already completed.");
//                   }
//                 }}
//                 disabled={false}
//               >
//                 Set Onboarding
//                 <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
//               </button>

//               {/* Login to Dashboard */}
//               <button
//                 className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition hover:shadow-md ${
//                   dashboardLink?.url
//                     ? "cursor-pointer bg-[#223B7D] hover:bg-[#02195a]"
//                     : "cursor-not-allowed bg-gray-300"
//                 }`}
//                 onClick={() =>
//                   dashboardLink?.url && window.open(dashboardLink.url, "_blank")
//                 }
//                 disabled={!dashboardLink?.url || dashboardLoading}
//               >
//                 Manage Earning
//                 <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Earning;
