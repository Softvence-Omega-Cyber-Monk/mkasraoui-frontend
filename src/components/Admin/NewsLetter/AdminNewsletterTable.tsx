import PageLoader from "@/components/Shared/PageLoader";
import Title from "@/components/Shared/Title";
import {
  useDeleteNewsletterMutation,
  useGetAllNewslettersQuery,
} from "@/redux/features/newsLetter/newsLetterApi";
import { setSelectedNewsletter } from "@/redux/features/newsLetter/newsLetterSlice";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import React from "react";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const AdminNewsletterTable: React.FC = () => {
  const {
    data: newsletters,
    isLoading,
    isFetching,
  } = useGetAllNewslettersQuery();
  const [deleteNewsletter, { isLoading: isDeleting }] =
    useDeleteNewsletterMutation();
  const dispatch = useAppDispatch();

  const handleDelete = (idOrEmail: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete this newsletter subscriber?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteNewsletter(idOrEmail).unwrap();
        Swal.fire("Deleted!", "Subscriber has been deleted.", "success");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Title title="News letter Subscribers" />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
                <tr>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    No
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    Subscribed At
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-sm">
                      <PageLoader />
                    </td>
                  </tr>
                ) : newsletters?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-6 text-center text-sm text-gray-600"
                    >
                      No subscribers found.
                    </td>
                  </tr>
                ) : (
                  newsletters?.map((nl, index) => (
                    <tr
                      key={nl.id}
                      className="border-b-2 border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {nl.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(nl.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => {
                            dispatch(setSelectedNewsletter(nl));
                            handleDelete(nl.email);
                          }}
                          disabled={isDeleting}
                          className="flex cursor-pointer items-center justify-center rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <span className="text-xs">...</span>
                          ) : (
                            <MdDelete className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletterTable;

// import PageLoader from "@/components/Shared/PageLoader";
// import {
//   useDeleteNewsletterMutation,
//   useGetAllNewslettersQuery,
// } from "@/redux/features/newsLetter/newsLetterApi";
// import React from "react";
// import Swal from "sweetalert2";

// const AdminNewsletterTable: React.FC = () => {
//   const {
//     data: newsletters,
//     isLoading,
//     isFetching,
//   } = useGetAllNewslettersQuery();
//   const [deleteNewsletter, { isLoading: isDeleting }] =
//     useDeleteNewsletterMutation();

//   const handleDelete = (idOrEmail: string) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: `Delete this newsletter subscriber?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         await deleteNewsletter(idOrEmail).unwrap();
//         Swal.fire("Deleted!", "Subscriber has been deleted.", "success");
//       }
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto w-full">
//         {/* Header */}
//         <div className="mb-6 flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-gray-900">
//             Newsletter Subscribers
//           </h1>
//         </div>

//         {/* Table */}
//         <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
//           <div className="w-full overflow-x-auto">
//             <table className="w-full min-w-[700px]">
//               <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                     #
//                   </th>
//                   <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                     Email
//                   </th>
//                   <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                     Subscribed At
//                   </th>
//                   <th className="px-6 py-5 text-left text-base font-medium text-gray-500">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {isLoading || isFetching ? (
//                   <tr>
//                     <td colSpan={4} className="p-6 text-center text-sm">
//                       <PageLoader />
//                     </td>
//                   </tr>
//                 ) : newsletters?.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={4}
//                       className="p-6 text-center text-sm text-gray-600"
//                     >
//                       No subscribers found.
//                     </td>
//                   </tr>
//                 ) : (
//                   newsletters?.map((nl, index) => (
//                     <tr
//                       key={nl.id}
//                       className="border-b-2 border-gray-100 hover:bg-gray-50"
//                     >
//                       <td className="px-6 py-4 text-sm font-medium text-gray-700">
//                         {index + 1}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {nl.email}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {new Date(nl.createdAt).toLocaleString()}
//                       </td>
//                       <td className="px-6 py-4 text-sm">
//                         <button
//                           onClick={() => handleDelete(nl.email)}
//                           disabled={isDeleting}
//                           className="cursor-pointer rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
//                         >
//                           {isDeleting ? "Deleting..." : "Delete"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminNewsletterTable;

// import {
//   useDeleteNewsletterMutation,
//   useGetAllNewslettersQuery,
// } from "@/redux/features/newsLetter/newsLetterApi";
// import React from "react";
// import Swal from "sweetalert2";

// const AdminNewsletterTable: React.FC = () => {
//   const { data: newsletters, isLoading } = useGetAllNewslettersQuery();
//   const [deleteNewsletter] = useDeleteNewsletterMutation();

//   const handleDelete = (idOrEmail: string) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: `Delete this newsletter subscriber?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         await deleteNewsletter(idOrEmail).unwrap();
//         Swal.fire("Deleted!", "Subscriber has been deleted.", "success");
//       }
//     });
//   };

//   if (isLoading) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       <h2 className="mb-4 text-2xl font-bold">Newsletter Subscribers</h2>
//       <table className="min-w-full border border-gray-300">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border px-4 py-2">#</th>
//             <th className="border px-4 py-2">Email</th>
//             <th className="border px-4 py-2">Subscribed At</th>
//             <th className="border px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {newsletters?.map((nl, index) => (
//             <tr key={nl.id} className="text-center">
//               <td className="border px-4 py-2">{index + 1}</td>
//               <td className="border px-4 py-2">{nl.email}</td>
//               <td className="border px-4 py-2">
//                 {new Date(nl.createdAt).toLocaleString()}
//               </td>
//               <td className="border px-4 py-2">
//                 <button
//                   onClick={() => handleDelete(nl.email)}
//                   className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminNewsletterTable;
