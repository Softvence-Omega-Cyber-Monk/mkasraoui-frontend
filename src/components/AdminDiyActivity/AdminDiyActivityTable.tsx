import { useEffect, useState, type ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { RichTextEditor } from "@mantine/rte";
import { FileText, Plus, Search } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";
import toast from "react-hot-toast";
import Title from "@/components/Shared/Title";
import PageLoader from "../Shared/PageLoader";

import type { Activity as ReduxActivity } from "../../redux/types/activity.type";
import {
  useGetActivitiesQuery,
  useAddActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
} from "../../redux/features/AdminDiyActivity/activityApi";

interface ActivityFormType {
  title: string;
  description: string;
  instruction_sheet: string;
  video: File | null;
  videoPreview: string | null;
  pdfFile: File | null;
  pdfPreview: string | null;
}

interface Activity extends ReduxActivity {
  video?: string;
  instruction_sheet?: string;
  description?: string;
  images?: string[];
  pdfFile?: string;
}

// Utility to strip HTML tags
const stripHtml = (html?: string) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

// RichTextInput component
const RichTextInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => (
  <div className="h-[250px] overflow-hidden rounded-lg border border-gray-300 p-2">
    <RichTextEditor
      value={value}
      onChange={onChange}
      className="h-[230px] overflow-y-auto"
    />
  </div>
);

const AdminActivityTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [viewActivity, setViewActivity] = useState<Activity | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Activity | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<ActivityFormType>({
    defaultValues: {
      title: "",
      description: "",
      instruction_sheet: "",
      video: null,
      videoPreview: null,
      pdfFile: null,
      pdfPreview: null,
    },
  });

  const formData = watch();

  // Fetch activities
  const { data, isLoading, isFetching, isError, refetch } =
    useGetActivitiesQuery();
  const [addActivity] = useAddActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();
  const [deleteActivity] = useDeleteActivityMutation();

  // Map API data to Activity[]
  const activities: Activity[] =
    data?.data?.map((a: any) => ({
      ...a,
      description: a.description ?? "",
      instruction_sheet: a.instruction_sheet ?? "",
      video: a.video ?? "",
      pdfFile: a.pdfFile ?? "",
      images: a.images ?? [],
    })) || [];

  // Filtered activities
  const filteredActivities = activities.filter((a) => {
    return (
      stripHtml(a.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtml(a.description)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      stripHtml(a.instruction_sheet)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const [page, setPage] = useState(1);
  const activitiesPerPage = 8;
  const total = filteredActivities.length;
  const totalPages = Math.ceil(total / activitiesPerPage);

  useEffect(() => setPage(1), [total]);

  const paginatedActivities = filteredActivities.slice(
    (page - 1) * activitiesPerPage,
    page * activitiesPerPage,
  );

  // Add / Edit modal handlers
  const openAddModal = () => {
    setEditingActivity(null);
    setValue("title", "");
    setValue("description", "");
    setValue("instruction_sheet", "");
    setValue("video", null);
    setValue("videoPreview", null);
    setValue("pdfFile", null);
    setValue("pdfPreview", null);
    setIsModalOpen(true);
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setValue("title", activity.title ?? "");
    setValue("description", activity.description ?? "");
    setValue("instruction_sheet", activity.instruction_sheet ?? "");
    setValue("video", null);
    setValue("videoPreview", activity.video ?? null);
    setValue("pdfFile", null);
    setValue("pdfPreview", activity.pdfFile ?? null);
    setIsModalOpen(true);
  };

  // File handlers
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);
    setValue("video", file);
    setValue("videoPreview", previewUrl);
  };

  const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setValue("pdfFile", file);
    setValue("pdfPreview", file.name);
  };

  // Submit add/edit
  const onSubmit = async (data: ActivityFormType) => {
    if (!data.video && !editingActivity) {
      return toast.error("Please upload a video");
    }

    const payload = new FormData();
    payload.append("title", data.title);
    payload.append("description", data.description);
    payload.append("instruction_sheet", data.instruction_sheet);
    if (data.video) payload.append("video", data.video);
    if (data.pdfFile) payload.append("pdfFile", data.pdfFile);

    try {
      if (editingActivity) {
        await updateActivity({
          id: editingActivity.id,
          data: payload,
        }).unwrap();
        toast.success("Activity updated successfully");
      } else {
        await addActivity(payload).unwrap();
        toast.success("Activity added successfully");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  // Delete activity
  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteActivity(confirmDelete.id).unwrap();
      toast.success("Activity deleted successfully");
      setConfirmDelete(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Title title="DIY Activities" />
        <button
          onClick={openAddModal}
          className="bg-secondary-dark hover:bg-secondary-light flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
        >
          <Plus className="h-5 w-5" /> Add Activity
        </button>
      </div>

      {/* Filter Section */}
      <div className="mb-8">
        <div className="relative w-full flex-1 md:w-[400px]">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, description, or instructions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-10 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="border-b border-gray-300 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-normal">Title</th>
                <th className="px-6 py-3 text-left font-normal">Description</th>
                <th className="px-6 py-3 text-left font-normal">
                  Instruction Sheet
                </th>
                <th className="px-6 py-3 text-left font-normal">Video</th>
                <th className="px-6 py-3 text-left font-normal">PDF File</th>
                <th className="px-6 py-3 text-center font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    <PageLoader />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-red-500">
                    Error fetching activities
                  </td>
                </tr>
              ) : paginatedActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No activities found.
                  </td>
                </tr>
              ) : (
                paginatedActivities.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {stripHtml(a.title).slice(0, 20)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {stripHtml(a.description).slice(0, 20)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {stripHtml(a.instruction_sheet).slice(0, 20)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {a.video ? (
                        <div className="h-12 w-20 overflow-hidden rounded-md border border-gray-300 bg-gray-100">
                          <video
                            src={a.video + "#t=0.5"}
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No video</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {a.pdfFile ? (
                        <a
                          href={a.pdfFile}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          View PDF
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">No PDF</span>
                      )}
                    </td>
                    <td className="flex justify-center gap-2 px-6 py-4">
                      <button
                        onClick={() => openEditModal(a)}
                        className="cursor-pointer rounded-lg bg-yellow-500 p-2 text-white"
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(a)}
                        className="cursor-pointer rounded-lg bg-red-600 p-2 text-white"
                      >
                        <MdDelete />
                      </button>
                      <button
                        onClick={() => setViewActivity(a)}
                        className="cursor-pointer rounded-lg bg-[#0F1F4C] p-2 text-white"
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
      {filteredActivities.length > 0 && (
        <div className="mt-6 flex items-center justify-between px-4 py-3">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">{paginatedActivities.length}</span> of{" "}
            <span className="font-medium">{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <div className="min-w-[50px] cursor-pointer rounded-md border bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
              {page} / {totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit/View/Delete modals remain same as your current implementation */}

      {/* ✅ Modals for Add/Edit/View/Delete remain unchanged */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {editingActivity ? "Edit Activity" : "Add Activity"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer rounded-xl bg-gray-200 p-3"
              >
                X
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <label>Title</label>
              <input
                {...register("title", { required: true })}
                placeholder="Title"
                className="rounded border border-gray-300 p-2"
              />
              {errors.title && (
                <p className="text-sm text-red-500">Title required</p>
              )}

              <label>Description</label>
              <textarea
                {...register("description", { required: true })}
                placeholder="Description"
                className="rounded border border-gray-300 p-2"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">Description required</p>
              )}

              {/* PDF Upload */}
              <div>
                <label
                  htmlFor="pdf-upload"
                  className="mb-2 block text-base font-medium text-gray-700"
                >
                  Upload PDF
                </label>
                <div className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-2 transition hover:border-blue-400">
                  <input
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="flex cursor-pointer flex-col items-center justify-center text-center"
                  >
                    Upload PDF
                    {/* <FaFilePdf className="text-4xl text-gray-700" /> */}
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop PDF
                    </p>
                    {/* <p className="text-xs text-gray-400">PDF only (max 10MB)</p> */}
                  </label>
                </div>
                {formData.pdfPreview && (
                  <div className="mt-3 text-sm text-gray-700">
                    📄 {formData.pdfPreview}
                  </div>
                )}

                {!formData.pdfPreview && (
                  <p className="mt-1 text-sm text-red-500">
                    PDF file is required
                  </p>
                )}
              </div>

              <label>Rich Text</label>
              <Controller
                name="instruction_sheet"
                control={control}
                render={({ field }) => (
                  <RichTextInput
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                )}
              />

              {/* Video Upload */}
              <div>
                <label
                  htmlFor="video-upload"
                  className="mb-2 block text-base font-medium text-gray-700"
                >
                  Upload Video
                </label>
                <div className="flex h-25 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 transition hover:border-blue-400">
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex cursor-pointer flex-col items-center justify-center text-center"
                  >
                    <svg
                      className="mb-2 h-10 w-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16V4m0 0L3 8m4-4l4 4M17 8h4m0 0v8m0-8l-4 4m4-4l-4 4M7 20h10"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      Click to upload video
                    </p>
                    {/* <p className="text-xs text-gray-400">MP4, MOV, or AVI (max 100MB)</p> */}
                  </label>
                </div>

                {formData.videoPreview && (
                  <div className="mt-4">
                    <video
                      src={formData.videoPreview}
                      controls
                      className="max-h-60 w-60 rounded-xl border border-gray-300 shadow-sm"
                    />
                  </div>
                )}

                {!formData.videoPreview && (
                  <p className="mt-1 text-sm text-red-500">
                    video file is required
                  </p>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-xl bg-gray-300 px-5 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-secondary-dark hover:bg-secondary-light cursor-pointer rounded-xl px-5 py-2 text-white"
                >
                  {editingActivity ? "Update" : "Add Activity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-sm rounded-lg bg-white p-6">
            <h3 className="mb-2 text-lg font-bold">Delete Activity</h3>
            <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="w-full cursor-pointer rounded-xl bg-gray-400 px-4 py-3 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full cursor-pointer rounded-xl bg-red-600 px-4 py-3 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ View Modal */}
      {viewActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[80vh] max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
            <h3 className="mb-4 text-xl font-semibold text-[#0F1F4C]">
              {stripHtml(viewActivity.title)}
            </h3>
            <p className="mb-3 text-gray-700">
              <strong>Description:</strong>{" "}
              {stripHtml(viewActivity.description)}
            </p>

            {viewActivity.instruction_sheet && (
              <div className="mb-6 rounded-lg">
                <h3 className="mb-2 text-lg font-semibold">🪄 Instructions</h3>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: viewActivity.instruction_sheet,
                  }}
                />
              </div>
            )}

            {viewActivity.video && (
              <div className="mb-4 w-full max-w-xs">
                <video
                  src={viewActivity.video}
                  controls
                  className="w-full rounded-lg border"
                />
              </div>
            )}

            {viewActivity.pdfFile && (
              <div className="mb-4">
                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                  <FileText size={18} /> Instruction PDF
                </h3>
                <a
                  href={viewActivity.pdfFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  View or download the PDF
                </a>
              </div>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={() => setViewActivity(null)}
                className="bg-secondary-dark hover:bg-secondary-light cursor-pointer rounded-xl px-5 py-2 text-white"
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

export default AdminActivityTable;

// import { useEffect, useState, type ChangeEvent } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { RichTextEditor } from "@mantine/rte";
// import { FileText, Plus } from "lucide-react";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { GrView } from "react-icons/gr";
// import toast from "react-hot-toast";
// import Title from "@/components/Shared/Title";
// import PageLoader from "../Shared/PageLoader";

// import type { Activity as ReduxActivity } from "../../redux/types/activity.type";
// import {
//   useGetActivitiesQuery,
//   useAddActivityMutation,
//   useUpdateActivityMutation,
//   useDeleteActivityMutation,
// } from "../../redux/features/AdminDiyActivity/activityApi";

// interface ActivityFormType {
//   title: string;
//   description: string;
//   instruction_sheet: string;
//   video: File | null;
//   videoPreview: string | null;
//   pdfFile: File | null;
//   pdfPreview: string | null;
// }

// interface Activity extends ReduxActivity {
//   video?: string;
//   instruction_sheet?: string;
//   description?: string;
//   images?: string[];
//   pdfFile?: string;
// }

// const stripHtml = (html?: string) => {
//   if (!html) return "";
//   const div = document.createElement("div");
//   div.innerHTML = html;
//   return div.textContent || div.innerText || "";
// };

// const RichTextInput: React.FC<{
//   value: string;
//   onChange: (v: string) => void;
// }> = ({ value, onChange }) => (
//   <div className="h-[250px] overflow-hidden rounded-lg border border-gray-300 p-2">
//     <RichTextEditor
//       value={value}
//       onChange={onChange}
//       className="h-[230px] overflow-y-auto"
//     />
//   </div>
// );

// const AdminActivityTable: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
//   const [viewActivity, setViewActivity] = useState<Activity | null>(null);
//   const [confirmDelete, setConfirmDelete] = useState<Activity | null>(null);

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     watch,
//     register,
//     formState: { errors },
//   } = useForm<ActivityFormType>({
//     defaultValues: {
//       title: "",
//       description: "",
//       instruction_sheet: "",
//       video: null,
//       videoPreview: null,
//       pdfFile: null,
//       pdfPreview: null,
//     },
//   });

//   const formData = watch();

//   const { data, isLoading, isFetching, isError, refetch } =
//     useGetActivitiesQuery();
//   const [addActivity] = useAddActivityMutation();
//   const [updateActivity] = useUpdateActivityMutation();
//   const [deleteActivity] = useDeleteActivityMutation();

//   const activities: Activity[] =
//     data?.data?.map((a: any) => ({
//       ...a,
//       description: a.description ?? "",
//       instruction_sheet: a.instruction_sheet ?? "",
//       video: a.video ?? "",
//       pdfFile: a.pdfFile ?? "",
//       images: a.images ?? [],
//     })) || [];

//   // ✅ Pagination setup
//   const [page, setPage] = useState(1);
//   const activitiesPerPage = 8;
//   const total = activities.length;
//   const totalPages = Math.ceil(total / activitiesPerPage);

//   useEffect(() => setPage(1), [total]);

//   const paginatedactivities = activities.slice(
//     (page - 1) * activitiesPerPage,
//     page * activitiesPerPage,
//   );

//   // ✅ Add Modal
//   const openAddModal = () => {
//     setEditingActivity(null);
//     setValue("title", "");
//     setValue("description", "");
//     setValue("instruction_sheet", "");
//     setValue("video", null);
//     setValue("videoPreview", null);
//     setValue("pdfFile", null);
//     setValue("pdfPreview", null);
//     setIsModalOpen(true);
//   };

//   // ✅ Edit Modal
//   const openEditModal = (activity: Activity) => {
//     setEditingActivity(activity);
//     setValue("title", activity.title ?? "");
//     setValue("description", activity.description ?? "");
//     setValue("instruction_sheet", activity.instruction_sheet ?? "");
//     setValue("video", null);
//     setValue("videoPreview", activity.video ?? null);
//     setValue("pdfFile", null);
//     setValue("pdfPreview", activity.pdfFile ?? null);
//     setIsModalOpen(true);
//   };

//   // ✅ File Handlers
//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files?.length) return;
//     const file = e.target.files[0];
//     const previewUrl = URL.createObjectURL(file);
//     setValue("video", file);
//     setValue("videoPreview", previewUrl);
//   };

//   const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files?.length) return;
//     const file = e.target.files[0];
//     setValue("pdfFile", file);
//     setValue("pdfPreview", file.name);
//   };

//   // ✅ Submit (Add / Edit)
//   const onSubmit = async (data: ActivityFormType) => {
//     if (!data.video && !editingActivity) {
//       return toast.error("Please upload a video");
//     }

//     const payload = new FormData();
//     payload.append("title", data.title);
//     payload.append("description", data.description);
//     payload.append("instruction_sheet", data.instruction_sheet);
//     if (data.video) payload.append("video", data.video);
//     if (data.pdfFile) payload.append("pdfFile", data.pdfFile);

//     try {
//       if (editingActivity) {
//         await updateActivity({
//           id: editingActivity.id,
//           data: payload,
//         }).unwrap();
//         toast.success("Activity updated successfully");
//       } else {
//         await addActivity(payload).unwrap();
//         toast.success("Activity added successfully");
//       }
//       setIsModalOpen(false);
//       refetch();
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Something went wrong");
//     }
//   };

//   // ✅ Delete
//   const handleDelete = async () => {
//     if (!confirmDelete) return;
//     try {
//       await deleteActivity(confirmDelete.id).unwrap();
//       toast.success("Activity deleted successfully");
//       setConfirmDelete(null);
//       refetch();
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Delete failed");
//     }
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <Title title="DIY Activities" />
//         <button
//           onClick={openAddModal}
//           className="bg-secondary-dark hover:bg-secondary-light flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
//         >
//           <Plus className="h-5 w-5" /> Add Activity
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
//         <div className="w-full overflow-x-auto">
//           <table className="w-full min-w-[1000px]">
//             <thead className="border-b border-gray-300 bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left font-normal">Title</th>
//                 <th className="px-6 py-3 text-left font-normal">Description</th>
//                 <th className="px-6 py-3 text-left font-normal">
//                   Instruction Sheet
//                 </th>
//                 <th className="px-6 py-3 text-left font-normal">Video</th>
//                 <th className="px-6 py-3 text-left font-normal">PDF File</th>
//                 <th className="px-6 py-3 text-center font-normal">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading || isFetching ? (
//                 <tr>
//                   <td colSpan={6} className="p-6 text-center">
//                     <PageLoader />
//                   </td>
//                 </tr>
//               ) : isError ? (
//                 <tr>
//                   <td colSpan={6} className="p-6 text-center text-red-500">
//                     Error fetching activities
//                   </td>
//                 </tr>
//               ) : paginatedactivities.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="p-6 text-center text-gray-500">
//                     No activities found.
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedactivities.map((a) => (
//                   <tr
//                     key={a.id}
//                     className="border-b border-gray-300 hover:bg-gray-50"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {stripHtml(a.title).slice(0, 20)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {stripHtml(a.description).slice(0, 20)}...
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {stripHtml(a.instruction_sheet).slice(0, 20)}...
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {a.video ? (
//                         <div className="h-12 w-20 overflow-hidden rounded-md border border-gray-300 bg-gray-100">
//                           <video
//                             src={a.video + "#t=0.5"}
//                             muted
//                             playsInline
//                             preload="metadata"
//                             className="h-full w-full object-cover"
//                           />
//                         </div>
//                       ) : (
//                         <span className="text-sm text-gray-500">No video</span>
//                       )}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {a.pdfFile ? (
//                         <a
//                           href={a.pdfFile}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-blue-600 underline hover:text-blue-800"
//                         >
//                           View PDF
//                         </a>
//                       ) : (
//                         <span className="text-sm text-gray-500">No PDF</span>
//                       )}
//                     </td>

//                     <td className="flex justify-center gap-2 px-6 py-4">
//                       <button
//                         onClick={() => openEditModal(a)}
//                         className="cursor-pointer rounded-lg bg-yellow-500 p-2 text-white"
//                       >
//                         <FaRegEdit />
//                       </button>
//                       <button
//                         onClick={() => setConfirmDelete(a)}
//                         className="cursor-pointer rounded-lg bg-red-600 p-2 text-white"
//                       >
//                         <MdDelete />
//                       </button>
//                       <button
//                         onClick={() => setViewActivity(a)}
//                         className="cursor-pointer rounded-lg bg-[#0F1F4C] p-2 text-white"
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

//       {/* ✅ Pagination Controls */}
//       {activities.length > 0 && (
//         <div className="mt-6 flex items-center justify-between px-4 py-3">
//           <div className="text-sm text-gray-600">
//             Showing{" "}
//             <span className="font-medium">{paginatedactivities.length}</span> of{" "}
//             <span className="font-medium">{total}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page <= 1}
//               className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//             >
//               Prev
//             </button>
//             <div className="min-w-[50px] cursor-pointer rounded-md border bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
//               {page} / {totalPages}
//             </div>
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page >= totalPages}
//               className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ✅ Modals for Add/Edit/View/Delete remain unchanged */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50">
//           <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
//             <div className="mb-4 flex items-center justify-between">
//               <h3 className="text-xl font-semibold">
//                 {editingActivity ? "Edit Activity" : "Add Activity"}
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="cursor-pointer rounded-xl bg-gray-200 p-3"
//               >
//                 X
//               </button>
//             </div>

//             {/* Form */}
//             <form
//               onSubmit={handleSubmit(onSubmit)}
//               className="flex flex-col gap-4"
//             >
//               <label>Title</label>
//               <input
//                 {...register("title", { required: true })}
//                 placeholder="Title"
//                 className="rounded border border-gray-300 p-2"
//               />
//               {errors.title && (
//                 <p className="text-sm text-red-500">Title required</p>
//               )}

//               <label>Description</label>
//               <textarea
//                 {...register("description", { required: true })}
//                 placeholder="Description"
//                 className="rounded border border-gray-300 p-2"
//                 rows={3}
//               />
//               {errors.description && (
//                 <p className="text-sm text-red-500">Description required</p>
//               )}

//               {/* PDF Upload */}
//               <div>
//                 <label
//                   htmlFor="pdf-upload"
//                   className="mb-2 block text-base font-medium text-gray-700"
//                 >
//                   Upload PDF
//                 </label>
//                 <div className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-2 transition hover:border-blue-400">
//                   <input
//                     id="pdf-upload"
//                     type="file"
//                     accept="application/pdf"
//                     onChange={handlePdfChange}
//                     className="hidden"
//                   />
//                   <label
//                     htmlFor="pdf-upload"
//                     className="flex cursor-pointer flex-col items-center justify-center text-center"
//                   >
//                     Upload PDF
//                     {/* <FaFilePdf className="text-4xl text-gray-700" /> */}
//                     <p className="text-sm text-gray-600">
//                       Click to upload or drag and drop PDF
//                     </p>
//                     {/* <p className="text-xs text-gray-400">PDF only (max 10MB)</p> */}
//                   </label>
//                 </div>
//                 {formData.pdfPreview && (
//                   <div className="mt-3 text-sm text-gray-700">
//                     📄 {formData.pdfPreview}
//                   </div>
//                 )}

//                 {!formData.pdfPreview && (
//                   <p className="mt-1 text-sm text-red-500">
//                     PDF file is required
//                   </p>
//                 )}
//               </div>

//               <label>Rich Text</label>
//               <Controller
//                 name="instruction_sheet"
//                 control={control}
//                 render={({ field }) => (
//                   <RichTextInput
//                     value={field.value ?? ""}
//                     onChange={field.onChange}
//                   />
//                 )}
//               />

//               {/* Video Upload */}
//               <div>
//                 <label
//                   htmlFor="video-upload"
//                   className="mb-2 block text-base font-medium text-gray-700"
//                 >
//                   Upload Video
//                 </label>
//                 <div className="flex h-25 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 transition hover:border-blue-400">
//                   <input
//                     id="video-upload"
//                     type="file"
//                     accept="video/*"
//                     onChange={handleFileChange}
//                     className="hidden"
//                   />
//                   <label
//                     htmlFor="video-upload"
//                     className="flex cursor-pointer flex-col items-center justify-center text-center"
//                   >
//                     <svg
//                       className="mb-2 h-10 w-10 text-gray-400"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M7 16V4m0 0L3 8m4-4l4 4M17 8h4m0 0v8m0-8l-4 4m4-4l-4 4M7 20h10"
//                       />
//                     </svg>
//                     <p className="text-sm text-gray-600">
//                       Click to upload video
//                     </p>
//                     {/* <p className="text-xs text-gray-400">MP4, MOV, or AVI (max 100MB)</p> */}
//                   </label>
//                 </div>

//                 {formData.videoPreview && (
//                   <div className="mt-4">
//                     <video
//                       src={formData.videoPreview}
//                       controls
//                       className="max-h-60 w-60 rounded-xl border border-gray-300 shadow-sm"
//                     />
//                   </div>
//                 )}

//                 {!formData.videoPreview && (
//                   <p className="mt-1 text-sm text-red-500">
//                     video file is required
//                   </p>
//                 )}
//               </div>

//               {/* <label>Instruction (Rich Text)</label>
//               <Controller
//                 name="instruction_sheet"
//                 control={control}
//                 render={({ field }) => (
//                   <RichTextInput
//                     value={field.value ?? ""}
//                     onChange={field.onChange}
//                   />
//                 )}
//               />

//               <div>
//                 <label className="block text-base font-medium text-gray-700">
//                   Upload PDF
//                 </label>
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={handlePdfChange}
//                   className="block w-full rounded border border-gray-300 p-2"
//                 />
//                 {formData.pdfPreview && (
//                   <div className="mt-2 text-sm text-gray-700">
//                     📄 {formData.pdfPreview}
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-base font-medium text-gray-700">
//                   Upload Video
//                 </label>
//                 <input
//                   type="file"
//                   accept="video/*"
//                   onChange={handleFileChange}
//                   className="block w-full rounded border border-gray-300 p-2"
//                 />
//                 {formData.videoPreview && (
//                   <div className="mt-4">
//                     <video
//                       src={formData.videoPreview}
//                       controls
//                       className="max-h-60 w-60 rounded-xl border"
//                     />
//                   </div>
//                 )}
//               </div> */}

//               <div className="mt-4 flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="cursor-pointer rounded-xl bg-gray-300 px-5 py-2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-secondary-dark hover:bg-secondary-light cursor-pointer rounded-xl px-5 py-2 text-white"
//                 >
//                   {editingActivity ? "Update" : "Add Activity"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ✅ Delete Confirm */}
//       {confirmDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="max-w-sm rounded-lg bg-white p-6">
//             <h3 className="mb-2 text-lg font-bold">Delete Activity</h3>
//             <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
//             <div className="mt-4 flex justify-end gap-2">
//               <button
//                 onClick={() => setConfirmDelete(null)}
//                 className="w-full cursor-pointer rounded-xl bg-gray-400 px-4 py-3 text-white"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="w-full cursor-pointer rounded-xl bg-red-600 px-4 py-3 text-white"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ View Modal */}
//       {viewActivity && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="max-h-[80vh] max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
//             <h3 className="mb-4 text-xl font-semibold text-[#0F1F4C]">
//               {stripHtml(viewActivity.title)}
//             </h3>
//             <p className="mb-3 text-gray-700">
//               <strong>Description:</strong>{" "}
//               {stripHtml(viewActivity.description)}
//             </p>

//             {viewActivity.instruction_sheet && (
//               <div className="mb-6 rounded-lg">
//                 <h3 className="mb-2 text-lg font-semibold">🪄 Instructions</h3>
//                 <div
//                   className="prose"
//                   dangerouslySetInnerHTML={{
//                     __html: viewActivity.instruction_sheet,
//                   }}
//                 />
//               </div>
//             )}

//             {viewActivity.video && (
//               <div className="mb-4 w-full max-w-xs">
//                 <video
//                   src={viewActivity.video}
//                   controls
//                   className="w-full rounded-lg border"
//                 />
//               </div>
//             )}

//             {viewActivity.pdfFile && (
//               <div className="mb-4">
//                 <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
//                   <FileText size={18} /> Instruction PDF
//                 </h3>
//                 <a
//                   href={viewActivity.pdfFile}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-indigo-600 hover:underline"
//                 >
//                   View or download the PDF
//                 </a>
//               </div>
//             )}

//             <div className="mt-6 text-right">
//               <button
//                 onClick={() => setViewActivity(null)}
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

// export default AdminActivityTable;
