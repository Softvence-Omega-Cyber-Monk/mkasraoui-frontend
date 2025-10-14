// src/components/AdminDiyActivityTable.tsx
import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { RichTextEditor } from "@mantine/rte";
import { Plus } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";
import toast from "react-hot-toast";
import { diyActivities } from "./diyActivity.type";
import type { Activity } from "./diyActivity.type";
import Title from "@/components/Shared/Title";

interface ActivityFormType {
  title: string;
  description: string;
  materials: string;
  steps: string;
  difficulty?: "Easy" | "Moderate" | "Hard";
  category: string[];
  files: File[];
  previewUrls: string[];
}

const categoryOptions = [
  "Crafts", "Home Improvement", "Decor", "Gardening", "Kids",
  "Recycling", "Art", "Woodwork", "Upcycling", "Outdoor Projects",
];

function stripHtml(html: string) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

const RichTextInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div className="overflow-hidden rounded-lg border border-[#DBE0E5] p-2 lg:h-[250px]">
    <RichTextEditor
      className="overflow-hidden overflow-y-scroll lg:h-[230px]"
      value={value}
      onChange={onChange}
    />
  </div>
);

const AdminDiyActivityTable: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [viewActivity, setViewActivity] = useState<Activity | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Activity | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const { control, handleSubmit, setValue, watch, register, formState: { errors } } = useForm<ActivityFormType>({
    defaultValues: {
      title: "",
      description: "",
      materials: "",
      steps: "",
      difficulty: undefined,
      category: [],
      files: [],
      previewUrls: [],
    },
  });

  const formData = watch();

  useEffect(() => {
    setActivities(diyActivities);
  }, []);

  const openAddModal = () => {
    setEditingActivity(null);
    setValue("title", "");
    setValue("description", "");
    setValue("materials", "");
    setValue("steps", "");
    setValue("difficulty", undefined);
    setValue("category", []);
    setValue("files", []);
    setValue("previewUrls", []);
    setIsModalOpen(true);
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setValue("title", activity.title);
    setValue("description", activity.description);
    setValue("materials", activity.materials);
    setValue("steps", activity.steps);
    setValue("difficulty", activity.difficulty);
    setValue("category", activity.category ?? []);
    setValue("previewUrls", activity.images ?? []);
    setValue("files", []);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    formData.previewUrls.forEach(url => URL.revokeObjectURL(url));
    const filesArray = Array.from(e.target.files);
    const previewUrls = filesArray.map(file => URL.createObjectURL(file));
    setValue("files", filesArray);
    setValue("previewUrls", previewUrls);
  };

  const onSubmit = (data: ActivityFormType) => {
    if (!data.difficulty) return toast.error("Please select difficulty");

    const newActivity: Activity = {
      id: editingActivity ? editingActivity.id : Date.now().toString(),
      title: data.title,
      description: data.description,
      materials: data.materials,
      steps: data.steps,
      difficulty: data.difficulty,
      category: data.category,
      images: data.previewUrls,
    };

    if (editingActivity) {
      setActivities(prev => prev.map(a => a.id === editingActivity.id ? newActivity : a));
      toast.success("Activity updated successfully");
    } else {
      setActivities(prev => [...prev, newActivity]);
      toast.success("Activity added successfully");
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    setActivities(prev => prev.filter(a => a.id !== confirmDelete.id));
    setConfirmDelete(null);
    toast.success("Activity deleted successfully");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Title title="DIY Activities" />
        <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-500">
          <Plus className="w-5 h-5" /> Add Activity
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-[#DBE0E5] bg-white">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 border-b border-[#DBE0E5]">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Difficulty</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">No activities found.</td>
              </tr>
            ) : (
              activities.map(a => (
                <tr key={a.id} className="border-b border-[#DBE0E5] hover:bg-gray-50">
                  <td className="px-6 py-4">{a.title}</td>
                  <td className="px-6 py-4">{stripHtml(a.description).slice(0, 50)}...</td>
                  <td className="px-6 py-4">{a.difficulty}</td>
                  <td className="px-6 py-4">{a.category.join(", ")}</td>
                  <td className="px-6 py-4">
                    {a.images?.[0] ? <img src={a.images[0]} className="h-14 w-14 object-cover rounded" /> : <span>No image</span>}
                  </td>
                  <td className="flex justify-center gap-2 px-6 py-4">
                    <button onClick={() => openEditModal(a)} className="p-2 bg-yellow-500 text-white rounded"><FaRegEdit /></button>
                    <button onClick={() => setConfirmDelete(a)} className="p-2 bg-red-600 text-white rounded"><MdDelete /></button>
                    <button onClick={() => setViewActivity(a)} className="p-2 bg-green-500 text-white rounded"><GrView /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{editingActivity ? "Edit Activity" : "Add Activity"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-200 rounded">X</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <input {...register("title", { required: true })} placeholder="Title" className="border border-[#DBE0E5] p-2 rounded" />
              {errors.title && <span className="text-red-500">Title required</span>}

              <select {...register("difficulty", { required: true })} className="border border-[#DBE0E5] p-2 rounded">
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
              </select>
              {errors.difficulty && <span className="text-red-500">Difficulty required</span>}

              <Controller
                name="category"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="border border-[#DBE0E5] p-2 rounded cursor-pointer relative">
                    <div onClick={() => setCategoryOpen(!categoryOpen)}>
                      {field.value.length ? field.value.join(", ") : "Select categories"}
                    </div>
                    {categoryOpen && (
                      <ul className="border border-[#DBE0E5] mt-2 max-h-32 overflow-y-auto bg-white p-2 absolute z-10 w-full">
                        {categoryOptions.map(cat => (
                          <li key={cat} onClick={() => field.onChange(field.value.includes(cat) ? field.value.filter(v => v !== cat) : [...field.value, cat])} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={field.value.includes(cat)} readOnly /> {cat}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              />
              {errors.category && <span className="text-red-500">Select at least one category</span>}

              <textarea {...register("description", { required: true })} placeholder="Description" className="border border-[#DBE0E5] p-2 rounded" rows={3} />
              <textarea {...register("materials", { required: true })} placeholder="Materials" className="border border-[#DBE0E5] p-2 rounded" rows={3} />
              <Controller name="steps" control={control} render={({ field }) => <RichTextInput value={field.value} onChange={field.onChange} />} />

              <input type="file" multiple onChange={handleFileChange} />
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.previewUrls.map((url, idx) => <img key={idx} src={url} className="h-16 w-16 object-cover rounded" />)}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editingActivity ? "Update" : "Add"}</button>
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
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-2">{viewActivity.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: viewActivity.description }} className="prose" />
            <div dangerouslySetInnerHTML={{ __html: viewActivity.steps }} className="prose mt-4" />
            <div className="flex gap-2 flex-wrap mt-3">
              {viewActivity.images?.map((img, idx) => <img key={idx} src={img} className="h-20 w-20 rounded object-cover" />)}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setViewActivity(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDiyActivityTable;




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
//   useGetActivitiesQuery,
//   useAddActivityMutation,
//   useUpdateActivityMutation,
//   useDeleteActivityMutation,
// } from "@/redux/features/activity/activityApi";
// import type { Activity } from "@/redux/types/activity.type";

// interface RichTextInputProps {
//   value: string;
//   onChange: (value: string) => void;
// }
// const RichTextInput: React.FC<RichTextInputProps> = ({ value, onChange }) => (
//   <div className="overflow-hidden rounded-lg border border-[#DBE0E5] p-2 lg:h-[350px]">
//     <RichTextEditor
//       className="overflow-hidden overflow-y-scroll lg:h-[330px]"
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

// interface ActivityFormType {
//   title: string;
//   description: string;
//   materials: string;
//   steps: string;
//   difficulty: string;
//   category: string[];
//   files: File[];
//   previewUrls: string[];
// }

// const categoryOptions = [
//   "Crafts",
//   "Home Improvement",
//   "Decor",
//   "Gardening",
//   "Kids",
//   "Recycling",
//   "Art",
//   "Woodwork",
//   "Upcycling",
//   "Outdoor Projects",
// ];

// const AdminDiyActivityTable: React.FC = () => {
//   const { data, isLoading, isFetching } = useGetActivitiesQuery();
//   const activities: Activity[] = data?.data ?? [];

//   const [addActivity] = useAddActivityMutation();
//   const [updateActivity] = useUpdateActivityMutation();
//   const [deleteActivity] = useDeleteActivityMutation();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
//   const [viewActivity, setViewActivity] = useState<Activity | null>(null);
//   const [confirmDelete, setConfirmDelete] = useState<Activity | null>(null);
//   const [categoryOpen, setCategoryOpen] = useState(false);
//   const [difficultyOpen, setDifficultyOpen] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<ActivityFormType>({
//     defaultValues: {
//       title: "",
//       description: "",
//       materials: "",
//       steps: "",
//       difficulty: "",
//       category: [],
//       files: [],
//       previewUrls: [],
//     },
//   });

//   const formData = watch();

//   // Pagination
//   const [page, setPage] = useState(1);
//   const activitiesPerPage = 10;
//   const total = activities.length;
//   const totalPages = Math.ceil(total / activitiesPerPage);

//   useEffect(() => setPage(1), [total]);

//   const paginatedActivities = activities.slice(
//     (page - 1) * activitiesPerPage,
//     page * activitiesPerPage
//   );

//   // Modal Handlers
//   const openAddModal = () => {
//     setEditingActivity(null);
//     setValue("category", []);
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
//     formData.previewUrls.forEach((url) => URL.revokeObjectURL(url));
//     const filesArray = Array.from(e.target.files);
//     const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
//     setValue("files", filesArray);
//     setValue("previewUrls", previewUrls);
//   };

//   const onSubmit = async (data: ActivityFormType) => {
//     try {
//       const formDataToSend = new FormData();
//       const payload = {
//         title: data.title,
//         description: data.description,
//         materials: data.materials,
//         steps: data.steps,
//         difficulty: data.difficulty,
//         category: data.category,
//       };
//       formDataToSend.append("data", JSON.stringify(payload));
//       data.files.forEach((file) => formDataToSend.append("files", file));

//       if (editingActivity) {
//         await updateActivity({ id: editingActivity.id, data: formDataToSend }).unwrap();
//         toast.success("Activity updated successfully");
//       } else {
//         await addActivity(formDataToSend).unwrap();
//         toast.success("Activity added successfully");
//       }

//       setIsModalOpen(false);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to submit activity");
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirmDelete) return;
//     try {
//       await deleteActivity(confirmDelete.id).unwrap();
//       toast.success("Activity deleted successfully");
//       setConfirmDelete(null);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete activity");
//     }
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <Title title="DIY Activities" />
//         <button
//           onClick={openAddModal}
//           className="bg-secondary-dark hover:bg-secondary-light flex items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:cursor-pointer focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
//         >
//           <Plus className="h-5 w-5" /> Add Activity
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
//         <div className="w-full overflow-x-auto">
//           <table className="w-full min-w-[900px]">
//             <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
//               <tr>
//                 <th className="px-6 py-5 text-left text-sm font-medium">Title</th>
//                 <th className="px-6 py-5 text-left text-sm font-medium">Description</th>
//                 <th className="px-6 py-5 text-left text-sm font-medium">Materials</th>
//                 <th className="px-6 py-5 text-left text-sm font-medium">Difficulty</th>
//                 <th className="px-6 py-5 text-left text-sm font-medium">Category</th>
//                 <th className="px-6 py-5 text-left text-sm font-medium">Image</th>
//                 <th className="px-6 py-5 text-center text-sm font-medium">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading || isFetching ? (
//                 <tr>
//                   <td colSpan={7} className="p-6 text-center">
//                     <PageLoader />
//                   </td>
//                 </tr>
//               ) : activities.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="p-6 text-center text-sm text-gray-600">
//                     No activities found.
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedActivities.map((activity) => (
//                   <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="px-6 py-4">{activity.title.slice(0, 30)}...</td>
//                     <td className="px-6 py-4">{stripHtml(activity.description).slice(0, 30)}...</td>
//                     <td className="px-6 py-4">{stripHtml(activity.materials).slice(0, 30)}...</td>
//                     <td className="px-6 py-4">{activity.difficulty}</td>
//                     <td className="px-6 py-4">{activity.category.join(", ").slice(0, 20)}...</td>
//                     <td className="px-6 py-4">
//                       {activity.images?.length ? (
//                         <img
//                           src={activity.images[0]}
//                           alt={activity.title}
//                           className="h-14 w-14 rounded object-cover"
//                         />
//                       ) : (
//                         <span className="text-xs text-gray-500">No image</span>
//                       )}
//                     </td>
//                     <td className="mt-3 flex justify-center gap-2 px-6 py-4">
//                       <button
//                         onClick={() => openEditModal(activity)}
//                         className="rounded bg-yellow-500 p-2 text-white hover:cursor-pointer hover:bg-yellow-600"
//                       >
//                         <FaRegEdit />
//                       </button>
//                       <button
//                         onClick={() => setConfirmDelete(activity)}
//                         className="rounded bg-red-600 p-2 text-white hover:cursor-pointer hover:bg-red-700"
//                       >
//                         <MdDelete />
//                       </button>
//                       <button
//                         onClick={() => setViewActivity(activity)}
//                         className="rounded bg-emerald-500 p-2 text-white hover:cursor-pointer hover:bg-emerald-600"
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
//       {activities.length > 0 && (
//         <div className="mt-6 flex items-center justify-between px-4 py-3">
//           <div className="text-sm text-gray-600">
//             Showing <span className="font-medium">{paginatedActivities.length}</span> of{" "}
//             <span className="font-medium">{total}</span>
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
//           <div className="w-full overflow-y-auto rounded-lg bg-white p-6 shadow-lg lg:h-screen lg:max-w-7xl">
//             <div className="flex items-center justify-between">
//               <h3 className="mb-4 text-xl font-semibold">
//                 {editingActivity ? "Edit Activity" : "Add Activity"}
//               </h3>

//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="rounded bg-gray-50 px-5 py-2 hover:cursor-pointer hover:bg-gray-400"
//               >
//                 X
//               </button>
//             </div>
//             <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//               <div className="flex flex-col gap-6">
//                 {/* Title + Difficulty */}
//                 <div className="flex items-center gap-4">
//                   <div className="flex-1">
//                     <label>Title</label>
//                     <input
//                       type="text"
//                       placeholder="Activity Title"
//                       {...control.register("title", { required: "Title required" })}
//                       className="w-full rounded-lg border border-[#DBE0E5] p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                     />
//                     {errors.title && <p className="mt-1 text-red-500">{errors.title.message}</p>}
//                   </div>

//                   <div className="flex flex-1 flex-col">
//                     <label>Difficulty</label>
//                     <div className="relative w-full" onClick={() => setDifficultyOpen(!difficultyOpen)}>
//                       <select
//                         {...control.register("difficulty", { required: "Difficulty required" })}
//                         className="w-full appearance-none rounded-lg border border-[#DBE0E5] p-3 pr-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                       >
//                         <option value="">Select Difficulty</option>
//                         <option value="Easy">Easy</option>
//                         <option value="Moderate">Moderate</option>
//                         <option value="Hard">Hard</option>
//                       </select>
//                       <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//                         {difficultyOpen ? (
//                           <ChevronUp className="h-5 w-5 text-gray-500" />
//                         ) : (
//                           <ChevronDown className="h-5 w-5 text-gray-500" />
//                         )}
//                       </div>
//                     </div>
//                     {errors.difficulty && (
//                       <p className="mt-1 text-red-500">{errors.difficulty.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Image + Category */}
//                 <div className="flex items-start gap-4">
//                   <div className="flex flex-1 flex-col">
//                     <label>Choose File</label>
//                     <input
//                       type="file"
//                       multiple
//                       onChange={handleFileChange}
//                       className="rounded-lg border border-[#DBE0E5] px-2 py-3"
//                     />
//                     {formData.previewUrls.length > 0 && (
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         {formData.previewUrls.map((url, i) => (
//                           <img key={i} src={url} className="h-16 w-16 rounded object-cover" />
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex-1">
//                     <label>Category</label>
//                     <Controller
//                       name="category"
//                       control={control}
//                       rules={{ required: "Select at least one category" }}
//                       render={({ field }) => (
//                         <div className="relative">
//                           <div
//                             onClick={() => setCategoryOpen(!categoryOpen)}
//                             className="flex cursor-pointer items-center justify-between rounded-lg border border-[#DBE0E5] bg-white p-3"
//                           >
//                             <span>
//                               {field.value?.length ? field.value.join(", ") : "Select categories"}
//                             </span>
//                             {categoryOpen ? (
//                               <ChevronUp className="h-5 w-5 text-gray-500" />
//                             ) : (
//                               <ChevronDown className="h-5 w-5 text-gray-500" />
//                             )}
//                           </div>
//                           {categoryOpen && (
//                             <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-[#DBE0E5] bg-white shadow">
//                               {categoryOptions.map((category) => (
//                                 <li
//                                   key={category}
//                                   className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100"
//                                   onClick={() => {
//                                     const newValue = field.value?.includes(category)
//                                       ? field.value.filter((v) => v !== category)
//                                       : [...(field.value || []), category];
//                                     field.onChange(newValue);
//                                   }}
//                                 >
//                                   <input
//                                     type="checkbox"
//                                     checked={field.value?.includes(category) || false}
//                                     readOnly
//                                     className="h-4 w-4 border-[#DBE0E5]"
//                                   />
//                                   <span>{category}</span>
//                                 </li>
//                               ))}
//                             </ul>
//                           )}
//                           {errors.category && (
//                             <p className="mt-1 text-red-500">{errors.category.message}</p>
//                           )}
//                         </div>
//                       )}
//                     />
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label>Description</label>
//                   <textarea
//                     placeholder="Short description of the activity"
//                     {...control.register("description", { required: "Description required" })}
//                     className="w-full rounded-lg border border-[#DBE0E5] px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//                     rows={4}
//                   />
//                   {errors.description && (
//                     <p className="mt-1 text-red-500">{errors.description.message}</p>
//                   )}
//                 </div>

//                 {/* Materials */}
//                 <div>
//                   <label>Materials</label>
//                   <textarea
//                     placeholder="List required materials"
//                     {...control.register("materials", { required: "Materials required" })}
//                     className="w-full rounded-lg border border-[#DBE0E5] px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//                     rows={4}
//                   />
//                   {errors.materials && (
//                     <p className="mt-1 text-red-500">{errors.materials.message}</p>
//                   )}
//                 </div>

//                 {/* Steps */}
//                 <div>
//                   <label>
//                     <h2 className="mb-1 font-semibold">Steps</h2>
//                   </label>
//                   <Controller
//                     name="steps"
//                     control={control}
//                     render={({ field }) => (
//                       <RichTextInput value={field.value} onChange={field.onChange} />
//                     )}
//                   />
//                   {errors.steps && <p className="mt-1 text-red-500">{errors.steps.message}</p>}
//                 </div>
//               </div>

//               <div className="mt-6 flex justify-end gap-3">
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
//                   {editingActivity ? "Update Activity" : "Add Activity"}
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
//             <h3 className="mb-4 text-lg font-bold">Delete Activity</h3>
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
//       {viewActivity && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-scroll bg-black/50">
//           <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow">
//             <h3 className="mb-4 text-xl font-bold">{viewActivity.title}</h3>
//             <div
//               dangerouslySetInnerHTML={{ __html: viewActivity.description }}
//               className="prose"
//             />
//             <div
//               dangerouslySetInnerHTML={{ __html: viewActivity.steps }}
//               className="prose mt-4"
//             />
//             <div className="mt-3 flex flex-wrap gap-2">
//               {viewActivity.images?.map((img, idx) => (
//                 <img key={idx} src={img} className="h-20 w-20 rounded object-cover" />
//               ))}
//             </div>
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={() => setViewActivity(null)}
//                 className="rounded bg-gray-500 px-5 py-2 text-white hover:cursor-pointer hover:bg-gray-600"
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

// export default AdminDiyActivityTable;
