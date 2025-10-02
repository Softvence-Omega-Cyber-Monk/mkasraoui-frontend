 

// import React, { useState, type ChangeEvent } from "react";
// import {
//   useGetBlogsQuery,
//   useAddBlogMutation,
//   useUpdateBlogMutation,
//   useDeleteBlogMutation,
// } from "@/redux/features/blog/blogApi";
// import type { Blog } from "@/redux/types/blog.type";
// import toast from "react-hot-toast";
// import PageLoader from "@/components/Shared/PageLoader";
// import { Plus } from "lucide-react";
// import Title from "@/components/Shared/Title";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { GrView } from "react-icons/gr";

// interface BlogFormType {
//   title: string;
//   description: string;
//   conclusion: string;
//   badge: string;
//   tag: string[];
//   files: File[];
//   previewUrls: string[];
// }

// const AdminBlogTable: React.FC = () => {
//   const { data, isLoading, isFetching } = useGetBlogsQuery();
//   const blogs: Blog[] = data?.data ?? [];

//   const [addBlog] = useAddBlogMutation();
//   const [updateBlog] = useUpdateBlogMutation();
//   const [deleteBlog] = useDeleteBlogMutation();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
//   const [viewBlog, setViewBlog] = useState<Blog | null>(null);
//   const [confirmDelete, setConfirmDelete] = useState<Blog | null>(null);

//   const [formData, setFormData] = useState<BlogFormType>({
//     title: "",
//     description: "",
//     conclusion: "",
//     badge: "",
//     tag: [],
//     files: [],
//     previewUrls: [],
//   });

//   // Pagination
//   const [page, setPage] = useState(1);
//   const blogsPerPage = 10;
//   const total = blogs.length;
//   const totalPages = Math.ceil(total / blogsPerPage);
//   const startIndex = (page - 1) * blogsPerPage;
//   const endIndex = startIndex + blogsPerPage;
//   const paginatedBlogs = blogs.slice(startIndex, endIndex);

//   // Open modals
//   const openAddModal = () => {
//     setEditingBlog(null);
//     setFormData({
//       title: "",
//       description: "",
//       conclusion: "",
//       badge: "",
//       tag: [],
//       files: [],
//       previewUrls: [],
//     });
//     setIsModalOpen(true);
//   };

//   const openEditModal = (blog: Blog) => {
//     setEditingBlog(blog);
//     setFormData({
//       title: blog.title,
//       description: blog.description,
//       conclusion: blog.conclusion,
//       badge: blog.badge,
//       tag: blog.tag ?? [],
//       files: [],
//       previewUrls: blog.images ?? [],
//     });
//     setIsModalOpen(true);
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const filesArray = Array.from(e.target.files);
//     const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
//     setFormData((prev) => ({ ...prev, files: filesArray, previewUrls }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const dataToSend = new FormData();
//       const payload = {
//         title: formData.title,
//         description: formData.description,
//         conclusion: formData.conclusion,
//         badge: formData.badge,
//         tag: formData.tag,
//       };
//       dataToSend.append("data", JSON.stringify(payload));
//       formData.files.forEach((file) => dataToSend.append("files", file));

//       if (editingBlog) {
//         await updateBlog({ id: editingBlog.id, data: dataToSend }).unwrap();
//         toast.success("Blog updated successfully");
//       } else {
//         await addBlog(dataToSend).unwrap();
//         toast.success("Blog added successfully");
//       }

