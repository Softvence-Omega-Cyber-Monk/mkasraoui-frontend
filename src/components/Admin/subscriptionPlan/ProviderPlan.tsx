import { useState, useCallback } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Plus, X, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

import Title from "@/components/Shared/Title";
import PageLoader from "@/components/Shared/PageLoader";

import type { Plan, PlanFormData } from "@/redux/types/adminProviderPlan.type";
import {
  useCreateAdminProviderPlanMutation,
  useDeleteAdminProviderPlanMutation,
  useGetAdminProviderPlansQuery,
  useUpdateAdminProviderPlanMutation,
} from "@/redux/features/adminProviderPlan/adminProviderPlanApi";

interface ApiError {
  data?: { message?: string };
  message?: string;
}

type PlanFormState = Omit<PlanFormData, "price" | "features"> & {
  price: number | "";
  features: string[];
};

export default function ProviderPlan() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    price: "",
  });

  const [newPlan, setNewPlan] = useState<PlanFormState>({
    name: "",
    price: "",
    plan_duration: "MONTHLY",
    is_active: true,
    features: [],
  });

  const [newFeature, setNewFeature] = useState("");

  // --- API Hooks ---
  const {
    data: plansResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAdminProviderPlansQuery();
  const plans = plansResponse?.data || [];

  const [createPlan, { isLoading: isCreating }] =
    useCreateAdminProviderPlanMutation();
  const [updatePlan, { isLoading: isUpdating }] =
    useUpdateAdminProviderPlanMutation();
  const [deletePlan, { isLoading: isDeleting }] =
    useDeleteAdminProviderPlanMutation();

  // --- Validation ---
  const validateForm = useCallback(() => {
    const errors = { name: "", price: "" };
    let isValid = true;

    if (!newPlan.name.trim()) {
      errors.name = "Plan name is required";
      isValid = false;
    }

    if (newPlan.price === "" || Number(newPlan.price) < 0) {
      errors.price = "Price must be 0 or greater";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  }, [newPlan]);

  // --- Reset Form ---
  const resetForm = useCallback(() => {
    setNewPlan({
      name: "",
      price: "",
      plan_duration: "MONTHLY",
      is_active: true,
      features: [],
    });
    setEditingPlan(null);
    setNewFeature("");
    setValidationErrors({ name: "", price: "" });
  }, []);

  // --- Handle Create / Update ---
  const handleSubmitPlan = useCallback(async () => {
    if (!validateForm()) return;

    const payload: PlanFormData = {
      ...newPlan,
      price: Number(newPlan.price),
      features: newPlan.features.filter((f) => f.trim() !== ""),
    };

    try {
      if (editingPlan) {
        await updatePlan({ id: editingPlan.id, data: payload }).unwrap();
        toast.success("Plan updated successfully!");
      } else {
        await createPlan(payload).unwrap();
        toast.success("Plan created successfully!");
      }

      resetForm();
      setIsDialogOpen(false);
      refetch();
    } catch (error: unknown) {
      const err = error as ApiError;
      toast.error(
        err?.data?.message || err?.message || "Failed to submit plan",
      );
    }
  }, [
    editingPlan,
    newPlan,
    createPlan,
    updatePlan,
    validateForm,
    resetForm,
    refetch,
  ]);

  // --- Handle Delete ---
  const handleDeletePlan = useCallback((id: string) => {
    setPlanToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeletePlan = useCallback(async () => {
    if (!planToDelete) return;

    try {
      await deletePlan(planToDelete).unwrap();
      toast.success("Plan deleted successfully!");
      refetch();
    } catch (error: unknown) {
      const err = error as ApiError;
      toast.error(
        err?.data?.message || err?.message || "Failed to delete plan",
      );
    } finally {
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  }, [planToDelete, deletePlan, refetch]);

  // --- Input Handling ---
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;
      const newValue = type === "checkbox" ? checked : value;

      setNewPlan((prev) => ({
        ...prev,
        [name]:
          name === "price" ? (value === "" ? "" : Number(value)) : newValue,
      }));

      if (validationErrors[name as keyof typeof validationErrors]) {
        setValidationErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [validationErrors],
  );

  // --- Feature Handling ---
  const addFeature = useCallback(() => {
    if (!newFeature.trim()) return;
    setNewPlan((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature("");
  }, [newFeature]);

  const removeFeature = useCallback((index: number) => {
    setNewPlan((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  }, []);

  const openEditDialog = useCallback((plan: Plan) => {
    setEditingPlan(plan);
    setNewPlan({
      name: plan.name,
      price: plan.price,
      plan_duration: plan.plan_duration,
      is_active: plan.is_active,
      features: [...plan.features],
    });
    setIsDialogOpen(true);
  }, []);

  const openFeatureModal = useCallback((features: string[]) => {
    setActiveFeatures(features);
    setFeatureModalOpen(true);
  }, []);

  return (
    <div className="mx-auto w-full font-sans">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Title title="Provider Plan" />
        <button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-secondary-dark hover:bg-secondary-light flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <Plus className="h-5 w-5" /> Add New Plan
        </button>
      </div>

      {/* Add/Edit Plan Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-3xl font-bold text-gray-800">
              {editingPlan ? "Edit Plan" : "Add New Plan"}
            </h2>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Plan Name
                </label>
                <input
                  name="name"
                  value={newPlan.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={newPlan.price}
                  onChange={handleInputChange}
                  min={0}
                  step={0.01}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                />
                {validationErrors.price && (
                  <p className="mt-1 text-sm text-red-500">
                    {validationErrors.price}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Plan Duration
                </label>
                <select
                  name="plan_duration"
                  value={newPlan.plan_duration}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>

              {/* Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={newPlan.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-secondary-dark focus:ring-secondary-dark"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              {/* Features */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Features
                </label>
                <div className="mb-3 flex gap-2">
                  <input
                    placeholder="Enter feature name"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                  <button
                    onClick={addFeature}
                    disabled={!newFeature.trim()}
                    className="bg-secondary-dark hover:bg-secondary-light flex cursor-pointer items-center justify-center rounded-lg px-3 text-white transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {newPlan.features.map((f, i) => (
                  <div
                    key={i}
                    className="mb-1 flex items-center justify-between rounded-lg bg-gray-100 px-3 py-1 text-gray-800"
                  >
                    <span>{f}</span>
                    <button
                      onClick={() => removeFeature(i)}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(false);
                }}
                className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2 text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPlan}
                disabled={
                  !newPlan.name ||
                  newPlan.price === "" ||
                  Number(newPlan.price) < 0 ||
                  (editingPlan ? isUpdating : isCreating)
                }
                className="bg-secondary-dark hover:bg-secondary-light flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                {(editingPlan ? isUpdating : isCreating) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {editingPlan ? "Update Plan" : "Add Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features Modal */}
      {featureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold">Plan Features</h3>
            <ul className="space-y-2">
              {activeFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFeatureModalOpen(false)}
                className="rounded border px-4 py-2 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plans Table */}
      <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">Duration</th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">Features</th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-sm text-gray-500">
                    <PageLoader />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-red-500">
                    Error loading plans.{" "}
                    <button onClick={refetch} className="text-blue-600 underline">
                      Try again
                    </button>
                  </td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-sm text-gray-600">
                    No plans found.
                  </td>
                </tr>
              ) : (
                plans.map((plan: Plan) => (
                  <tr key={plan.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {plan.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {plan.plan_duration}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      €{plan.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <button
                        onClick={() => openFeatureModal(plan.features)}
                        className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
                      >
                        View Features ({plan.features.length})
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {plan.is_active ? "Active" : "Inactive"}
                    </td>
                    <td className="flex space-x-2 px-6 py-4">
                      <button
                        onClick={() => openEditDialog(plan)}
                        className="flex cursor-pointer items-center justify-center rounded-md bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                      >
                        <FaRegEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="flex cursor-pointer items-center justify-center rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                      >
                        {isDeleting && planToDelete === plan.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
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

      {/* Delete Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <h3 className="mb-4 text-2xl font-semibold text-gray-800">
              Confirm Deletion
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this subscription plan? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
                className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePlan}
                disabled={isDeleting}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
              >
                {isDeleting && <Loader2 className="h-5 w-5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




// import { useState, useCallback } from "react";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { Plus, X, Loader2, Check } from "lucide-react";
// import toast from "react-hot-toast";

// import Title from "@/components/Shared/Title";
// import PageLoader from "@/components/Shared/PageLoader";

// import type {
//   Feature,
//   Plan,
//   PlanFormData,
// } from "@/redux/types/adminProviderPlan.type";
// import {
//   useCreateAdminProviderPlanMutation,
//   useDeleteAdminProviderPlanMutation,
//   useGetAdminProviderPlansQuery,
//   useUpdateAdminProviderPlanMutation,
// } from "@/redux/features/adminProviderPlan/adminProviderPlanApi";

// interface ApiError {
//   data?: { message?: string };
//   message?: string;
// }

// type PlanFormState = Omit<PlanFormData, "price"> & { price: number | "" };

// export default function ProviderPlan() {
//   // --- State ---
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [planToDelete, setPlanToDelete] = useState<string | null>(null);
//   const [featureModalOpen, setFeatureModalOpen] = useState(false);
//   const [activeFeatures, setActiveFeatures] = useState<Feature[]>([]);
//   const [validationErrors, setValidationErrors] = useState({
//     name: "",
//     price: "",
//   });

//   const [newPlan, setNewPlan] = useState<PlanFormState>({
//     name: "",
//     price: "",
//     plan_duration: "MONTHLY",
//     is_active: true,
//     features: [],
//   });

//   const [newFeature, setNewFeature] = useState<Feature>({
//     name: "",
//     limit: "",
//   });

//   // --- API Hooks ---
//   const {
//     data: plansResponse,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetAdminProviderPlansQuery();
//   const plans = plansResponse?.data || [];

//   const [createPlan, { isLoading: isCreating }] =
//     useCreateAdminProviderPlanMutation();
//   const [updatePlan, { isLoading: isUpdating }] =
//     useUpdateAdminProviderPlanMutation();
//   const [deletePlan, { isLoading: isDeleting }] =
//     useDeleteAdminProviderPlanMutation();

//   // --- Validation ---
//   const validateForm = useCallback(() => {
//     const errors = { name: "", price: "" };
//     let isValid = true;

//     if (!newPlan.name.trim()) {
//       errors.name = "Plan name is required";
//       isValid = false;
//     }

//     if (newPlan.price === "" || Number(newPlan.price) < 0) {
//       errors.price = "Price must be 0 or greater";
//       isValid = false;
//     }

//     setValidationErrors(errors);
//     return isValid;
//   }, [newPlan]);

//   // --- Reset Form ---
//   const resetForm = useCallback(() => {
//     setNewPlan({
//       name: "",
//       price: "",
//       plan_duration: "MONTHLY",
//       is_active: true,
//       features: [],
//     });
//     setEditingPlan(null);
//     setNewFeature({ name: "", limit: "" });
//     setValidationErrors({ name: "", price: "" });
//   }, []);

//   // --- Handle Create / Update ---
//   const handleSubmitPlan = useCallback(async () => {
//     if (!validateForm()) return;

//     const payload: PlanFormData = {
//       ...newPlan,
//       price: Number(newPlan.price),
//       features: newPlan.features.filter((f) => f.name.trim() !== ""),
//     };

//     try {
//       if (editingPlan) {
//         await updatePlan({ id: editingPlan.id, data: payload }).unwrap();
//         toast.success("Plan updated successfully!");
//       } else {
//         await createPlan(payload).unwrap();
//         toast.success("Plan created successfully!");
//       }

//       resetForm();
//       setIsDialogOpen(false);
//       refetch();
//     } catch (error: unknown) {
//       const err = error as ApiError;
//       toast.error(
//         err?.data?.message || err?.message || "Failed to submit plan",
//       );
//     }
//   }, [
//     editingPlan,
//     newPlan,
//     createPlan,
//     updatePlan,
//     validateForm,
//     resetForm,
//     refetch,
//   ]);

//   // --- Handle Delete ---
//   const handleDeletePlan = useCallback((id: string) => {
//     setPlanToDelete(id);
//     setDeleteDialogOpen(true);
//   }, []);

//   const confirmDeletePlan = useCallback(async () => {
//     if (!planToDelete) return;

//     try {
//       await deletePlan(planToDelete).unwrap();
//       toast.success("Plan deleted successfully!");
//       refetch();
//     } catch (error: unknown) {
//       const err = error as ApiError;
//       toast.error(
//         err?.data?.message || err?.message || "Failed to delete plan",
//       );
//     } finally {
//       setDeleteDialogOpen(false);
//       setPlanToDelete(null);
//     }
//   }, [planToDelete, deletePlan, refetch]);

//   // --- Input Handling ---
//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value, type, checked } = e.target as HTMLInputElement;
//       const newValue = type === "checkbox" ? checked : value;

//       setNewPlan((prev) => ({
//         ...prev,
//         [name]:
//           name === "price" ? (value === "" ? "" : Number(value)) : newValue,
//       }));

//       if (validationErrors[name as keyof typeof validationErrors]) {
//         setValidationErrors((prev) => ({ ...prev, [name]: "" }));
//       }
//     },
//     [validationErrors],
//   );

//   // --- Feature Handling ---
//   const addFeature = useCallback(() => {
//     if (!newFeature.name.trim()) return;
//     setNewPlan((prev) => ({
//       ...prev,
//       features: [...prev.features, { ...newFeature }],
//     }));
//     setNewFeature({ name: "", limit: "" });
//   }, [newFeature]);

//   const removeFeature = useCallback((index: number) => {
//     setNewPlan((prev) => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index),
//     }));
//   }, []);

//   const openEditDialog = useCallback((plan: Plan) => {
//     setEditingPlan(plan);
//     setNewPlan({
//       name: plan.name,
//       price: plan.price,
//       plan_duration: plan.plan_duration,
//       is_active: plan.is_active,
//       features: [...plan.features],
//     });
//     setIsDialogOpen(true);
//   }, []);

//   const openFeatureModal = useCallback((features: Feature[]) => {
//     setActiveFeatures(features);
//     setFeatureModalOpen(true);
//   }, []);

//   return (
//     <div className="mx-auto w-full font-sans">
//       {/* Header */}
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <Title title="ProviderPlan" />
//         <button
//           onClick={() => {
//             resetForm();
//             setIsDialogOpen(true);
//           }}
//           className="bg-secondary-dark hover:bg-secondary-light flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
//         >
//           <Plus className="h-5 w-5" /> Add New Plan
//         </button>
//       </div>

//       {/* Add/Edit Plan Modal */}
//       {isDialogOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
//             <h2 className="mb-6 text-3xl font-bold text-gray-800">
//               {editingPlan ? "Edit Plan" : "Add New Plan"}
//             </h2>

//             <div className="space-y-5">
//               {/* Name */}
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Plan Name
//                 </label>
//                 <input
//                   name="name"
//                   value={newPlan.name}
//                   onChange={handleInputChange}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
//                 />
//                 {validationErrors.name && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {validationErrors.name}
//                   </p>
//                 )}
//               </div>

//               {/* Price */}
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Price
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={newPlan.price}
//                   onChange={handleInputChange}
//                   min={0}
//                   step={0.01}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
//                 />
//                 {validationErrors.price && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {validationErrors.price}
//                   </p>
//                 )}
//               </div>

//               {/* Duration */}
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Plan Duration
//                 </label>
//                 <select
//                   name="plan_duration"
//                   value={newPlan.plan_duration}
//                   onChange={handleInputChange}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
//                 >
//                   <option value="MONTHLY">Monthly</option>
//                   <option value="YEARLY">Yearly</option>
//                 </select>
//               </div>

//               {/* Active */}
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name="is_active"
//                   checked={newPlan.is_active}
//                   onChange={handleInputChange}
//                   className="text-secondary-dark focus:ring-secondary-dark bg-secondary-dark h-4 w-4 rounded border-gray-300"
//                 />
//                 <label className="text-sm font-medium text-gray-700">
//                   Active
//                 </label>
//               </div>

//               {/* Features */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Features
//                 </label>
//                 <div className="mb-3 flex gap-2">
//                   <input
//                     placeholder="Feature name"
//                     value={newFeature.name}
//                     onChange={(e) =>
//                       setNewFeature((prev) => ({
//                         ...prev,
//                         name: e.target.value,
//                       }))
//                     }
//                     className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
//                   />
//                   <input
//                     placeholder="Limit"
//                     value={newFeature.limit}
//                     onChange={(e) =>
//                       setNewFeature((prev) => ({
//                         ...prev,
//                         limit: e.target.value,
//                       }))
//                     }
//                     className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
//                   />
//                   <button
//                     onClick={addFeature}
//                     disabled={!newFeature.name.trim()}
//                     className="bg-secondary-dark hover:bg-secondary-light flex cursor-pointer items-center justify-center rounded-lg px-3 text-white transition"
//                   >
//                     <Plus className="h-4 w-4" />
//                   </button>
//                 </div>

//                 {newPlan.features.map((f, i) => (
//                   <div
//                     key={i}
//                     className="mb-1 flex items-center justify-between rounded-lg bg-gray-100 px-3 py-1 text-gray-800"
//                   >
//                     <span>
//                       {f.name} ({f.limit})
//                     </span>
//                     <button
//                       onClick={() => removeFeature(i)}
//                       className="cursor-pointer text-red-500 hover:text-red-700"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 onClick={() => {
//                   resetForm();
//                   setIsDialogOpen(false);
//                 }}
//                 className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2 text-gray-700 transition hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitPlan}
//                 disabled={
//                   !newPlan.name ||
//                   newPlan.price === "" ||
//                   Number(newPlan.price) < 0 ||
//                   (editingPlan ? isUpdating : isCreating)
//                 }
//                 className="bg-secondary-dark hover:bg-secondary-light flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
//               >
//                 {(editingPlan ? isUpdating : isCreating) && (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 )}
//                 {editingPlan ? "Update Plan" : "Add Plan"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Features Modal */}
//       {featureModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
//             <h3 className="mb-4 text-xl font-bold">Plan Features</h3>
//             <ul className="space-y-2">
//               {activeFeatures.map((f, i) => (
//                 <li key={i} className="flex items-center gap-2">
//                   <Check className="h-4 w-4 text-green-500" /> {f.name} (
//                   {f.limit})
//                 </li>
//               ))}
//             </ul>
//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={() => setFeatureModalOpen(false)}
//                 className="rounded border px-4 py-2 hover:bg-gray-100"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Plans Table */}
//       <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
//         <div className="w-full overflow-x-auto">
//           <table className="w-full min-w-[800px]">
//             <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
//               <tr>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Name
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Duration
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Price
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Features
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Status
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-500">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading ? (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="p-6 text-center text-sm text-gray-500"
//                   >
//                     <PageLoader />
//                   </td>
//                 </tr>
//               ) : isError ? (
//                 <tr>
//                   <td colSpan={6} className="p-6 text-center text-red-500">
//                     Error loading plans.{" "}
//                     <button
//                       onClick={refetch}
//                       className="text-blue-600 underline"
//                     >
//                       Try again
//                     </button>
//                   </td>
//                 </tr>
//               ) : plans.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="p-6 text-center text-sm text-gray-600"
//                   >
//                     No plans found.
//                   </td>
//                 </tr>
//               ) : (
//                 plans.map((plan) => (
//                   <tr
//                     key={plan.id}
//                     className="border-b border-gray-100 hover:bg-gray-50"
//                   >
//                     <td className="px-6 py-4 text-sm font-semibold text-gray-900">
//                       {plan.name}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {plan.plan_duration}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       ${plan.price.toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       <button
//                         onClick={() => openFeatureModal(plan.features)}
//                         className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
//                       >
//                         View Features ({plan.features.length})
//                       </button>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {plan.is_active ? "Active" : "Inactive"}
//                     </td>
//                     <td className="flex space-x-2 px-6 py-4">
//                       <button
//                         onClick={() => openEditDialog(plan)}
//                         className="flex cursor-pointer items-center justify-center rounded-md bg-yellow-500 p-2 text-white hover:bg-yellow-600"
//                       >
//                         <FaRegEdit className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDeletePlan(plan.id)}
//                         className="flex cursor-pointer items-center justify-center rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
//                       >
//                         {isDeleting && planToDelete === plan.id ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <MdDelete className="h-4 w-4" />
//                         )}
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Delete Modal */}
//       {deleteDialogOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="relative w-full max-w-md scale-100 transform rounded-2xl bg-white p-8 shadow-xl">
//             <h3 className="mb-4 text-2xl font-semibold text-gray-800">
//               Confirm Deletion
//             </h3>
//             <p className="mb-6 text-gray-600">
//               Are you sure you want to delete this subscription plan? This
//               action cannot be undone.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setDeleteDialogOpen(false)}
//                 disabled={isDeleting}
//                 className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDeletePlan}
//                 disabled={isDeleting}
//                 className="flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
//               >
//                 {isDeleting && <Loader2 className="h-5 w-5 animate-spin" />}
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
