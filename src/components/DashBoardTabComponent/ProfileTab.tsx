import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useGetMeQuery, useUpdateUserMutation } from "@/redux/features/user/userApi";
import toast from "react-hot-toast";

type FormInputs = {
  name: string;
  phone: string;
  file?: FileList;
};

function ProfileTab() {
  // Fetch logged-in user data
  const { data: userData, isLoading } = useGetMeQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    values: {
      name: userData?.name || "",
      phone: userData?.phone || "",
    },
  });

  const onSubmit = async (data: FormInputs) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      if (data.file && data.file.length > 0) {
        formData.append("files", data.file[0]);
      }

      await updateUser(formData).unwrap();
      toast.success("Profile updated successfully!")
    } catch (error: any) {
      toast.error("Failed to update");
    }
  };

  if (isLoading) return <p>Loading user data...</p>;

  const profileImage = userData?.profile_image
    ? userData.profile_image
    : "/default_user.webp";

  return (
    <div>
      <div className="flex flex-col items-start justify-center gap-6 p-4 md:p-6 lg:flex-row lg:p-8">
        {/* Profile Information Card */}
        <div className="w-full rounded-2xl border-2 border-[#DFE1E6] bg-white md:max-w-lg">
          <div className="p-6 pb-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Profile Information
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 p-6 pt-0">
              {/* Avatar + Basic Info */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border border-gray-200">
                  <img
                    src={profileImage}
                    alt={userData?.name || "User"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="grid gap-1">
                  <div className="text-lg font-medium whitespace-nowrap text-gray-900">
                    {userData?.name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">{userData?.email}</div>
                  <span className="inline-block w-full rounded-md bg-[#C5FFD9] px-2 py-2 text-center text-xs font-medium whitespace-nowrap text-[#39B42E]">
                    {userData?.subscription?.[0]?.plan_name || "Free Member"}
                  </span>
                </div>
              </div>

              {/* File Upload */}
              <div className="grid gap-2">
                <label
                  htmlFor="file"
                  className="text-sm font-medium text-gray-700"
                >
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="file"
                  {...register("file")}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-[#223B7D] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#2C4890]"
                />
              </div>

              {/* Full Name */}
              <div className="grid gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  placeholder="Enter Full Name"
                  {...register("name", { required: "Full name is required" })}
                  className="flex h-10 w-full rounded-md border border-[#C6CAD1] bg-white px-3 py-3 text-sm text-[#00000099] placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  type="text"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="grid gap-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  placeholder="Enter phone number"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[+0-9\s-]+$/,
                      message: "Invalid phone number",
                    },
                  })}
                  className="flex h-10 w-full rounded-md border border-[#C6CAD1] bg-white px-3 py-3 text-sm text-[#00000099] placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isUpdating}
                className="mt-2 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-[#223B7D] px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[#2C4890]/90 disabled:opacity-70"
              >
                {isUpdating ? "Updating..." : "Update Profile"}
              </button>

              <Link to="/auth/reset-password">
                <button className="inline-flex -mt-8 h-10 w-full cursor-pointer items-center justify-center rounded-md bg-[#223B7D] px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[#2C4890]/90">
                  Change Password
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileTab;


{/* <div className="w-full rounded-2xl border-2 border-[#DFE1E6] bg-white md:max-w-md">
          <div className="p-6 pb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Account Settings
            </h2>
          </div>
          <div className="grid gap-6 p-6 pt-0">
            <div className="grid gap-4">
              <div
                onClick={() => toggleSetting("emailNotifications")}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="grid gap-1">
                  <div className="font-medium text-gray-800">
                    Email Notifications
                  </div>
                  <div className="text-sm text-gray-500">
                    Receive party reminders and updates
                  </div>
                </div>
                {settings.emailNotifications ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#22C55E] text-lg text-white">
                    ✓
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-sm border border-gray-300 bg-white" />
                )}
              </div>

              <div
                onClick={() => toggleSetting("marketingEmails")}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="grid gap-1">
                  <div className="font-medium text-gray-800">
                    Marketing Emails
                  </div>
                  <div className="text-sm text-gray-500">
                    Get tips and special offers
                  </div>
                </div>
                {settings.marketingEmails ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#22C55E] text-lg text-white">
                    ✓
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-sm border border-gray-300 bg-white" />
                )}
              </div>

              <div
                onClick={() => toggleSetting("smsReminders")}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="grid gap-1">
                  <div className="font-medium text-gray-800">SMS Reminders</div>
                  <div className="text-sm text-gray-500">
                    Text reminders for important dates
                  </div>
                </div>
                {settings.smsReminders ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#22C55E] text-lg text-white">
                    ✓
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-sm border border-gray-300 bg-white" />
                )}
              </div>
            </div>
            <Link to="/auth/reset-password">
              <button className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-[#223B7D] px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[#2C4890]/90">
                Change Password
              </button>
            </Link>
            <button className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-[#FF5630] bg-transparent px-4 py-2 text-sm font-medium whitespace-nowrap text-[#EF4444] transition-colors hover:bg-[#EF4444]/5">
              Delete Account
            </button>
          </div>
        </div> */}
