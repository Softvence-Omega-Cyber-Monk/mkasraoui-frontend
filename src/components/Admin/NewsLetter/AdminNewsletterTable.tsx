import React, { useState } from "react";
// import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

import PageLoader from "@/components/Shared/PageLoader";
import Title from "@/components/Shared/Title";
import {
  // useDeleteNewsletterMutation,
  useGetAllNewslettersQuery,
  useSendPromotionalMailMutation,
} from "@/redux/features/newsLetter/newsLetterApi";

interface Newsletter {
  id: string;
  email: string;
  createdAt: string;
}

const AdminNewsletterTable: React.FC = () => {
  // Pagination
  const newslettersPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch newsletters
  const {
    data: newsletters,
    isLoading,
    isFetching,
  } = useGetAllNewslettersQuery();

  // Delete & send mail mutations
  // const [deleteNewsletter, { isLoading: isDeleting }] =
  //   useDeleteNewsletterMutation();
  const [sendPromotionalMail, { isLoading: isSending }] =
    useSendPromotionalMailMutation();

  // Promotional mail form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Pagination calculations
  const total = newsletters?.length || 0;
  const totalPages = Math.ceil(total / newslettersPerPage);
  const paginatedNewsletters: Newsletter[] =
    newsletters?.slice(
      (currentPage - 1) * newslettersPerPage,
      currentPage * newslettersPerPage,
    ) || [];

  // Delete subscriber
  // const handleDelete = async (nl: Newsletter) => {
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: `Delete subscriber ${nl.email}?`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   });

  //   if (result.isConfirmed) {
  //     try {
  //       await deleteNewsletter(nl.email).unwrap();
  //       Swal.fire("Deleted!", `${nl.email} has been deleted.`, "success");
  //     } catch (err: any) {
  //       Swal.fire(
  //         "Error!",
  //         err?.data?.message || "Failed to delete subscriber",
  //         "error",
  //       );
  //     }
  //   }
  // };

  // Send promotional mail
  const handleSendPromotionalMail = async () => {
    if (!subject.trim() || !message.trim()) {
      Swal.fire("Error!", "Subject and message are required.", "error");
      return;
    }

    try {
      const res = await sendPromotionalMail({ subject, message }).unwrap();
      Swal.fire("Success!", res.message || "Mail sent successfully", "success");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      Swal.fire(
        "Error!",
        err?.data?.message || "Failed to send promotional mail",
        "error",
      );
    }
  };

  return (
    <div className=" bg-gray-50 p-4">
      <div className="mx-auto w-full ">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Title title="Newsletter Subscribers" />

          {/* Promotional Mail Form */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              className="focus:border-secondary-dark rounded-lg border border-[#DBE0E5] px-3 py-2 text-sm focus:outline-none"
            />
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
              className="focus:border-secondary-dark rounded-lg border border-[#DBE0E5] px-3 py-2 text-sm focus:outline-none"
            />
            <button
              onClick={handleSendPromotionalMail}
              disabled={isSending}
              className="bg-secondary-dark hover:bg-secondary-light min-w-32 cursor-pointer rounded-lg px-4 py-2 text-white disabled:opacity-50"
            >
              {isSending ? "Sending..." : "Send Mail"}
            </button>
          </div>
        </div>

        {/* Newsletter Table */}
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
                  {/* <th className="px-6 py-5 text-left text-base font-medium text-gray-500">
                    Action
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-sm">
                      <PageLoader />
                    </td>
                  </tr>
                ) : paginatedNewsletters.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-6 text-center text-sm text-gray-600"
                    >
                      No subscribers found.
                    </td>
                  </tr>
                ) : (
                  paginatedNewsletters.map((nl, index) => (
                    <tr
                      key={nl.id}
                      className="border-b-2 border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {(currentPage - 1) * newslettersPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {nl.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(nl.createdAt).toLocaleString()}
                      </td>
                      {/* <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDelete(nl)}
                          className="flex cursor-pointer items-center justify-center rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <span className="text-xs">...</span>
                          ) : (
                            <MdDelete className="h-4 w-4" />
                          )}
                        </button>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {total > 0 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{paginatedNewsletters.length}</span>{" "}
              of <span className="font-medium">{total}</span> subscribers
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="cursor-pointer rounded-md border px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`rounded-md border px-3 py-1 text-sm ${
                      currentPage === num
                        ? "bg-secondary-dark text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {num}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage >= totalPages}
                className="cursor-pointer rounded-md border px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletterTable;

// import PageLoader from "@/components/Shared/PageLoader";
// import Title from "@/components/Shared/Title";
// import {
//   useDeleteNewsletterMutation,
//   useGetAllNewslettersQuery,
//   useSendPromotionalMailMutation,
// } from "@/redux/features/newsLetter/newsLetterApi";
// import { setSelectedNewsletter } from "@/redux/features/newsLetter/newsLetterSlice";
// import { useAppDispatch } from "@/redux/hooks/redux-hook";
// import React, { useState } from "react";
// import { MdDelete } from "react-icons/md";
// import Swal from "sweetalert2";

// const AdminNewsletterTable: React.FC = () => {
//   const {
//     data: newsletters,
//     isLoading,
//     isFetching,
//   } = useGetAllNewslettersQuery();

//   const [deleteNewsletter, { isLoading: isDeleting }] =
//     useDeleteNewsletterMutation();
//   const [sendPromotionalMail, { isLoading: isSending }] =
//     useSendPromotionalMailMutation();

//   const dispatch = useAppDispatch();

//   // State for mail form
//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");

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

//   // Handle promotional mail send
//   const handleSendPromotionalMail = async () => {
//     if (!subject.trim() || !message.trim()) {
//       Swal.fire("Error!", "Subject and message are required.", "error");
//       return;
//     }

//     try {
//       const res = await sendPromotionalMail({ subject, message }).unwrap();
//       Swal.fire("Success!", res.message || "Mail sent successfully", "success");
//       setSubject("");
//       setMessage("");
//     } catch (err: any) {
//       Swal.fire(
//         "Error!",
//         err?.data?.message || "Failed to send promotional mail",
//         "error",
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto w-full">
//         {/* Header */}
//         <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <Title title="Newsletter Subscribers" />

//           {/* Promotional Mail Form */}
//           <div className="flex flex-col gap-2 md:flex-row md:items-center">
//             <input
//               type="text"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               placeholder="Enter subject"
//               className="focus:border-secondary-dark rounded-lg border border-[#DBE0E5] px-3 py-2 text-sm focus:outline-none"
//             />
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Enter message"
//               className="focus:border-secondary-dark rounded-lg border border-[#DBE0E5] px-3 py-2 text-sm focus:outline-none"
//             />
//             <button
//               onClick={handleSendPromotionalMail}
//               disabled={isSending}
//               className="bg-secondary-dark hover:bg-secondary-light min-w-32 cursor-pointer rounded-lg px-4 py-2 text-white disabled:opacity-50"
//             >
//               {isSending ? "Sending..." : "Send Mail"}
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
//           <div className="w-full overflow-x-auto">
//             <table className="w-full min-w-[700px]">
//               <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                     No
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
//                           onClick={() => {
//                             dispatch(setSelectedNewsletter(nl));
//                             handleDelete(nl.email);
//                           }}
//                           disabled={isDeleting}
//                           className="flex cursor-pointer items-center justify-center rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 disabled:opacity-50"
//                         >
//                           {isDeleting ? (
//                             <span className="text-xs">...</span>
//                           ) : (
//                             <MdDelete className="h-4 w-4" />
//                           )}
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
