import React, { useState, useEffect, type ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { RichTextEditor } from "@mantine/rte";
import { Plus, ChevronDown, ChevronUp, Search } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";
import toast from "react-hot-toast";
import PageLoader from "@/components/Shared/PageLoader";
import Title from "@/components/Shared/Title";
import {
  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "@/redux/features/blog/blogApi";
import type { Blog } from "@/redux/types/blog.type";

interface RichTextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextInput: React.FC<RichTextInputProps> = ({ value, onChange }) => (
  <div className="overflow-hidden rounded-lg border border-[#DBE0E5] p-2 lg:h-[300px]">
    <RichTextEditor
      className="overflow-hidden overflow-y-scroll lg:h-[280px]"
      value={value}
      onChange={onChange}
    />
  </div>
);

function stripHtml(html: string) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

interface BlogFormType {
  title: string;
  description: string;
  conclusion: string;
  badge: string;
  tag: string[];
  files: File[];
  previewUrls: string[];
}

const tagOptions = [
  "Parenting advice",
  "Organization guide",
  "Party tips",
  "Checklists",
  "Event planning",
  "Birthday budget",
  "Best practices",
  "Decor inspirations",
  "Party trends",
];

const AdminBlogTable: React.FC = () => {
  const { data, isLoading, isFetching } = useGetBlogsQuery();
  const blogs: Blog[] = data?.data ?? [];

  const [addBlog, { isLoading: addLoading }] = useAddBlogMutation();
  const [updateBlog, { isLoading: updateLoading }] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [viewBlog, setViewBlog] = useState<Blog | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Blog | null>(null);
  const [tagOpen, setTagOpen] = useState(false);
  const [badgeOpen, setbadgeOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<BlogFormType>({
    defaultValues: {
      title: "",
      description: "",
      conclusion: "",
      badge: "",
      tag: [],
      files: [],
      previewUrls: [],
    },
  });

  const formData = watch();

  // Pagination
  const [page, setPage] = useState(1);
  const blogsPerPage = 8;

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter((blog) => {
    const text = (
      blog.title +
      " " +
      stripHtml(blog.description) +
      " " +
      stripHtml(blog.conclusion)
    ).toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  useEffect(() => setPage(1), [searchTerm, filteredBlogs.length]);

  const paginatedBlogs = filteredBlogs.slice(
    (page - 1) * blogsPerPage,
    page * blogsPerPage,
  );

  // Modal Handlers
  const openAddModal = () => {
    setEditingBlog(null);
    setValue("tag", []);
    setIsModalOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);
    setValue("title", blog.title);
    setValue("description", blog.description);
    setValue("conclusion", blog.conclusion);
    setValue("badge", blog.badge);
    setValue("tag", blog.tag ?? []);
    setValue("previewUrls", blog.images ?? []);
    setValue("files", []);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    formData.previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const filesArray = Array.from(e.target.files);
    const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
    setValue("files", filesArray);
    setValue("previewUrls", previewUrls);
  };

  const onSubmit = async (data: BlogFormType) => {
    try {
      const formDataToSend = new FormData();
      const payload = {
        title: data.title,
        description: data.description,
        conclusion: data.conclusion,
        badge: data.badge,
        tag: data.tag,
      };
      formDataToSend.append("data", JSON.stringify(payload));
      data.files.forEach((file) => formDataToSend.append("files", file));

      if (editingBlog) {
        await updateBlog({ id: editingBlog.id, data: formDataToSend }).unwrap();
        toast.success("Blog updated successfully");
      } else {
        await addBlog(formDataToSend).unwrap();
        toast.success("Blog added successfully");
      }

      setIsModalOpen(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Title title="Blogs" />
        <button
          onClick={openAddModal}
          className="bg-secondary-dark hover:bg-secondary-light flex items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:cursor-pointer focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
        >
          <Plus className="h-5 w-5" /> Add Blog
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 flex w-full justify-start">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, description, or conclusion..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-10 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-medium">
                  Title
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium">
                  Description
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium">
                  Conclusion
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium">
                  Badge
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium">
                  Tags
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium">
                  Image
                </th>
                <th className="px-6 py-5 text-center text-sm font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center">
                    <PageLoader />
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-6 text-center text-sm text-gray-600"
                  >
                    No blogs found.
                  </td>
                </tr>
              ) : (
                paginatedBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      {blog.title.slice(0, 30)}...
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {stripHtml(blog.description).slice(0, 30)}...
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {stripHtml(blog.conclusion).slice(0, 30)}...
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {blog.badge}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {blog.tag.join(", ").slice(0, 10)}...
                    </td>
                    <td className="px-6 py-3">
                      {blog.images?.length ? (
                        <img
                          src={blog.images[0]}
                          alt={blog.title}
                          className="h-14 w-14 rounded object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">No image</span>
                      )}
                    </td>
                    <td className="mt-3 flex justify-center gap-2 px-6 py-4">
                      <button
                        onClick={() => openEditModal(blog)}
                        className="rounded-lg bg-yellow-500 p-2 text-white hover:cursor-pointer hover:bg-yellow-600"
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(blog)}
                        className="rounded-lg bg-red-600 p-2 text-white hover:cursor-pointer hover:bg-red-700"
                      >
                        <MdDelete />
                      </button>
                      <button
                        onClick={() => setViewBlog(blog)}
                        className="rounded-lg bg-[#0F1F4C] p-2 text-white hover:cursor-pointer hover:bg-[#041646]"
                      >
                        <GrView />
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
      {filteredBlogs.length > 0 && (
        <div className="mt-6 flex items-center justify-between px-4 py-3">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{paginatedBlogs.length}</span>{" "}
            of <span className="font-medium">{filteredBlogs.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:cursor-pointer hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <div className="min-w-[50px] rounded-md border bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
              {page} / {totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:cursor-pointer hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50">
          <div className="w-full overflow-y-auto rounded-lg bg-white p-6 shadow-lg lg:max-w-6xl">
            <div className="flex items-center justify-between">
              <h3 className="mb-4 text-xl font-semibold">
                {editingBlog ? "Edit Blog" : "Add Blog"}
              </h3>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl bg-gray-50 px-4 py-2 hover:cursor-pointer hover:bg-gray-400"
              >
                X
              </button>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-8">
                {/* Title + Badge (side by side on large screens) */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Title"
                      {...control.register("title", {
                        required: "Title required",
                      })}
                      className="w-full rounded-lg border border-[#DBE0E5] p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Badge */}
                  <div className="relative space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Badge
                    </label>
                    <div
                      className="relative"
                      onClick={() => setbadgeOpen(!badgeOpen)}
                    >
                      <select
                        {...control.register("badge", {
                          required: "Badge required",
                        })}
                        className="w-full cursor-pointer appearance-none rounded-lg border border-[#DBE0E5] p-3 pr-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      >
                        <option value="">Select Badge</option>
                        <option value="Inspiration">Inspiration</option>
                        <option value="PartyTip">Party Tip</option>
                        <option value="Parent">Parent</option>
                        <option value="EasyOrganization">
                          Easy Organization
                        </option>
                        <option value="Birthday">Easy Birthday</option>
                        <option value="Child">Child</option>
                        <option value="Popular">Popular</option>
                        <option value="Featured">Featured</option>
                        <option value="PartyAI">Party AI</option>
                        <option value="GoodPlan">Good Plan</option>
                      </select>

                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        {badgeOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                    {errors.badge && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.badge.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image Upload + Tags */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Image Upload */}
                  {/* Image Upload */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Upload Photo File
                    </label>

                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="rounded-lg border border-[#DBE0E5] px-2 py-3"
                      />

                      {/* Preview thumbnails */}
                      {formData.previewUrls.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.previewUrls.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`Preview ${i + 1}`}
                              className="h-16 w-16 rounded object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Show error only when user tries to submit and no photo selected */}
                    {isSubmitted && formData.files.length === 0 && (
                      <p className="mt-1 text-sm text-red-500">
                        Photo File required
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Tag
                    </label>
                    <Controller
                      name="tag"
                      control={control}
                      rules={{ required: "Select at least one tag" }}
                      render={({ field }) => (
                        <div className="relative cursor-pointer">
                          <div
                            onClick={() => setTagOpen(!tagOpen)}
                            className="flex items-center justify-between rounded-lg border border-[#DBE0E5] bg-white p-3"
                          >
                            <span>
                              {field.value?.length
                                ? field.value.join(", ")
                                : "Select tags"}
                            </span>
                            {tagOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>

                          {tagOpen && (
                            <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-[#DBE0E5] bg-white shadow-lg">
                              {tagOptions.map((tag) => (
                                <li
                                  key={tag}
                                  className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100"
                                  onClick={() => {
                                    const newValue = field.value?.includes(tag)
                                      ? field.value.filter((v) => v !== tag)
                                      : [...(field.value || []), tag];
                                    field.onChange(newValue);
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      field.value?.includes(tag) || false
                                    }
                                    readOnly
                                    className="h-4 w-4 border-[#DBE0E5]"
                                  />
                                  <span>{tag}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {errors.tag && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.tag.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    placeholder="Description"
                    {...control.register("description", {
                      required: "Description required",
                    })}
                    className="w-full rounded-lg border border-[#DBE0E5] px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Rich Text Editor */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Conclusion
                  </label>
                  <Controller
                    name="conclusion"
                    control={control}
                    render={({ field }) => (
                      <RichTextInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.conclusion && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.conclusion.message}
                    </p>
                  )}
                </div>
              </div>
              {/* BUtton */}
              {/* <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-gray-300 px-5 py-2 hover:cursor-pointer hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-secondary-dark hover:bg-secondary-light rounded-xl px-5 py-2 text-white hover:cursor-pointer"
                >
                  {editingBlog ? "Update Blog" : "Add Blog"}
                </button>
              </div> */}
              <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-gray-300 px-5 py-2 hover:cursor-pointer hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-secondary-dark hover:bg-secondary-light rounded-xl px-5 py-2 text-white hover:cursor-pointer"
                >
                  {editingBlog
                    ? addLoading || updateLoading
                      ? "Updating..."
                      : "Update Blog"
                    : addLoading || updateLoading
                      ? "Adding..."
                      : "Add Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-bold">Delete Blog</h3>
            <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="cursor-pointer rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-700 focus:ring-2 focus:ring-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {/* View Modal */}
      {viewBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {viewBlog.title}
              </h3>
              <button
                onClick={() => setViewBlog(null)}
                className="cursor-pointer rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="max-h-[75vh] space-y-5 overflow-y-auto px-6 py-5">
              {/* Main Image */}
              {viewBlog.images && viewBlog.images.length > 0 && (
                <div className="flex justify-center">
                  <img
                    src={viewBlog.images[0]}
                    alt="Main blog"
                    className="h-64 w-full rounded-xl object-cover shadow-md"
                  />
                </div>
              )}

              {/* Description */}
              {viewBlog.description && (
                <div
                  className="prose prose-base max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: viewBlog.description }}
                />
              )}

              {/* Conclusion */}
              {viewBlog.conclusion && (
                <div
                  className="prose prose-base max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: viewBlog.conclusion }}
                />
              )}

              {/* Other Images */}
              {viewBlog.images && viewBlog.images.length > 1 && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {viewBlog.images.slice(1).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`blog-img-${idx + 1}`}
                      className="h-28 w-28 rounded-lg border border-gray-200 object-cover shadow-sm transition-transform hover:scale-105"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 text-right">
              <button
                onClick={() => setViewBlog(null)}
                className="cursor-pointer rounded-xl bg-gray-900 px-6 py-2 font-medium text-white transition hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogTable;

// import React, { useState, useEffect, type ChangeEvent } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { RichTextEditor } from "@mantine/rte";
// import { Plus, ChevronDown, ChevronUp } from "lucide-react";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { GrView } from "react-icons/gr";
// import toast from "react-hot-toast";
// import PageLoader from "@/components/Shared/PageLoader";
// import Title from "@/components/Shared/Title";
// import {
//   useGetBlogsQuery,
//   useAddBlogMutation,
//   useUpdateBlogMutation,
//   useDeleteBlogMutation,
// } from "@/redux/features/blog/blogApi";
// import type { Blog } from "@/redux/types/blog.type";

// interface RichTextInputProps {
//   value: string;
//   onChange: (value: string) => void;
// }
// const RichTextInput: React.FC<RichTextInputProps> = ({ value, onChange }) => (
//   <div className="overflow-hidden rounded-lg border border-[#DBE0E5] p-2 lg:h-[300px]">
//     <RichTextEditor
//       className="overflow-hidden overflow-y-scroll lg:h-[280px]"
//       value={value}
//       onChange={onChange}
//     />
//   </div>
// );

// function stripHtml(html: string) {
//   const tmp = document.createElement("div");
//   tmp.innerHTML = html;
//   return tmp.textContent || tmp.innerText || "";
// }
// interface BlogFormType {
//   title: string;
//   description: string;
//   conclusion: string;
//   badge: string;
//   tag: string[];
//   files: File[];
//   previewUrls: string[];
// }

// const tagOptions = [
//   "Parenting advice",
//   "Organization guide",
//   "Party tips",
//   "Checklists",
//   "Event planning",
//   "Birthday budget",
//   "Best practices",
//   "Decor inspirations",
//   "Party trends",
// ];

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
//   const [tagOpen, setTagOpen] = useState(false);
//   const [badgeOpen, setbadgeOpen] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<BlogFormType>({
//     defaultValues: {
//       title: "",
//       description: "",
//       conclusion: "",
//       badge: "",
//       tag: [],
//       files: [],
//       previewUrls: [],
//     },
//   });

//   const formData = watch();

//   // Pagination
//   const [page, setPage] = useState(1);
//   const blogsPerPage = 8;
//   const total = blogs.length;
//   const totalPages = Math.ceil(total / blogsPerPage);

//   useEffect(() => setPage(1), [total]);

//   const paginatedBlogs = blogs.slice(
//     (page - 1) * blogsPerPage,
//     page * blogsPerPage,
//   );

//   // Modal Handlers
//   const openAddModal = () => {
//     setEditingBlog(null);
//     setValue("tag", []);
//     setIsModalOpen(true);
//   };

//   const openEditModal = (blog: Blog) => {
//     setEditingBlog(blog);
//     setValue("title", blog.title);
//     setValue("description", blog.description);
//     setValue("conclusion", blog.conclusion);
//     setValue("badge", blog.badge);
//     setValue("tag", blog.tag ?? []);
//     setValue("previewUrls", blog.images ?? []);
//     setValue("files", []);
//     setIsModalOpen(true);
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     formData.previewUrls.forEach((url) => URL.revokeObjectURL(url));
//     const filesArray = Array.from(e.target.files);
//     const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
//     setValue("files", filesArray);
//     setValue("previewUrls", previewUrls);
//   };

//   const onSubmit = async (data: BlogFormType) => {
//     try {
//       const formDataToSend = new FormData();
//       const payload = {
//         title: data.title,
//         description: data.description,
//         conclusion: data.conclusion,
//         badge: data.badge,
//         tag: data.tag,
//       };
//       formDataToSend.append("data", JSON.stringify(payload));
//       data.files.forEach((file) => formDataToSend.append("files", file));

//       if (editingBlog) {
//         await updateBlog({ id: editingBlog.id, data: formDataToSend }).unwrap();
//         toast.success("Blog updated successfully");
//       } else {
//         await addBlog(formDataToSend).unwrap();
//         toast.success("Blog added successfully");
//       }

//       setIsModalOpen(false);
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
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <Title title="Blogs" />
//         <button
//           onClick={openAddModal}
//           className="bg-secondary-dark hover:bg-secondary-light flex items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:cursor-pointer focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
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
//                 <th className="px-6 py-5 text-left text-sm font-medium">
//                   Title
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium">
//                   Description
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium">
//                   Conclusion
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium">
//                   Badge
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium">
//                   Tags
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium">
//                   Image
//                 </th>
//                 <th className="px-6 py-5 text-center text-sm font-medium">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading || isFetching ? (
//                 <tr>
//                   <td colSpan={7} className="p-6 text-center">
//                     <PageLoader />
//                   </td>
//                 </tr>
//               ) : blogs.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="p-6 text-center text-sm text-gray-600"
//                   >
//                     No blogs found.
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedBlogs.map((blog) => (
//                   <tr
//                     key={blog.id}
//                     className="border-b border-gray-100 hover:bg-gray-50"
//                   >
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       {blog.title.slice(0, 30)}...
//                     </td>

//                     <td className="px-6 py-3 whitespace-nowrap">
//                       {stripHtml(blog.description).slice(0, 30)}...
//                     </td>
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       {stripHtml(blog.conclusion).slice(0, 30)}...
//                     </td>
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       {blog.badge}
//                     </td>
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       {blog.tag.join(", ").slice(0, 10)}......
//                     </td>
//                     <td className="px-6 py-3">
//                       {blog.images?.length ? (
//                         <img
//                           src={blog.images[0]}
//                           alt={blog.title}
//                           className="h-14 w-14 rounded object-cover"
//                         />
//                       ) : (
//                         <span className="text-xs text-gray-500">No image</span>
//                       )}
//                     </td>
//                     <td className="mt-3 flex justify-center gap-2 px-6 py-4">
//                       <button
//                         onClick={() => openEditModal(blog)}
//                         className="rounded-lg bg-yellow-500 p-2 text-white hover:cursor-pointer hover:bg-yellow-600"
//                       >
//                         <FaRegEdit />
//                       </button>
//                       <button
//                         onClick={() => setConfirmDelete(blog)}
//                         className="rounded-lg bg-red-600 p-2 text-white hover:cursor-pointer hover:bg-red-700"
//                       >
//                         <MdDelete />
//                       </button>
//                       <button
//                         onClick={() => setViewBlog(blog)}
//                         className="rounded-lg bg-[#0F1F4C] p-2 text-white hover:cursor-pointer hover:bg-[#041646]"
//                       >
//                         <GrView />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination */}
//       {blogs.length > 0 && (
//         <div className="mt-6 flex items-center justify-between px-4 py-3">
//           <div className="text-sm text-gray-600">
//             Showing <span className="font-medium">{paginatedBlogs.length}</span>{" "}
//             of <span className="font-medium">{total}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page <= 1}
//               className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:cursor-pointer hover:bg-gray-100 disabled:opacity-50"
//             >
//               Prev
//             </button>
//             <div className="min-w-[50px] rounded-md border bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
//               {page} / {totalPages}
//             </div>
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page >= totalPages}
//               className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:cursor-pointer hover:bg-gray-100 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Add/Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50">
//           <div className="w-full overflow-y-auto rounded-lg bg-white p-6 shadow-lg lg:max-w-6xl">
//             <div className="flex items-center justify-between">
//               <h3 className="mb-4 text-xl font-semibold">
//                 {editingBlog ? "Edit Blog" : "Add Blog"}
//               </h3>

//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="rounded-xl bg-gray-50 px-4 py-2 hover:cursor-pointer hover:bg-gray-400"
//               >
//                 X
//               </button>
//             </div>
//             <form
//               onSubmit={handleSubmit(onSubmit)}
//               className="flex flex-col gap-4"
//             >
//               <div className="flex flex-col gap-6">
//                 {/* Title + Badge on one line */}
//                 <div className="flex items-center gap-4">
//                   <div className="flex-1 space-y-1">
//                     <div>
//                       <label className="">Title</label>
//                     </div>

//                     <input
//                       type="text"
//                       placeholder="Title"
//                       {...control.register("title", {
//                         required: "Title required",
//                       })}
//                       className="w-full rounded-lg border border-[#DBE0E5] p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                     />
//                     {errors.title && (
//                       <p className="mt-1 text-sm text-red-500">
//                         {errors.title.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="flex flex-1 flex-col space-y-1">
//                     <div>
//                       <label className="">Badge</label>
//                     </div>

//                     <div
//                       className="relative w-full"
//                       onClick={() => setbadgeOpen(!badgeOpen)}
//                     >
//                       <select
//                         {...control.register("badge", {
//                           required: "Badge required",
//                         })}
//                         className="w-full cursor-pointer appearance-none rounded-lg border border-[#DBE0E5] p-3 pr-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                       >
//                         <div className="border border-[#DBE0E5]">
//                           <option value="">Select Badge</option>
//                           <option value="Inspiration">Inspiration</option>
//                           <option value="PartyTip">Party Tip</option>
//                           <option value="Parent">Parent</option>
//                           <option value="EasyOrganization">
//                             Easy Organization
//                           </option>
//                           <option value="Birthday">Easy Birthday</option>
//                           <option value="Child">Child</option>
//                           <option value="Popular">Popular</option>
//                           <option value="Featured">Featured</option>
//                           <option value="PartyAI">Party AI</option>
//                           <option value="GoodPlan">Good Plan</option>
//                         </div>
//                       </select>

//                       {/* Chevron Icon (absolute positioned) */}
//                       <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//                         {badgeOpen ? (
//                           <ChevronUp className="h-5 w-5 text-gray-500" />
//                         ) : (
//                           <ChevronDown className="h-5 w-5 text-gray-500" />
//                         )}
//                       </div>
//                     </div>
//                     {errors.badge && (
//                       <p className="mt-1 text-sm text-red-500">
//                         {errors.badge.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Image Upload on same line if needed */}
//                 <div className="flex items-start gap-4">
//                   <div className="flex flex-1 flex-col space-y-1">
//                     <label className="text-base">Upload Photo File</label>
//                     <div className="flex flex-1 flex-col gap-2">
//                       <input
//                         type="file"
//                         multiple
//                         onChange={handleFileChange}
//                         className="rounded-lg border border-[#DBE0E5] px-2 py-3"
//                       />
//                       {formData.previewUrls.length > 0 && (
//                         <div className="flex flex-wrap gap-2">
//                           {formData.previewUrls.map((url, i) => (
//                             <img
//                               key={i}
//                               src={url}
//                               className="h-16 w-16 rounded object-cover"
//                             />
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                     {formData.files.length === 0 && (
//                       <p className="mt-1 text-sm text-red-500">
//                         {" "}
//                         Photo File required
//                       </p>
//                     )}
//                   </div>

//                   {/* Tags on same line if needed */}
//                   <div className="flex-1 space-y-1">
//                     <div>
//                       <label className="">Tag</label>
//                     </div>
//                     <Controller
//                       name="tag"
//                       control={control}
//                       rules={{ required: "Select at least one tag" }}
//                       render={({ field }) => (
//                         <div className="relative cursor-pointer">
//                           <div
//                             onClick={() => setTagOpen(!tagOpen)}
//                             className="flex cursor-pointer items-center justify-between rounded-lg border border-[#DBE0E5] bg-white p-3"
//                           >
//                             <span>
//                               {field.value?.length
//                                 ? field.value.join(", ")
//                                 : "Select tags"}
//                             </span>
//                             {tagOpen ? (
//                               <ChevronUp className="h-5 w-5 text-gray-500" />
//                             ) : (
//                               <ChevronDown className="h-5 w-5 text-gray-500" />
//                             )}
//                           </div>

//                           {tagOpen && (
//                             <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-[#DBE0E5] bg-white shadow">
//                               {tagOptions.map((tag) => (
//                                 <li
//                                   key={tag}
//                                   className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100"
//                                   onClick={() => {
//                                     const newValue = field.value?.includes(tag)
//                                       ? field.value.filter((v) => v !== tag)
//                                       : [...(field.value || []), tag];
//                                     field.onChange(newValue);
//                                   }}
//                                 >
//                                   <input
//                                     type="checkbox"
//                                     checked={
//                                       field.value?.includes(tag) || false
//                                     }
//                                     readOnly
//                                     className="h-4 w-4 border-[#DBE0E5]"
//                                   />
//                                   <span>{tag}</span>
//                                 </li>
//                               ))}
//                             </ul>
//                           )}

//                           {errors.tag && (
//                             <p className="mt-1 text-sm text-red-500">
//                               tag required
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     />
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div className="space-y-1">
//                   <div>
//                     <label className="">Description</label>
//                   </div>
//                   <textarea
//                     placeholder="Description"
//                     {...control.register("description", {
//                       required: "Description required",
//                     })}
//                     className="w-full rounded-lg border border-[#DBE0E5] px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//                     rows={4}
//                   />
//                   {errors.description && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.description.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Rich Text Editor */}
//                 <div>
//                   <label className="">
//                     <h2 className="mb-1 font-semibold">Conclusion</h2>
//                   </label>
//                   <Controller
//                     name="conclusion"
//                     control={control}
//                     render={({ field }) => (
//                       <RichTextInput
//                         value={field.value}
//                         onChange={field.onChange}
//                       />
//                     )}
//                   />
//                   {errors.conclusion && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.conclusion.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="mt-2 flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="rounded-xl bg-gray-300 px-5 py-2 hover:cursor-pointer hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-secondary-dark hover:bg-secondary-light rounded-xl px-5 py-2 text-white hover:cursor-pointer"
//                 >
//                   {editingBlog ? "Update Blog" : "Add Blog"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {confirmDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
//             <h3 className="mb-4 text-lg font-bold">Delete Blog</h3>
//             <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 onClick={() => setConfirmDelete(null)}
//                 className="rounded bg-gray-300 px-5 py-2 hover:cursor-pointer hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="rounded bg-red-600 px-5 py-2 text-white hover:cursor-pointer hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Modal */}
//       {viewBlog && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg">
//             {/* Header */}
//             <div className="flex items-center justify-between border-b border-[#DBE0E5] px-6 py-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 {viewBlog.title}
//               </h3>
//               <button
//                 onClick={() => setViewBlog(null)}
//                 className="cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Scrollable Body */}
//             <div className="max-h-[75vh] overflow-y-auto px-6 py-4">
//               {/* Main Image */}
//               {viewBlog.images && viewBlog.images.length > 0 && (
//                 <div className="mb-4 flex justify-center">
//                   <img
//                     src={viewBlog.images[0]}
//                     alt="Main blog"
//                     className="h-64 w-full rounded-lg object-cover shadow-md"
//                   />
//                 </div>
//               )}

//               {/* Description */}
//               {viewBlog.description && (
//                 <div
//                   className="prose prose-sm max-w-none text-gray-700"
//                   dangerouslySetInnerHTML={{ __html: viewBlog.description }}
//                 />
//               )}

//               {/* Conclusion */}
//               {viewBlog.conclusion && (
//                 <div
//                   className="prose prose-sm mt-4 max-w-none text-gray-700"
//                   dangerouslySetInnerHTML={{ __html: viewBlog.conclusion }}
//                 />
//               )}

//               {/* Other Images */}
//               {viewBlog.images && viewBlog.images.length > 1 && (
//                 <div className="mt-5 flex flex-wrap justify-center gap-3">
//                   {viewBlog.images.slice(1).map((img, idx) => (
//                     <img
//                       key={idx}
//                       src={img}
//                       alt={`blog-img-${idx + 1}`}
//                       className="h-24 w-24 rounded-lg border object-cover shadow-sm transition-transform hover:scale-105"
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="border-t border-[#DBE0E5] px-6 py-4 text-right">
//               <button
//                 onClick={() => setViewBlog(null)}
//                 className="bg-secondary-dark hover:bg-secondary-light cursor-pointer rounded-xl px-5 py-2 text-white"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminBlogTable;
