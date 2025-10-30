import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Swal from "sweetalert2";
import Title from "@/components/Shared/Title";
import PageLoader from "@/components/Shared/PageLoader";
import {
  useGetAllContactsQuery,
  useDeleteContactMutation,
} from "@/redux/features/contact/contactApi";

const AdminContactTable: React.FC = () => {
  const messagesPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const {
    data: contactData,
    isLoading,
    isError,
    refetch,
  } = useGetAllContactsQuery();

  const [deleteContact] = useDeleteContactMutation();

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This message will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#223B7D",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteContact(id).unwrap();
        if (res?.success) {
          Swal.fire("Deleted!", res.message, "success");
          refetch();
        } else {
          Swal.fire(
            "Error",
            res?.message || "Failed to delete message",
            "error",
          );
        }
      } catch (err: any) {
        Swal.fire(
          "Error",
          err?.data?.message || "Failed to delete message",
          "error",
        );
      }
    }
  };

  // Pagination logic
  const contactMessages = contactData?.data || [];
  const total = contactMessages.length;
  const totalPages = Math.ceil(total / messagesPerPage);
  const paginatedMessages = contactMessages.slice(
    (currentPage - 1) * messagesPerPage,
    currentPage * messagesPerPage,
  );

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <PageLoader />
      </div>
    );

  if (isError)
    return (
      <div className="flex h-96 items-center justify-center text-red-500">
        Failed to load contact messages. Please try again later.
      </div>
    );

  return (
    <div className="bg-gray-50">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Title title="Contact Messages" />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
                <tr>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    No
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    Subject
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    Message
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedMessages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-6 text-center text-sm text-gray-600"
                    >
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  paginatedMessages.map((msg: any, index: number) => (
                    <tr
                      key={msg.id}
                      className="border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {(currentPage - 1) * messagesPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                        {msg.name}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                        {msg.email}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                        {msg.subject.split(" ").slice(0, 4).join(" ") +
                          (msg.subject.split(" ").length > 4 ? "..." : "")}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                        {msg.message.split(" ").slice(0, 5).join(" ") +
                          (msg.message.split(" ").length > 5 ? "..." : "")}
                      </td>
                      <td className="flex gap-2 px-6 py-4">
                        <button
                          className="cursor-pointer rounded-lg bg-[#0F1F4C] p-2 text-white transition-transform hover:scale-105"
                          onClick={() => setSelectedMessage(msg)}
                          title="View Message"
                        >
                          <GrView />
                        </button>
                        <button
                          className="cursor-pointer rounded-lg bg-red-600 p-2 text-white transition-transform hover:scale-105"
                          onClick={() => handleDeleteMessage(msg.id)}
                          title="Delete Message"
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{paginatedMessages.length}</span> of{" "}
              <span className="font-medium">{total}</span> messages
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
                        ? "bg-[#223B7D] text-white"
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

        {/* View Message Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="animate-fadeIn w-[90%] max-w-lg rounded-2xl bg-white shadow-2xl">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-[#0F1F4C]">
                  {selectedMessage.subject}
                </h2>
                <p className="text-sm text-gray-500">
                  Received on:{" "}
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-3 px-6 py-5">
                <p>
                  <span className="font-medium text-gray-800">Name:</span>{" "}
                  {selectedMessage.name}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Email:</span>{" "}
                  {selectedMessage.email}
                </p>
                <hr className="my-3 border-gray-200" />
                <p className="leading-relaxed text-gray-700">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedMessage.message);
                    Swal.fire(
                      "Copied!",
                      "Message copied to clipboard.",
                      "success",
                    );
                  }}
                  className="cursor-pointer rounded-lg bg-[#223B7D] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1A2E66]"
                >
                  Copy Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactTable;

// import React, { useState } from "react";
// import { MdDelete } from "react-icons/md";
// import { GrView } from "react-icons/gr";
// import Swal from "sweetalert2";
// import Title from "@/components/Shared/Title";
// import PageLoader from "@/components/Shared/PageLoader";
// import {
//   useGetAllContactsQuery,
//   useDeleteContactMutation,
// } from "@/redux/features/contact/contactApi";

// const AdminContactTable: React.FC = () => {
//   const messagesPerPage = 8;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedMessage, setSelectedMessage] = useState<any>(null);

//   const {
//     data: contactData,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetAllContactsQuery();

//   const [deleteContact] = useDeleteContactMutation();

//   // ✅ Handle delete message
//   const handleDeleteMessage = async (id: string) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "This message will be permanently deleted.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#223B7D",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (result.isConfirmed) {
//       try {
//         const res = await deleteContact(id).unwrap();
//         if (res?.success) {
//           Swal.fire("Deleted!", res.message, "success");
//           refetch();
//         } else {
//           Swal.fire(
//             "Error",
//             res?.message || "Failed to delete message",
//             "error",
//           );
//         }
//       } catch (err: any) {
//         Swal.fire(
//           "Error",
//           err?.data?.message || "Failed to delete message",
//           "error",
//         );
//       }
//     }
//   };

//   // ✅ Pagination logic
//   const contactMessages = contactData?.data || [];
//   const total = contactMessages.length;
//   const totalPages = Math.ceil(total / messagesPerPage);
//   const paginatedMessages = contactMessages.slice(
//     (currentPage - 1) * messagesPerPage,
//     currentPage * messagesPerPage,
//   );

//   if (isLoading)
//     return (
//       <div>
//         <PageLoader />
//       </div>
//     );

//   if (isError)
//     return (
//       <div className="flex h-96 items-center justify-center text-red-500">
//         Failed to load contact messages. Please try again later.
//       </div>
//     );

//   return (
//     <div className="bg-gray-50">
//       <div className="mx-auto w-full">
//         {/* Header */}
//         <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <Title title="Contact Messages" />
//         </div>

//         {/* Table */}
//         <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white shadow-sm">
//           <div className="w-full overflow-x-auto">
//             <table className="w-full min-w-[800px]">
//               <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                     No
//                   </th>
//                   <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                     Name
//                   </th>
//                   <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                     Email
//                   </th>
//                   <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                     Subject
//                   </th>
//                   <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                     Message
//                   </th>

//                   <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedMessages.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={6}
//                       className="p-6 text-center text-sm text-gray-600"
//                     >
//                       No messages found.
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedMessages.map((msg: any, index: number) => (
//                     <tr
//                       key={msg.id}
//                       className="border-b border-gray-100 transition hover:bg-gray-50"
//                     >
//                       <td className="px-6 py-4 text-sm font-medium text-gray-700">
//                         {(currentPage - 1) * messagesPerPage + index + 1}
//                       </td>
//                       <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
//                         {msg.name}
//                       </td>
//                       <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
//                         {msg.email}
//                       </td>
//                       <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
//                         {msg.subject.split(" ").slice(0, 4).join(" ") +
//                           (msg.subject.split(" ").length > 4 ? "..." : "")}
//                       </td>
//                       <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
//                         {msg.message.split(" ").slice(0, 5).join(" ") +
//                           (msg.message.split(" ").length > 5 ? "..." : "")}
//                       </td>

//                       <td className="flex gap-2 px-6 py-4">
//                         <button
//                           className="cursor-pointer rounded-lg bg-[#0F1F4C] p-2 text-white transition-transform hover:scale-105"
//                           onClick={() => setSelectedMessage(msg)}
//                           title="View Message"
//                         >
//                           <GrView />
//                         </button>
//                         <button
//                           className="cursor-pointer rounded-lg bg-red-600 p-2 text-white transition-transform hover:scale-105"
//                           onClick={() => handleDeleteMessage(msg.id)}
//                           title="Delete Message"
//                         >
//                           <MdDelete />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         {total > 0 && (
//           <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
//             <div className="text-sm text-gray-600">
//               Showing{" "}
//               <span className="font-medium">{paginatedMessages.length}</span> of{" "}
//               <span className="font-medium">{total}</span> messages
//             </div>

//             <div className="flex flex-wrap items-center justify-center gap-1">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={currentPage <= 1}
//                 className="cursor-pointer rounded-md border px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Prev
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (num) => (
//                   <button
//                     key={num}
//                     onClick={() => setCurrentPage(num)}
//                     className={`rounded-md border px-3 py-1 text-sm ${
//                       currentPage === num
//                         ? "bg-[#223B7D] text-white"
//                         : "text-gray-700 hover:bg-gray-100"
//                     }`}
//                   >
//                     {num}
//                   </button>
//                 ),
//               )}

//               <button
//                 onClick={() =>
//                   setCurrentPage((p) => Math.min(totalPages, p + 1))
//                 }
//                 disabled={currentPage >= totalPages}
//                 className="cursor-pointer rounded-md border px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}

//         {/* ✅ Custom View Message Dialog */}
//         {selectedMessage && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//             <div className="animate-fadeIn w-[90%] max-w-lg rounded-2xl bg-white shadow-2xl">
//               <div className="border-b border-gray-200 px-6 py-4">
//                 <h2 className="text-xl font-semibold text-[#0F1F4C]">
//                   {selectedMessage.subject}
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                   Received on:{" "}
//                   {new Date(selectedMessage.createdAt).toLocaleString()}
//                 </p>
//               </div>

//               <div className="space-y-3 px-6 py-5">
//                 <p>
//                   <span className="font-medium text-gray-800">Name:</span>{" "}
//                   {selectedMessage.name}
//                 </p>
//                 <p>
//                   <span className="font-medium text-gray-800">Email:</span>{" "}
//                   {selectedMessage.email}
//                 </p>
//                 <hr className="my-3 border-gray-200" />
//                 <p className="leading-relaxed text-gray-700">
//                   {selectedMessage.message}
//                 </p>
//               </div>

//               <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
//                 <button
//                   onClick={() => setSelectedMessage(null)}
//                   className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//                 >
//                   Close
//                 </button>
//                 <button
//                   onClick={() => {
//                     navigator.clipboard.writeText(selectedMessage.message);
//                     Swal.fire(
//                       "Copied!",
//                       "Message copied to clipboard.",
//                       "success",
//                     );
//                   }}
//                   className="cursor-pointer rounded-lg bg-[#223B7D] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1A2E66]"
//                 >
//                   Copy Message
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminContactTable;
