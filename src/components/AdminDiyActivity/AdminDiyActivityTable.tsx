import { useState } from "react";
import type { ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { RichTextEditor } from "@mantine/rte";
import { Plus } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";
import toast from "react-hot-toast";
import Title from "@/components/Shared/Title";
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
}

// ✅ Extend ReduxActivity to include optional client-side fields
interface Activity extends ReduxActivity {
  video?: string;
  instruction_sheet?: string;
  description?: string;
  images?: string[]; // ✅ Added to fix the TS error
}

const stripHtml = (html?: string) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const RichTextInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({
  value,
  onChange,
}) => (
  <div className="overflow-hidden rounded-lg border border-gray-300 p-2 h-[250px]">
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
    },
  });

  const formData = watch();

  const { data, isLoading, isError, refetch } = useGetActivitiesQuery();
  const [addActivity] = useAddActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();
  const [deleteActivity] = useDeleteActivityMutation();

  const activities: Activity[] =
    data?.data.map((a: any) => ({
      ...a,
      description: a.description ?? "",
      instruction_sheet: a.instruction_sheet ?? "",
      video: a.video ?? "",
      images: a.images ?? [], // ✅ Ensure images always exist as an array
    })) || [];

  // ----- Modal handlers -----
  const openAddModal = () => {
    setEditingActivity(null);
    setValue("title", "");
    setValue("description", "");
    setValue("instruction_sheet", "");
    setValue("video", null);
    setValue("videoPreview", null);
    setIsModalOpen(true);
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setValue("title", activity.title ?? "");
    setValue("description", activity.description ?? "");
    setValue("instruction_sheet", activity.instruction_sheet ?? "");
    setValue("video", null);
    setValue("videoPreview", activity.video ?? null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);
    setValue("video", file);
    setValue("videoPreview", previewUrl);
  };

  const onSubmit = async (data: ActivityFormType) => {
    if (!data.video && !editingActivity) {
      return toast.error("Please upload a video");
    }

    const payload = new FormData();
    payload.append("title", data.title);
    payload.append("description", data.description);
    payload.append("instruction_sheet", data.instruction_sheet);
    if (data.video) payload.append("video", data.video);

    try {
      if (editingActivity) {
        await updateActivity({ id: editingActivity.id, data: payload }).unwrap();
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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Title title="DIY Activities" />
        <button
          onClick={openAddModal}
          className="mt-auto flex items-center hover:cursor-pointer justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
        >
          <Plus className="w-5 h-5" /> Add Activity
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Instruction Sheet</th>
              <th className="px-6 py-3 text-left">Video</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="text-center p-6">
                  Error fetching activities
                </td>
              </tr>
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No activities found.
                </td>
              </tr>
            ) : (
              activities.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-gray-300 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{a.title}</td>
                  <td className="px-6 py-4">
                    {stripHtml(a.description).slice(0, 50)}...
                  </td>
                  <td className="px-6 py-4">
                    {stripHtml(a.instruction_sheet).slice(0, 50)}...
                  </td>
                  <td className="px-6 py-4">
                    {a.video ? (
                      <a
                        href={a.video}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600"
                      >
                        View Video
                      </a>
                    ) : (
                      "No video"
                    )}
                  </td>
                  <td className="flex justify-center gap-2 px-6 py-4">
                    <button
                      onClick={() => openEditModal(a)}
                      className="p-2 hover:cursor-pointer bg-yellow-500 text-white rounded"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(a)}
                      className="p-2 hover:cursor-pointer bg-red-600 text-white rounded"
                    >
                      <MdDelete />
                    </button>
                    <button
                      onClick={() => setViewActivity(a)}
                      className="p-2 hover:cursor-pointer bg-green-500 text-white rounded"
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingActivity ? "Edit Activity" : "Add Activity"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:cursor-pointer bg-gray-200 rounded"
              >
                X
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <input
                {...register("title", { required: true })}
                placeholder="Title"
                className="border border-gray-300 p-2 rounded"
              />
              {errors.title && (
                <span className="text-red-500">Title required</span>
              )}

              <textarea
                {...register("description", { required: true })}
                placeholder="Description"
                className="border border-gray-300 p-2 rounded"
                rows={3}
              />
              {errors.description && (
                <span className="text-red-500">Description required</span>
              )}

              <Controller
                name="instruction_sheet"
                control={control}
                render={({ field }) => (
                  <RichTextInput value={field.value ?? ""} onChange={field.onChange} />
                )}
              />

              <input type="file" accept="video/*" onChange={handleFileChange} />
              {formData.videoPreview && (
                <video
                  src={formData.videoPreview}
                  controls
                  className="mt-2 w-full max-h-60 rounded"
                />
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-auto flex items-center hover:cursor-pointer justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mt-auto flex items-center hover:cursor-pointer justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
                >
                  {editingActivity ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg max-w-sm">
            <h3 className="text-lg font-bold mb-2">Delete Activity</h3>
            <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex w-full items-center hover:cursor-pointer justify-center gap-2 rounded-md bg-gray-400 px-4 py-3 text-sm text-white font-medium hover:bg-gray-500 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex w-full items-center hover:cursor-pointer justify-center gap-2 rounded-md bg-red-600 px-4 py-3 text-sm text-white font-medium hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ View Modal (UI aligned with main modal) */}
      {viewActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Title */}
            <h2 className="text-2xl p-6 font-bold text-gray-800 tracking-wide">
              {viewActivity.title}
            </h2>

            {/* Close Button */}
            <button
              onClick={() => setViewActivity(null)}
              className="absolute top-4 right-4 hover:cursor-pointer text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition"
            >
              ✕
            </button>

            {/* Media Section */}
            <div className="relative w-full mt-4 p-3 h-72 md:h-80 rounded-t-2xl overflow-hidden">
              {viewActivity.video ? (
                <video
                  src={viewActivity.video}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={viewActivity.images?.[0] || "/placeholder.png"}
                  alt={viewActivity.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {viewActivity.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    About this Activity
                  </h3>
                  <div
                    className="text-gray-700 prose"
                    dangerouslySetInnerHTML={{
                      __html: viewActivity.description,
                    }}
                  />
                </div>
              )}

              {viewActivity.instruction_sheet && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    🪄 Step-by-Step Instructions
                  </h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: viewActivity.instruction_sheet,
                    }}
                    className="prose mt-4"
                  />
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setViewActivity(null)}
                  className="flex items-center justify-center gap-2 hover:cursor-pointer rounded-lg bg-[#223B7D] px-5 py-2.5 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivityTable;
















// // With this:
// import { useState } from "react";
// import type { ChangeEvent } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { RichTextEditor } from "@mantine/rte";
// import { Plus } from "lucide-react";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { GrView } from "react-icons/gr";
// import toast from "react-hot-toast";
// import Title from "@/components/Shared/Title";
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
// }

// // Extend ReduxActivity locally to include optional fields
// interface Activity extends ReduxActivity {
//   video?: string;
//   instruction_sheet?: string;
//   description?: string;
// }

// const stripHtml = (html?: string) => {
//   if (!html) return "";
//   const div = document.createElement("div");
//   div.innerHTML = html;
//   return div.textContent || div.innerText || "";
// };

// const RichTextInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
//   <div className="overflow-hidden rounded-lg border border-gray-300 p-2 h-[250px]">
//     <RichTextEditor value={value} onChange={onChange} className="h-[230px] overflow-y-auto" />
//   </div>
// );

// const AdminActivityTable: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
//   const [viewActivity, setViewActivity] = useState<Activity | null>(null);
//   const [confirmDelete, setConfirmDelete] = useState<Activity | null>(null);

//   const { control, handleSubmit, setValue, watch, register, formState: { errors } } = useForm<ActivityFormType>({
//     defaultValues: {
//       title: "",
//       description: "",
//       instruction_sheet: "",
//       video: null,
//       videoPreview: null,
//      },
//   });

//   const formData = watch();

//   const { data, isLoading, isError, refetch } = useGetActivitiesQuery();
//   const [addActivity] = useAddActivityMutation();
//   const [updateActivity] = useUpdateActivityMutation();
//   const [deleteActivity] = useDeleteActivityMutation();

//   const activities: Activity[] = data?.data.map((a: any) => ({
//     ...a,
//     description: a.description ?? "",
//     instruction_sheet: a.instruction_sheet ?? "",
//     video: a.video ?? "",
//   })) || [];

//   // Modal open handlers
//   const openAddModal = () => {
//     setEditingActivity(null);
//     setValue("title", "");
//     setValue("description", "");
//     setValue("instruction_sheet", "");
//     setValue("video", null);
//     setValue("videoPreview", null);
//     setIsModalOpen(true);
//   };

//   const openEditModal = (activity: Activity) => {
//     setEditingActivity(activity);
//     setValue("title", activity.title ?? "");
//     setValue("description", activity.description ?? "");
//     setValue("instruction_sheet", activity.instruction_sheet ?? "");
//     setValue("video", null);
//     setValue("videoPreview", activity.video ?? null);
//     setIsModalOpen(true);
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return;
//     const file = e.target.files[0];
//     const previewUrl = URL.createObjectURL(file);
//     setValue("video", file);
//     setValue("videoPreview", previewUrl);
//   };

//   const onSubmit = async (data: ActivityFormType) => {
//     if (!data.video && !editingActivity) {
//       return toast.error("Please upload a video");
//     }

//     const payload = new FormData();
//     payload.append("title", data.title);
//     payload.append("description", data.description);
//     payload.append("instruction_sheet", data.instruction_sheet);
//     if (data.video) payload.append("video", data.video);

//     try {
//       if (editingActivity) {
//         await updateActivity({ id: editingActivity.id, data: payload }).unwrap();
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
//       <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <Title title="DIY Activities" />
//         <button onClick={openAddModal} className="mt-auto flex items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all">
//           <Plus className="w-5 h-5" /> Add Activity
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
//         <table className="w-full min-w-[900px]">
//           <thead className="bg-gray-50 border-b border-gray-300">
//             <tr>
//               <th className="px-6 py-3 text-left">Title</th>
//               <th className="px-6 py-3 text-left">Description</th>
//               <th className="px-6 py-3 text-left">Instruction Sheet</th>
//               <th className="px-6 py-3 text-left">Video</th>
//               <th className="px-6 py-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading ? (
//               <tr><td colSpan={5} className="text-center p-6">Loading...</td></tr>
//             ) : isError ? (
//               <tr><td colSpan={5} className="text-center p-6">Error fetching activities</td></tr>
//             ) : activities.length === 0 ? (
//               <tr><td colSpan={5} className="text-center p-6 text-gray-500">No activities found.</td></tr>
//             ) : (
//               activities.map(a => (
//                 <tr key={a.id} className="border-b border-gray-300 hover:bg-gray-50">
//                   <td className="px-6 py-4">{a.title}</td>
//                   <td className="px-6 py-4">{stripHtml(a.description).slice(0, 50)}...</td>
//                   <td className="px-6 py-4">{stripHtml(a.instruction_sheet).slice(0, 50)}...</td>
//                   <td className="px-6 py-4">
//                     {a.video ? <a href={a.video} target="_blank" rel="noreferrer" className="text-blue-600">View Video</a> : "No video"}
//                   </td>
//                   <td className="flex justify-center gap-2 px-6 py-4">
//                     <button onClick={() => openEditModal(a)} className="p-2 hover:cursor-pointer bg-yellow-500 text-white rounded"><FaRegEdit /></button>
//                     <button onClick={() => setConfirmDelete(a)} className="p-2 hover:cursor-pointer bg-red-600 text-white rounded"><MdDelete /></button>
//                     <button onClick={() => setViewActivity(a)} className="p-2 hover:cursor-pointer bg-green-500 text-white rounded"><GrView /></button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Add/Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
//           <div className="w-full max-w-3xl rounded-lg bg-white p-6 overflow-y-auto max-h-[90vh]">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold">{editingActivity ? "Edit Activity" : "Add Activity"}</h3>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:cursor-pointer bg-gray-200 rounded">X</button>
//             </div>
//             <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//               <input {...register("title", { required: true })} placeholder="Title" className="border border-gray-300 p-2 rounded" />
//               {errors.title && <span className="text-red-500">Title required</span>}

//               <textarea {...register("description", { required: true })} placeholder="Description" className="border border-gray-300 p-2 rounded" rows={3} />
//               {errors.description && <span className="text-red-500">Description required</span>}

//               <Controller name="instruction_sheet" control={control} render={({ field }) => <RichTextInput value={field.value ?? ""} onChange={field.onChange} />} />

//               <input type="file" accept="video/*" onChange={handleFileChange} />
//               {formData.videoPreview && <video src={formData.videoPreview} controls className="mt-2 w-full max-h-60 rounded" />}

//               <div className="flex justify-end gap-2 mt-4">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="mt-auto flex items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all">Cancel</button>
//                 <button type="submit" className="mt-auto flex items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all">{editingActivity ? "Update" : "Add"}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {confirmDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white p-6 rounded-lg max-w-sm">
//             <h3 className="text-lg font-bold mb-2">Delete Activity</h3>
//             <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
//             <div className="mt-4 flex justify-end gap-2">
//               <button onClick={() => setConfirmDelete(null)} className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all">Cancel</button>
//               <button onClick={handleDelete} className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Modal */}
//       {/* {viewActivity && (
//         <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
//           <div className="bg-white p-6 rounded-lg max-w-7xl w-full">
//             <h3 className="text-xl font-bold mb-2">{viewActivity.title}</h3>
//             <div dangerouslySetInnerHTML={{ __html: viewActivity.description ?? "" }} className="prose" />
//             <div dangerouslySetInnerHTML={{ __html: viewActivity.instruction_sheet ?? "" }} className="prose mt-4" />
//             {viewActivity.video && <video src={viewActivity.video} controls className="mt-3  w-2xl rounded" />}
//             <div className="flex justify-end mt-4">
//               <button onClick={() => setViewActivity(null)} className="mt-auto flex   items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all">Close</button>
//             </div>
//           </div>
//         </div>
//       )} */}

// {viewActivity && (
//   <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//     <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
//       {/* Title */}
//       <h2 className="text-2xl p-6 font-bold text-gray-800 tracking-wide">
//         {viewActivity.title}
//       </h2>

//       {/* Close Button */}
//       <button
//         onClick={() => setViewActivity(null)}
//         className="absolute top-4 right-4 hover:cursor-pointer text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition"
//       >
//         ✕
//       </button>

//       {/* Media Section */}
//       <div className="relative w-full mt-4 p-3 h-72 md:h-80 rounded-t-2xl overflow-hidden">
//         {viewActivity.video ? (
//           <video
//             src={viewActivity.video}
//             controls
//             autoPlay
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <img
//             src={viewActivity.images?.[0] || "/placeholder.png"}
//             alt={viewActivity.title}
//             className="w-full h-full object-cover"
//           />
//         )}
//       </div>

//       {/* Content */}
//       <div className="p-6 space-y-6">
//         {viewActivity.description && (
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">About this Activity</h3>
//             <div
//               className="text-gray-700 prose"
//               dangerouslySetInnerHTML={{ __html: viewActivity.description }}
//             />
//           </div>
//         )}

//         {viewActivity.instruction_sheet && (
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">
//               🪄 Step-by-Step Instructions
//             </h3>
//             <div
//               dangerouslySetInnerHTML={{ __html: viewActivity.instruction_sheet }}
//               className="prose mt-4"
//             />
//           </div>
//         )}

//         {/* Close Button */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => setViewActivity(null)}
//             className="flex items-center justify-center gap-2 rounded-lg bg-[#223B7D] px-5 py-2.5 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}




//     </div>
//   );
// };

// export default AdminActivityTable;


























// // src/components/AdminActivityTable.tsx
// import React, { useState, ChangeEvent } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { RichTextEditor } from "@mantine/rte";
// import { Plus } from "lucide-react";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { GrView } from "react-icons/gr";
// import toast from "react-hot-toast";
// import Title from "@/components/Shared/Title";
// import type { Activity } from "../../redux/types/activity.type";
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
// }

// const stripHtml = (html: string) => {
//   const div = document.createElement("div");
//   div.innerHTML = html;
//   return div.textContent || div.innerText || "";
// };

// const RichTextInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
//   <div className="overflow-hidden rounded-lg border border-gray-300 p-2 h-[250px]">
//     <RichTextEditor value={value} onChange={onChange} className="h-[230px] overflow-y-auto" />
//   </div>
// );

// const AdminActivityTable: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
//   const [viewActivity, setViewActivity] = useState<Activity | null>(null);
//   const [confirmDelete, setConfirmDelete] = useState<Activity | null>(null);

//   const { control, handleSubmit, setValue, watch, register, formState: { errors } } = useForm<ActivityFormType>({
//     defaultValues: {
//       title: "",
//       description: "",
//       instruction_sheet: "",
//       video: null,
//       videoPreview: null,
//     },
//   });

//   const formData = watch();

//   // RTK Query hooks
//   const { data, isLoading, isError, refetch } = useGetActivitiesQuery();
//   const [addActivity] = useAddActivityMutation();
//   const [updateActivity] = useUpdateActivityMutation();
//   const [deleteActivity] = useDeleteActivityMutation();

//   const activities = data?.data || [];

//   // Modal open handlers
//   const openAddModal = () => {
//     setEditingActivity(null);
//     setValue("title", "");
//     setValue("description", "");
//     setValue("instruction_sheet", "");
//     setValue("video", null);
//     setValue("videoPreview", null);
//     setIsModalOpen(true);
//   };

//   const openEditModal = (activity: Activity) => {
//     setEditingActivity(activity);
//     setValue("title", activity.title);
//     setValue("description", activity.description);
//     setValue("instruction_sheet", activity.instruction_sheet);
//     setValue("video", null);
//     setValue("videoPreview", activity.video || null);
//     setIsModalOpen(true);
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return;
//     const file = e.target.files[0];
//     const previewUrl = URL.createObjectURL(file);
//     setValue("video", file);
//     setValue("videoPreview", previewUrl);
//   };

//   const onSubmit = async (data: ActivityFormType) => {
//     if (!data.video && !editingActivity) {
//       return toast.error("Please upload a video");
//     }

//     const payload = new FormData();
//     payload.append("title", data.title);
//     payload.append("description", data.description);
//     payload.append("instruction_sheet", data.instruction_sheet);
//     if (data.video) payload.append("video", data.video);

//     try {
//       if (editingActivity) {
//         await updateActivity({ id: editingActivity.id, data: payload }).unwrap();
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
//       <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <Title title="DIY Activities" />
//         {/*  */}
//         <button onClick={openAddModal} className="mt-auto flex   items-center hover:cursor-pointer justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all">
//           <Plus className="w-5 h-5" /> Add Activity
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
//         <table className="w-full min-w-[900px]">
//           <thead className="bg-gray-50 border-b border-gray-300">
//             <tr>
//               <th className="px-6 py-3 text-left">Title</th>
//               <th className="px-6 py-3 text-left">Description</th>
//               <th className="px-6 py-3 text-left">Instruction Sheet</th>
//               <th className="px-6 py-3 text-left">Video</th>
//               <th className="px-6 py-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading ? (
//               <tr><td colSpan={5} className="text-center p-6">Loading...</td></tr>
//             ) : isError ? (
//               <tr><td colSpan={5} className="text-center p-6">Error fetching activities</td></tr>
//             ) : activities.length === 0 ? (
//               <tr><td colSpan={5} className="text-center p-6 text-gray-500">No activities found.</td></tr>
//             ) : (
//               activities.map(a => (
//                 <tr key={a.id} className="border-b border-gray-300 hover:bg-gray-50">
//                   <td className="px-6 py-4">{a.title}</td>
//                   <td className="px-6 py-4">{stripHtml(a.description).slice(0, 50)}...</td>
//                   <td className="px-6 py-4">{stripHtml(a.instruction_sheet).slice(0, 50)}...</td>
//                   <td className="px-6 py-4">{a.video ? <a href={a.video} target="_blank" className="text-blue-600">View Video</a> : "No video"}</td>
//                   <td className="flex justify-center gap-2 px-6 py-4">
//                     <button onClick={() => openEditModal(a)} className="p-2 hover:cursor-pointer  bg-yellow-500 text-white rounded"><FaRegEdit /></button>
//                     <button onClick={() => setConfirmDelete(a)} className="p-2 hover:cursor-pointer bg-red-600 text-white rounded"><MdDelete /></button>
//                     <button onClick={() => setViewActivity(a)} className="p-2 hover:cursor-pointer bg-green-500 text-white rounded"><GrView /></button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Add/Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
//           <div className="w-full max-w-3xl rounded-lg bg-white p-6 overflow-y-auto max-h-[90vh]">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold">{editingActivity ? "Edit Activity" : "Add Activity"}</h3>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:cursor-pointer bg-gray-200 rounded">X</button>
//             </div>
//             <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//               <input {...register("title", { required: true })} placeholder="Title" className="border border-gray-300 p-2 rounded" />
//               {errors.title && <span className="text-red-500">Title required</span>}

//               <textarea {...register("description", { required: true })} placeholder="Description" className="border border-gray-300 p-2 rounded" rows={3} />
//               {errors.description && <span className="text-red-500">Description required</span>}

//               <Controller name="instruction_sheet" control={control} render={({ field }) => <RichTextInput value={field.value} onChange={field.onChange} />} />

//               <input type="file" accept="video/*" onChange={handleFileChange} />
//               {formData.videoPreview && <video src={formData.videoPreview} controls className="mt-2 w-full max-h-60 rounded" />}

//               <div className="flex justify-end gap-2 mt-4">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="mt-auto flex   items-center hover:cursor-pointer justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all">Cancel</button>
//                 <button type="submit" className="mt-auto flex   items-center hover:cursor-pointer justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all">{editingActivity ? "Update" : "Add"}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {confirmDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white p-6 rounded-lg max-w-sm">
//             <h3 className="text-lg font-bold mb-2">Delete Activity</h3>
//             <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
//             <div className="mt-4 flex justify-end gap-2">
//               <button onClick={() => setConfirmDelete(null)} className="mt-auto flex w-full items-center hover:cursor-pointer justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all">Cancel</button>
//               <button onClick={handleDelete} className="mt-auto flex w-full items-center hover:cursor-pointer justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Modal */}
//       {viewActivity && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
//           <div className="bg-white p-6 rounded-lg max-w-lg w-full">
//             <h3 className="text-xl font-bold mb-2">{viewActivity.title}</h3>
//             <div dangerouslySetInnerHTML={{ __html: viewActivity.description }} className="prose" />
//             <div dangerouslySetInnerHTML={{ __html: viewActivity.instruction_sheet }} className="prose mt-4" />
//             {viewActivity.video && <video src={viewActivity.video} controls className="mt-3 w-full rounded" />}
//             <div className="flex justify-end mt-4">
//               <button onClick={() => setViewActivity(null)} className="mt-auto flex w-full items-center hover:cursor-pointer justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all">Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminActivityTable;























// // src/components/AdminDiyActivityTable.tsx
// import React, { useState, ChangeEvent } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { RichTextEditor } from "@mantine/rte";
// import { Plus } from "lucide-react";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { GrView } from "react-icons/gr";
// import toast from "react-hot-toast";
// import Title from "@/components/Shared/Title";
// import type { Activity } from "../../redux/types/activity.type";
// import {
//   useGetActivitiesQuery,
//   useAddActivityMutation,
//   useUpdateActivityMutation,
//   useDeleteActivityMutation,
// } from "../../redux/features/AdminDiyActivity/activityApi";

// interface ActivityFormType {
//   title: string;
//   description: string;
//   materials: string;
//   steps: string;
//   difficulty?: "Easy" | "Moderate" | "Hard";
//   category: string[];
//   files: File[];
//   previewUrls: string[];
// }

// const categoryOptions = [
//   "Crafts", "Home Improvement", "Decor", "Gardening", "Kids",
//   "Recycling", "Art", "Woodwork", "Upcycling", "Outdoor Projects",
// ];

// const stripHtml = (html: string) => {
//   const div = document.createElement("div");
//   div.innerHTML = html;
//   return div.textContent || div.innerText || "";
// };

// const RichTextInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
//   <div className="overflow-hidden rounded-lg border border-gray-300 p-2 h-[250px]">
//     <RichTextEditor value={value} onChange={onChange} className="h-[230px] overflow-y-auto" />
//   </div>
// );

// const AdminDiyActivityTable: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
//   const [viewActivity, setViewActivity] = useState<Activity | null>(null);
//   const [confirmDelete, setConfirmDelete] = useState<Activity | null>(null);
//   const [categoryOpen, setCategoryOpen] = useState(false);

//   const { control, handleSubmit, setValue, watch, register, formState: { errors } } = useForm<ActivityFormType>({
//     defaultValues: {
//       title: "",
//       description: "",
//       materials: "",
//       steps: "",
//       difficulty: undefined,
//       category: [],
//       files: [],
//       previewUrls: [],
//     },
//   });

//   const formData = watch();

//   // RTK Query hooks
//   const { data, isLoading, isError, refetch } = useGetActivitiesQuery();
//   const [addActivity] = useAddActivityMutation();
//   const [updateActivity] = useUpdateActivityMutation();
//   const [deleteActivity] = useDeleteActivityMutation();

//   const activities = data?.data || [];

//   // Modal open handlers
//   const openAddModal = () => {
//     setEditingActivity(null);
//     ["title", "description", "materials", "steps", "difficulty", "category", "files", "previewUrls"].forEach(field => setValue(field as any, field === "difficulty" ? undefined : []));
//     setIsModalOpen(true);
//   };

//   const openEditModal = (activity: Activity) => {
//     setEditingActivity(activity);
//     setValue("title", activity.title);
//     setValue("description", activity.description);
//     setValue("materials", activity.materials);
//     setValue("steps", activity.steps);
//     setValue("difficulty", activity.difficulty);
//     setValue("category", activity.category ?? []);
//     setValue("previewUrls", activity.images ?? []);
//     setValue("files", []);
//     setIsModalOpen(true);
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     formData.previewUrls.forEach(url => URL.revokeObjectURL(url));
//     const filesArray = Array.from(e.target.files);
//     const previewUrls = filesArray.map(file => URL.createObjectURL(file));
//     setValue("files", filesArray);
//     setValue("previewUrls", previewUrls);
//   };

//   const onSubmit = async (data: ActivityFormType) => {
//     if (!data.difficulty) return toast.error("Please select difficulty");

//     const payload = new FormData();
//     payload.append("title", data.title);
//     payload.append("description", data.description);
//     payload.append("materials", data.materials);
//     payload.append("steps", data.steps);
//     payload.append("difficulty", data.difficulty);
//     data.category.forEach(cat => payload.append("category[]", cat));
//     data.files.forEach(file => payload.append("files", file));

//     try {
//       if (editingActivity) {
//         await updateActivity({ id: editingActivity.id, data: payload }).unwrap();
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
//       <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <Title title="DIY Activities" />
//         <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-500">
//           <Plus className="w-5 h-5" /> Add Activity
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
//         <table className="w-full min-w-[900px]">
//           <thead className="bg-gray-50 border-b border-gray-300">
//             <tr>
//               <th className="px-6 py-3 text-left">Title</th>
//               <th className="px-6 py-3 text-left">Description</th>
//               <th className="px-6 py-3 text-left">Difficulty</th>
//               <th className="px-6 py-3 text-left">Category</th>
//               <th className="px-6 py-3 text-left">Image</th>
//               <th className="px-6 py-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading ? (
//               <tr><td colSpan={6} className="text-center p-6">Loading...</td></tr>
//             ) : isError ? (
//               <tr><td colSpan={6} className="text-center p-6">Error fetching activities</td></tr>
//             ) : activities.length === 0 ? (
//               <tr><td colSpan={6} className="text-center p-6 text-gray-500">No activities found.</td></tr>
//             ) : (
//               activities.map(a => (
//                 <tr key={a.id} className="border-b border-gray-300 hover:bg-gray-50">
//                   <td className="px-6 py-4">{a.title}</td>
//                   <td className="px-6 py-4">{stripHtml(a.description).slice(0, 50)}...</td>
//                   <td className="px-6 py-4">{a.difficulty}</td>
// <td className="px-6 py-4">{(a.category || []).join(", ")}</td>                  {/* <td className="px-6 py-4">{a.category.join(", ")}</td> */}
//                   <td className="px-6 py-4">{a.images?.[0] ? <img src={a.images[0]} className="h-14 w-14 object-cover rounded" /> : "No image"}</td>
//                   <td className="flex justify-center gap-2 px-6 py-4">
//                     <button onClick={() => openEditModal(a)} className="p-2 bg-yellow-500 text-white rounded"><FaRegEdit /></button>
//                     <button onClick={() => setConfirmDelete(a)} className="p-2 bg-red-600 text-white rounded"><MdDelete /></button>
//                     <button onClick={() => setViewActivity(a)} className="p-2 bg-green-500 text-white rounded"><GrView /></button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Add/Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
//           <div className="w-full max-w-4xl rounded-lg bg-white p-6 overflow-y-auto max-h-[90vh]">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold">{editingActivity ? "Edit Activity" : "Add Activity"}</h3>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-200 rounded">X</button>
//             </div>
//             <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//               <input {...register("title", { required: true })} placeholder="Title" className="border border-gray-300 p-2 rounded" />
//               {errors.title && <span className="text-red-500">Title required</span>}

//               <select {...register("difficulty", { required: true })} className="border border-gray-300 p-2 rounded">
//                 <option value="">Select Difficulty</option>
//                 <option value="Easy">Easy</option>
//                 <option value="Moderate">Moderate</option>
//                 <option value="Hard">Hard</option>
//               </select>
//               {errors.difficulty && <span className="text-red-500">Difficulty required</span>}

//               <Controller
//                 name="category"
//                 control={control}
//                 render={({ field }) => (
//                   <div className="border border-gray-300 p-2 rounded relative">
//                     <div onClick={() => setCategoryOpen(!categoryOpen)}>{field.value.length ? field.value.join(", ") : "Select categories"}</div>
//                     {categoryOpen && (
//                       <ul className="border border-gray-300 mt-2 max-h-32 overflow-y-auto bg-white p-2 absolute z-10 w-full">
//                         {categoryOptions.map(cat => (
//                           <li key={cat} onClick={() => field.onChange(field.value.includes(cat) ? field.value.filter(v => v !== cat) : [...field.value, cat])} className="flex items-center gap-2 cursor-pointer">
//                             <input type="checkbox" checked={field.value.includes(cat)} readOnly /> {cat}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 )}
//               />

//               <textarea {...register("description", { required: true })} placeholder="Description" className="border border-gray-300 p-2 rounded" rows={3} />
//               <textarea {...register("materials", { required: true })} placeholder="Materials" className="border border-gray-300 p-2 rounded" rows={3} />
//               <Controller name="steps" control={control} render={({ field }) => <RichTextInput value={field.value} onChange={field.onChange} />} />

//               <input type="file" multiple onChange={handleFileChange} />
//               <div className="flex gap-2 mt-2 flex-wrap">
//                 {formData.previewUrls.map((url, idx) => <img key={idx} src={url} className="h-16 w-16 object-cover rounded" />)}
//               </div>

//               <div className="flex justify-end gap-2 mt-4">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
//                 <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editingActivity ? "Update" : "Add"}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {confirmDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white p-6 rounded-lg max-w-sm">
//             <h3 className="text-lg font-bold mb-2">Delete Activity</h3>
//             <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
//             <div className="mt-4 flex justify-end gap-2">
//               <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
//               <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Modal */}
//       {viewActivity && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
//           <div className="bg-white p-6 rounded-lg max-w-lg w-full">
//             <h3 className="text-xl font-bold mb-2">{viewActivity.title}</h3>
//             <div dangerouslySetInnerHTML={{ __html: viewActivity.description }} className="prose" />
//             <div dangerouslySetInnerHTML={{ __html: viewActivity.steps }} className="prose mt-4" />
//             <div className="flex gap-2 flex-wrap mt-3">
//               {viewActivity.images?.map((img, idx) => <img key={idx} src={img} className="h-20 w-20 rounded object-cover" />)}
//             </div>
//             <div className="flex justify-end mt-4">
//               <button onClick={() => setViewActivity(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDiyActivityTable;


























 