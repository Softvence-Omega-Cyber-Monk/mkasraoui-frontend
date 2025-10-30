import React, { useState, type ChangeEvent } from "react";
import Swal from "sweetalert2";
import PageLoader from "@/components/Shared/PageLoader";
import Title from "@/components/Shared/Title";
import {
  useGetAllNewslettersQuery,
  useSendPromotionalMailMutation,
} from "@/redux/features/newsLetter/newsLetterApi";
import { FiUpload, FiX } from "react-icons/fi";

const AdminNewsletterTable: React.FC = () => {
  const newslettersPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: newsletters,
    isLoading,
    isFetching,
  } = useGetAllNewslettersQuery();

  const [sendPromotionalMail, { isLoading: isSending }] =
    useSendPromotionalMailMutation();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const total = newsletters?.length || 0;
  const totalPages = Math.ceil(total / newslettersPerPage);
  const paginatedNewsletters =
    newsletters?.slice(
      (currentPage - 1) * newslettersPerPage,
      currentPage * newslettersPerPage,
    ) || [];

  // --- Handle file selection ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // --- Remove single file ---
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Handle sending promotional mail ---
  const handleSendPromotionalMail = async () => {
    if (!subject.trim() || !message.trim()) {
      Swal.fire("Error!", "Subject and message are required.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("message", message);
      files.forEach((file) => formData.append("files", file));

      const res = await sendPromotionalMail(formData as any).unwrap();
      Swal.fire(
        "Success!",
        res.data.message || "Mail sent successfully",
        "success",
      );

      // Reset form
      setSubject("");
      setMessage("");
      setFiles([]);
      setIsModalOpen(false);
    } catch (err: any) {
      Swal.fire(
        "Error!",
        err?.data?.message || "Failed to send promotional mail",
        "error",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Title title="Newsletter Subscribers" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-secondary-dark hover:bg-secondary-light min-w-32 cursor-pointer rounded-lg px-4 py-2 text-white"
          >
            Send Promotional Mail
          </button>
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
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-sm">
                      <PageLoader />
                    </td>
                  </tr>
                ) : paginatedNewsletters.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-6 text-center text-sm text-gray-600"
                    >
                      No subscribers found.
                    </td>
                  </tr>
                ) : (
                  paginatedNewsletters.map((nl, index) => (
                    <tr
                      key={nl.id}
                      className="border-b-2 border-gray-100 transition hover:bg-gray-50"
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

      {/* --- Modal with File Upload --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="animate-fadeIn w-full max-w-xl rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-center text-lg font-semibold text-gray-800">
              Send Promotional Mail
            </h2>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-lg font-medium">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject"
                  className="focus:border-secondary-dark w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message"
                  rows={4}
                  className="focus:border-secondary-dark w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium">Attach Files</label>
                <label className="flex h-16 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 transition hover:border-blue-500 hover:bg-blue-50">
                  <FiUpload className="mb-2 h-10 w-10 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click here to select files
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Display selected files */}
                {files.length > 0 && (
                  <div className="mt-2 rounded border border-gray-200 bg-gray-50 p-3">
                    <ul className="space-y-1 text-sm text-gray-600">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span>{file.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                            <button
                              onClick={() => removeFile(index)}
                              className="cursor-pointer text-red-500 hover:text-red-700"
                            >
                              <FiX />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer rounded-xl bg-gray-300 px-5 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSendPromotionalMail}
                disabled={isSending}
                className="bg-secondary-dark hover:bg-secondary-light cursor-pointer rounded-xl px-5 py-2 text-white"
              >
                {isSending ? "Sending..." : "Send Mail"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletterTable;

// import React, { useState, type ChangeEvent } from "react";
// import Swal from "sweetalert2";
// import PageLoader from "@/components/Shared/PageLoader";
// import Title from "@/components/Shared/Title";
// import {
//   useGetAllNewslettersQuery,
//   useSendPromotionalMailMutation,
// } from "@/redux/features/newsLetter/newsLetterApi";
// import { FiUpload } from "react-icons/fi";

// const AdminNewsletterTable: React.FC = () => {
//   const newslettersPerPage = 10;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const {
//     data: newsletters,
//     isLoading,
//     isFetching,
//   } = useGetAllNewslettersQuery();

//   const [sendPromotionalMail, { isLoading: isSending }] =
//     useSendPromotionalMailMutation();

//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");
//   const [files, setFiles] = useState<File[]>([]);

//   const total = newsletters?.length || 0;
//   const totalPages = Math.ceil(total / newslettersPerPage);
//   const paginatedNewsletters =
//     newsletters?.slice(
//       (currentPage - 1) * newslettersPerPage,
//       currentPage * newslettersPerPage,
//     ) || [];

//   // --- Handle file selection ---
//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFiles(Array.from(e.target.files));
//     }
//   };

//   // --- Handle sending promotional mail ---
//   const handleSendPromotionalMail = async () => {
//     if (!subject.trim() || !message.trim()) {
//       Swal.fire("Error!", "Subject and message are required.", "error");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("subject", subject);
//       formData.append("message", message);

//       files.forEach((file) => formData.append("files", file));

//       const res = await sendPromotionalMail(formData as any).unwrap(); // cast to any because RTK Query expects object
//       Swal.fire(
//         "Success!",
//         res.data.message || "Mail sent successfully",
//         "success",
//       );

//       // Reset form
//       setSubject("");
//       setMessage("");
//       setFiles([]);
//       setIsModalOpen(false);
//     } catch (err: any) {
//       Swal.fire(
//         "Error!",
//         err?.data?.message || "Failed to send promotional mail",
//         "error",
//       );
//     }
//   };

//   return (
//     <div className="bg-gray-50 p-4">
//       <div className="mx-auto w-full">
//         {/* Header */}
//         <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <Title title="Newsletter Subscribers" />
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-secondary-dark hover:bg-secondary-light min-w-32 cursor-pointer rounded-lg px-4 py-2 text-white"
//           >
//             Send Promotion Mail
//           </button>
//         </div>

//         {/* Newsletter Table */}
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
//                 </tr>
//               </thead>
//               <tbody>
//                 {isLoading || isFetching ? (
//                   <tr>
//                     <td colSpan={3} className="p-6 text-center text-sm">
//                       <PageLoader />
//                     </td>
//                   </tr>
//                 ) : paginatedNewsletters.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={3}
//                       className="p-6 text-center text-sm text-gray-600"
//                     >
//                       No subscribers found.
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedNewsletters.map((nl, index) => (
//                     <tr
//                       key={nl.id}
//                       className="border-b-2 border-gray-100 transition hover:bg-gray-50"
//                     >
//                       <td className="px-6 py-4 text-sm font-medium text-gray-700">
//                         {(currentPage - 1) * newslettersPerPage + index + 1}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {nl.email}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {new Date(nl.createdAt).toLocaleString()}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination Controls */}
//         {total > 0 && (
//           <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
//             <div className="text-sm text-gray-600">
//               Showing{" "}
//               <span className="font-medium">{paginatedNewsletters.length}</span>{" "}
//               of <span className="font-medium">{total}</span> subscribers
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
//                         ? "bg-secondary-dark text-white"
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
//       </div>

//       {/* --- Modal with File Upload --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//           <div className="animate-fadeIn w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
//             <h2 className="mb-4 text-center text-lg font-semibold text-gray-800">
//               Send Promotional Mail
//             </h2>

//             <div className="space-y-3">
//               <div className="space-y-2">
//                 <label className="text-lg">Subject</label>
//                 <input
//                   type="text"
//                   value={subject}
//                   onChange={(e) => setSubject(e.target.value)}
//                   placeholder="Enter subject"
//                   className="focus:border-secondary-dark w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-lg">Message</label>
//                 <textarea
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Enter message"
//                   rows={4}
//                   className="focus:border-secondary-dark w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-lg">Attach Files</label>

//                 <label className="flex h-15 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 transition hover:border-blue-500 hover:bg-blue-50">
//                   <FiUpload className="mb-2 h-8 w-8 text-gray-400" />
//                   <span className="text-sm text-gray-500">
//                     CLick here to select files
//                   </span>
//                   <input
//                     type="file"
//                     multiple
//                     onChange={handleFileChange}
//                     className="hidden"
//                   />
//                 </label>
//               </div>
//             </div>

//             <div className="mt-5 flex justify-end gap-3">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="cursor-pointer rounded-xl bg-gray-300 px-5 py-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSendPromotionalMail}
//                 disabled={isSending}
//                 className="bg-secondary-dark hover:bg-secondary-light cursor-pointer rounded-xl px-5 py-2 text-white"
//               >
//                 {isSending ? "Sending..." : "Send Mail"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminNewsletterTable;

// import React, { useState } from "react";
// // import { MdDelete } from "react-icons/md";
// import Swal from "sweetalert2";

// import PageLoader from "@/components/Shared/PageLoader";
// import Title from "@/components/Shared/Title";
// import {
//   // useDeleteNewsletterMutation,
//   useGetAllNewslettersQuery,
//   useSendPromotionalMailMutation,
// } from "@/redux/features/newsLetter/newsLetterApi";

// interface Newsletter {
//   id: string;
//   email: string;
//   createdAt: string;
// }

// const AdminNewsletterTable: React.FC = () => {
//   const newslettersPerPage = 10;
//   const [currentPage, setCurrentPage] = useState(1);

//   const {
//     data: newsletters,
//     isLoading,
//     isFetching,
//   } = useGetAllNewslettersQuery();

//   // const [deleteNewsletter, { isLoading: isDeleting }] =
//   //   useDeleteNewsletterMutation();
//   const [sendPromotionalMail, { isLoading: isSending }] =
//     useSendPromotionalMailMutation();

//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const total = newsletters?.length || 0;
//   const totalPages = Math.ceil(total / newslettersPerPage);
//   const paginatedNewsletters: Newsletter[] =
//     newsletters?.slice(
//       (currentPage - 1) * newslettersPerPage,
//       currentPage * newslettersPerPage,
//     ) || [];

//   // // Delete subscriber
//   // const handleDelete = async (nl: Newsletter) => {
//   //   const result = await Swal.fire({
//   //     title: "Are you sure?",
//   //     text: `Delete subscriber ${nl.email}?`,
//   //     icon: "warning",
//   //     showCancelButton: true,
//   //     confirmButtonColor: "#3085d6",
//   //     cancelButtonColor: "#d33",
//   //     confirmButtonText: "Yes, delete it!",
//   //   });

//   //   if (result.isConfirmed) {
//   //     try {
//   //       await deleteNewsletter(nl.email).unwrap();
//   //       Swal.fire("Deleted!", `${nl.email} has been deleted.`, "success");
//   //     } catch (err: any) {
//   //       Swal.fire(
//   //         "Error!",
//   //         err?.data?.message || "Failed to delete subscriber",
//   //         "error",
//   //       );
//   //     }
//   //   }
//   // };

//   // Send promotional mail
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
//       setIsModalOpen(false);
//     } catch (err: any) {
//       Swal.fire(
//         "Error!",
//         err?.data?.message || "Failed to send promotional mail",
//         "error",
//       );
//     }
//   };

//   return (
//     <div className="bg-gray-50 p-4">
//       <div className="mx-auto w-full">
//         {/* Header */}
//         <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <Title title="Newsletter Subscribers" />

//           {/* Open Dialog Button */}
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-secondary-dark hover:bg-secondary-light min-w-32 cursor-pointer rounded-lg px-4 py-2 text-white"
//           >
//             Send Promotion Mail
//           </button>
//         </div>

//         {/* Newsletter Table */}
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
//                   {/* <th className="px-6 py-5 text-left text-base font-medium text-gray-500">
//                     Action
//                   </th> */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {isLoading || isFetching ? (
//                   <tr>
//                     <td colSpan={4} className="p-6 text-center text-sm">
//                       <PageLoader />
//                     </td>
//                   </tr>
//                 ) : paginatedNewsletters.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={4}
//                       className="p-6 text-center text-sm text-gray-600"
//                     >
//                       No subscribers found.
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedNewsletters.map((nl, index) => (
//                     <tr
//                       key={nl.id}
//                       className="border-b-2 border-gray-100 transition hover:bg-gray-50"
//                     >
//                       <td className="px-6 py-4 text-sm font-medium text-gray-700">
//                         {(currentPage - 1) * newslettersPerPage + index + 1}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {nl.email}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {new Date(nl.createdAt).toLocaleString()}
//                       </td>
//                       {/* <td className="px-6 py-4 text-sm">
//                         <button
//                           onClick={() => handleDelete(nl)}
//                           className="flex cursor-pointer items-center justify-center rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 disabled:opacity-50"
//                         >
//                           {isDeleting ? (
//                             <span className="text-xs">...</span>
//                           ) : (
//                             <MdDelete className="h-4 w-4" />
//                           )}
//                         </button>
//                       </td> */}
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination Controls */}
//         {total > 0 && (
//           <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
//             <div className="text-sm text-gray-600">
//               Showing{" "}
//               <span className="font-medium">{paginatedNewsletters.length}</span>{" "}
//               of <span className="font-medium">{total}</span> subscribers
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
//                         ? "bg-secondary-dark text-white"
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
//       </div>

//       {/* ---- Modal for Sending Mail ---- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//           <div className="animate-fadeIn w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
//             <h2 className="mb-4 text-center text-lg font-semibold text-gray-800">
//               Send Promotional Mail
//             </h2>

//             <div className="space-y-3">
//               <div className="space-y-2">
//                 <div>
//                   <label className="text-lg">Subject</label>
//                 </div>
//                 <input
//                   type="text"
//                   value={subject}
//                   onChange={(e) => setSubject(e.target.value)}
//                   placeholder="Enter subject"
//                   className="focus:border-secondary-dark w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <div>
//                   <label className="text-lg">Message</label>
//                 </div>
//                 <textarea
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Enter message"
//                   rows={4}
//                   className="focus:border-secondary-dark w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
//                 />
//               </div>
//             </div>

//             <div className="mt-5 flex justify-end gap-3">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="cursor-pointer rounded-xl bg-gray-300 px-5 py-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSendPromotionalMail}
//                 disabled={isSending}
//                 className="bg-secondary-dark hover:bg-secondary-light cursor-pointer rounded-xl px-5 py-2 text-white"
//               >
//                 {isSending ? "Sending..." : "Send Mail"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminNewsletterTable;