//       setIsModalOpen(false);
//       setFormData({
//         title: "",
//         description: "",
//         conclusion: "",
//         badge: "",
//         tag: [],
//         files: [],
//         previewUrls: [],
//       });
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to submit blog");
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirmDelete) return;
//     try {
//       await deleteBlog(confirmDelete.id).unwrap();
//       toast.success("Blog deleted successfully");
//       setConfirmDelete(null);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete blog");
//     }
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-6 flex items-center justify-between">
//         <Title title="Blogs" />
//         <button
//           onClick={openAddModal}
//           className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
//         >
//           <Plus className="h-5 w-5" /> Add Blog
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
//         <div className="w-full overflow-x-auto">
//           <table className="w-full min-w-[900px]">
//             <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
//               <tr>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Title
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Description
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Conclusion
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Badge
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Tags
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Image
//                 </th>
//                 <th className="px-6 py-5 text-center text-sm font-medium text-gray-500">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading || isFetching ? (
//                 <tr>
//                   <td colSpan={7} className="p-6 text-center text-sm text-gray-500">
//                     <PageLoader />
//                   </td>
//                 </tr>
//               ) : blogs.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="p-6 text-center text-sm text-gray-600">
//                     No blogs found.
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedBlogs.map((blog) => (
//                   <tr key={blog.id} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="px-6 py-4 text-sm font-semibold text-gray-900">
//                       {blog.title.slice(0, 30)}...
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {blog.description.slice(0, 30)}...
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {blog.conclusion.slice(0, 30)}...
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">{blog.badge}</td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {blog.tag.join(", ")}
//                     </td>
//                     <td className="px-6 py-4">
//                       {blog.images && blog.images.length > 0 ? (
//                         <img
//                           src={blog.images[0]}
//                           alt={blog.title}
//                           className="h-14 w-14 rounded-md object-cover"
//                         />
//                       ) : (
//                         <span className="text-xs text-gray-500">No image</span>
//                       )}
//                     </td>
//                     <td className="flex justify-center space-x-2 px-6 py-4">
//                       <button
//                         onClick={() => openEditModal(blog)}
//                         className="flex items-center justify-center rounded-md bg-yellow-500 p-2 text-white hover:bg-yellow-600"
//                       >
//                         <FaRegEdit className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => setConfirmDelete(blog)}
//                         className="flex items-center justify-center rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
//                       >
//                         <MdDelete className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => setViewBlog(blog)}
//                         className="flex items-center justify-center rounded-md bg-emerald-500 p-2 text-white hover:bg-emerald-600"
//                       >
//                         <GrView className="h-4 w-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {blogs.length > 0 && (
//           <div className="mt-6 flex items-center justify-between px-4 py-3">
//             <div className="text-sm text-gray-600">
//               Showing <span className="font-medium">{paginatedBlogs.length}</span> of{" "}
//               <span className="font-medium">{total}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page <= 1}
//                 className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Prev
//               </button>
//               <div className="min-w-[50px] rounded-md border bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
//                 {page} / {totalPages}
//               </div>
//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page >= totalPages}
//                 className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add/Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//           <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
//             <h3 className="mb-6 text-2xl font-semibold text-gray-900">
//               {editingBlog ? "Edit Blog" : "Add Blog"}
//             </h3>
//             <div className="grid grid-cols-1 gap-4">
//               <input
//                 type="text"
//                 placeholder="Title"
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                 className="w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//               />
//               <textarea
//                 placeholder="Description"
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 className="w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//                 rows={3}
//               />
//               <textarea
//                 placeholder="Conclusion"
//                 value={formData.conclusion}
//                 onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
//                 className="w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//                 rows={3}
//               />

//               {/* Badge select */}
//               <select
//                 value={formData.badge}
//                 onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
//                 className="w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//               >
//                 <option value="">Select Badge</option>
//                 <option value="Featured">Featured</option>
//                 <option value="Trending">Trending</option>
//                 <option value="New">New</option>
//                 <option value="Popular">Popular</option>
//               </select>

//               {/* Tags multi-select */}
//              <select
//   value={formData.tag[0] || ""}
//   onChange={(e) => setFormData({ ...formData, tag: [e.target.value] })}
//   className="w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
// >
//   <option value="">Select Tag</option>
//   <option value="NestJS">NestJS</option>
//   <option value="Prisma">Prisma</option>
//   <option value="React">React</option>
//   <option value="TypeScript">TypeScript</option>
//   <option value="Blog">Blog</option>
// </select> 

//               <input
//                 type="file"
//                 multiple
//                 onChange={handleFileChange}
//                 className="w-full rounded-lg border px-4 py-3 text-sm cursor-pointer"
//               />
//               {formData.previewUrls.length > 0 && (
//                 <div className="flex gap-2 flex-wrap">
//                   {formData.previewUrls.map((url, idx) => (
//                     <img
//                       key={idx}
//                       src={url}
//                       alt={`preview-${idx}`}
//                       className="h-16 w-16 object-cover rounded"
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className="mt-8 flex justify-end gap-4">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="rounded-lg bg-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
//               >
//                 {editingBlog ? "Update" : "Add"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Modal */}
//       {viewBlog && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
//             <h3 className="mb-4 text-xl font-bold text-gray-800">Blog Details</h3>
//             <p className="mb-2"><strong>Title:</strong> {viewBlog.title}</p>
//             <p className="mb-2"><strong>Description:</strong> {viewBlog.description}</p>
//             <p className="mb-2"><strong>Conclusion:</strong> {viewBlog.conclusion}</p>
//             <p className="mb-2"><strong>Badge:</strong> {viewBlog.badge}</p>
//             <p className="mb-2"><strong>Tags:</strong> {viewBlog.tag.join(", ")}</p>
//             <div className="flex flex-wrap gap-2 mb-4">
//               {viewBlog.images?.map((img, idx) => (
//                 <img key={idx} src={img} alt={`img-${idx}`} className="h-24 w-24 object-cover rounded" />
//               ))}
//             </div>
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setViewBlog(null)}
//                 className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirm Delete Modal */}
//       {confirmDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
//             <h3 className="mb-4 text-lg font-bold text-gray-800">Confirm Delete</h3>
//             <p className="text-sm text-gray-600">
//               Are you sure you want to delete <span className="font-semibold">{confirmDelete.title}</span>?
//             </p>
//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 onClick={() => setConfirmDelete(null)}
//                 className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminBlogTable;






























import React, { useState, type ChangeEvent } from "react";
import {
  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "@/redux/features/blog/blogApi";
import type { Blog } from "@/redux/types/blog.type";
import toast from "react-hot-toast";
import PageLoader from "@/components/Shared/PageLoader";
import { Plus } from "lucide-react";
import Title from "@/components/Shared/Title";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";

// 💡 NOTE: In a real environment, you would replace this with the actual rich text editor
// (e.g., install 'react-quill' and 'quill', then replace this component with the actual editor).
// You would also need to import the editor's CSS (e.g., import 'react-quill/dist/quill.snow.css';)
const RichTextEditor = ({ value, onChange, placeholder }: { value: string, onChange: (content: string) => void, placeholder: string }) => {
    // 📢 To make this work, you must replace the content of this function with a real rich text editor
    // E.g., using ReactQuill:
   
    // return (
    //     <ReactQuill
    //         theme="snow"
    //         value={value}
    //         onChange={onChange}
    //         placeholder={placeholder}
    //         className="h-40" // Example height
    //     />
    // );
    
   console.log(RichTextEditor)
    // For now, it will render as a simple textarea to avoid breaking the code without the dependency.
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
            rows={5}
        />
    );
};

interface BlogFormType {
  title: string;
  description: string;
  conclusion: string;
  badge: string;
  tag: string[];
  files: File[];
  previewUrls: string[];
}

const AdminBlogTable: React.FC = () => {
  const { data, isLoading, isFetching } = useGetBlogsQuery();
  const blogs: Blog[] = data?.data ?? [];

  const [addBlog] = useAddBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [viewBlog, setViewBlog] = useState<Blog | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Blog | null>(null);

  const [formData, setFormData] = useState<BlogFormType>({
    title: "",
    description: "",
    conclusion: "",
    badge: "",
    tag: [],
    files: [],
    previewUrls: [],
  });

  // Pagination
  const [page, setPage] = useState(1);
  const blogsPerPage = 10;
  const total = blogs.length;
  const totalPages = Math.ceil(total / blogsPerPage);
  const startIndex = (page - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const paginatedBlogs = blogs.slice(startIndex, endIndex);

  // Open modals
  const openAddModal = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      description: "",
      conclusion: "",
      badge: "",
      tag: [],
      files: [],
      previewUrls: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      conclusion: blog.conclusion,
      badge: blog.badge,
      tag: blog.tag ?? [],
      files: [],
      previewUrls: blog.images ?? [],
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, files: filesArray, previewUrls }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = new FormData();
      const payload = {
        title: formData.title,
        description: formData.description,
        conclusion: formData.conclusion,
        badge: formData.badge,
        tag: formData.tag,
      };
      dataToSend.append("data", JSON.stringify(payload));
      formData.files.forEach((file) => dataToSend.append("files", file));

      if (editingBlog) {
        await updateBlog({ id: editingBlog.id, data: dataToSend }).unwrap();
        toast.success("Blog updated successfully");
      } else {
        await addBlog(dataToSend).unwrap();
        toast.success("Blog added successfully");
      }

      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        conclusion: "",
        badge: "",
        tag: [],
        files: [],
        previewUrls: [],
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit blog");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteBlog(confirmDelete.id).unwrap();
      toast.success("Blog deleted successfully");
      setConfirmDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Title title="Blogs" />
        <button
          onClick={openAddModal}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
        >
          <Plus className="h-5 w-5" /> Add Blog
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Title
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Description
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Conclusion
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Badge
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Tags
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Image
                </th>
                <th className="px-6 py-5 text-center text-sm font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-sm text-gray-500">
                    <PageLoader />
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-sm text-gray-600">
                    No blogs found.
                  </td>
                </tr>
              ) : (
                paginatedBlogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {blog.title.slice(0, 30)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {blog.description.slice(0, 30)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {/* Note: The conclusion slice might cut off HTML tags, but this is a table view compromise */}
                      {blog.conclusion.slice(0, 30)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{blog.badge}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {blog.tag.join(", ")}
                    </td>
                    <td className="px-6 py-4">
                      {blog.images && blog.images.length > 0 ? (
                        <img
                          src={blog.images[0]}
                          alt={blog.title}
                          className="h-14 w-14 rounded-md object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">No image</span>
                      )}
                    </td>
                    <td className="flex justify-center space-x-2 px-6 py-4">
                      <button
                        onClick={() => openEditModal(blog)}
                        className="flex items-center justify-center rounded-md bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                      >
                        <FaRegEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(blog)}
                        className="flex items-center justify-center rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                      >
                        <MdDelete className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewBlog(blog)}
                        className="flex items-center justify-center rounded-md bg-emerald-500 p-2 text-white hover:bg-emerald-600"
                      >
                        <GrView className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {blogs.length > 0 && (
          <div className="mt-6 flex items-center justify-between px-4 py-3">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{paginatedBlogs.length}</span> of{" "}
              <span className="font-medium">{total}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>
              <div className="min-w-[50px] rounded-md border bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
            <h3 className="mb-6 text-2xl font-semibold text-gray-900">
              {editingBlog ? "Edit Blog" : "Add Blog"}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                rows={3}
              />
              
              {/* 🚀 Replaced textarea with RichTextEditor component */}
              <div className="pb-8"> {/* Added padding for the rich text editor if it uses absolute positioning */}
                  <RichTextEditor
                    placeholder="Conclusion (Enter rich text here, e.g., headings, bold, lists)"
                    value={formData.conclusion}
                    onChange={(content) => setFormData({ ...formData, conclusion: content })}
                  />
              </div>

              {/* Badge select */}
              <select
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
              >
                <option value="">Select Badge</option>
                <option value="Featured">Featured</option>
                <option value="Trending">Trending</option>
                <option value="New">New</option>
                <option value="Popular">Popular</option>
              </select>

              {/* Tags multi-select */}
             <select
                 value={formData.tag[0] || ""}
                 onChange={(e) => setFormData({ ...formData, tag: [e.target.value] })}
                 className="w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
             >
                 <option value="">Select Tag</option>
                 <option value="NestJS">NestJS</option>
                 <option value="Prisma">Prisma</option>
                 <option value="React">React</option>
                 <option value="TypeScript">TypeScript</option>
                 <option value="Blog">Blog</option>
             </select> 

              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full rounded-lg border px-4 py-3 text-sm cursor-pointer"
              />
              {formData.previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.previewUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`preview-${idx}`}
                      className="h-16 w-16 rounded object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg bg-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                {editingBlog ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-gray-800">Blog Details</h3>
            <p className="mb-2"><strong>Title:</strong> {viewBlog.title}</p>
            <p className="mb-2"><strong>Description:</strong> {viewBlog.description}</p>
            {/* 🚀 Updated to display rich text content */}
            <div className="mb-2">
                <strong>Conclusion:</strong>
                {/* ⚠️ IMPORTANT: Use a library like DOMPurify to sanitize HTML content before using dangerouslySetInnerHTML */}
                <div 
                    className="prose max-w-none text-sm text-gray-600 mt-1"
                    dangerouslySetInnerHTML={{ __html: viewBlog.conclusion }} 
                />
            </div>
            <p className="mb-2"><strong>Badge:</strong> {viewBlog.badge}</p>
            <p className="mb-2"><strong>Tags:</strong> {viewBlog.tag.join(", ")}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {viewBlog.images?.map((img, idx) => (
                <img key={idx} src={img} alt={`img-${idx}`} className="h-24 w-24 rounded object-cover" />
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setViewBlog(null)}
                className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-gray-800">Confirm Delete</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-semibold">{confirmDelete.title}</span>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogTable;
