import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useGetMeQuery,
  useUpdateUserMutation,
} from "@/redux/features/user/userApi";
import { setSelectedUser } from "@/redux/features/user/userSlice";
import userPlaceholder from "@/assets/profile-user.png";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/redux/hooks/redux-hook";

type FormData = {
  name: string;
  phone: string;
  address: string;
  profileImage?: FileList;
};

const ProviderUpdateProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: me, isLoading } = useGetMeQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // Prefill form when user data loads
  useEffect(() => {
    if (me) {
      setValue("name", me.name || "");
      setValue("phone", me.phone || "");
      setValue("address", me.address || "");
      setPreview(me.profile_image || null);
    }
  }, [me, setValue]);

  // Show preview when selecting a new image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      if (data.profileImage && data.profileImage[0]) {
        formData.append("files", data.profileImage[0]);
      }

      const res = await updateUser(formData).unwrap();

      Swal.fire("Success", "Profile updated successfully!", "success");
      dispatch(setSelectedUser(res));
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.data?.message || "Failed to update profile",
        "error",
      );
    }
  };

  if (isLoading)
    return (
      <p className="mt-10 text-center text-gray-500">Loading profile...</p>
    );

  return (
    <div className="mx-auto mt-10 w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-100 transition-all duration-300 hover:shadow-2xl">
      <div className="border-b border-gray-100 p-6 pb-3">
        <h2 className="text-2xl font-semibold text-gray-800">
          {" "}
          Profile Update
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your provider profile information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 p-6 pt-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-blue-300 shadow-md">
            <img
              src={preview || userPlaceholder}
              alt="Profile Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              {...register("profileImage")}
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full cursor-pointer rounded-md border border-gray-300 p-2 text-sm text-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Name */}
        <div className="grid gap-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            {...register("name", { required: "Full name is required" })}
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email (read-only) */}
        <div className="grid gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email (cannot change)
          </label>
          <input
            id="email"
            value={me?.email}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 shadow-inner"
          />
        </div>

        {/* Phone */}
        <div className="grid gap-1">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            id="phone"
            {...register("phone", {
              required: "Phone is required",
              pattern: { value: /^[0-9+]+$/, message: "Invalid phone number" },
            })}
            placeholder="+1234567890"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="grid gap-1">
          <label
            htmlFor="address"
            className="text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            id="address"
            {...register("address")}
            placeholder="Enter your address"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isUpdating}
          className="mt-4 w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#223B7D] to-[#0a34a5] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProviderUpdateProfile;
