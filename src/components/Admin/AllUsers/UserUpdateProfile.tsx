import user from "@/assets/profile-user.png";
import { useForm } from "react-hook-form";

type FormData = {
  fullName: string;
  email: string;
  phone: number;
  postalCode: string;
};

function UserUpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Updated Profile Data:", data);
  };

  return (
    <div className="w-full rounded-2xl border-2 border-[#DFE1E6] bg-white md:max-w-lg">
      <div className="p-6 pb-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Profile Information
        </h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 p-6 pt-0">
          {/* Profile Avatar + Basic Info */}
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border border-gray-200">
              <img
                src={user}
                alt="Profile Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid gap-1">
              <div className="text-lg font-medium whitespace-nowrap text-gray-900">
                Sarah Johnson
              </div>
              <div className="text-sm text-gray-500">
                Member since January 2024
              </div>
              <span className="inline-block w-full rounded-md bg-[#C5FFD9] px-2 py-2 text-center text-xs font-medium whitespace-nowrap text-[#39B42E] md:w-1/2">
                Pro Member
              </span>
            </div>
          </div>

          {/* Full Name */}
          <div className="grid gap-2">
            <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              placeholder="Enter Full Name"
              {...register("fullName", {
                required: "Full name is required",
              })}
              className="flex h-10 w-full rounded-md border border-[#C6CAD1] bg-white px-3 py-3 text-sm text-[#00000099] placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              type="text"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              placeholder="Enter Your Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              className="flex h-10 w-full rounded-md border border-[#C6CAD1] bg-white px-3 py-3 text-sm text-[#00000099] placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              type="email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="grid gap-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              placeholder="Enter phone number"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Phone must be a number",
                },
              })}
              className="flex h-10 w-full rounded-md border border-[#C6CAD1] bg-white px-3 py-3 text-sm text-[#00000099] placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Postal Address */}
          <div className="grid gap-2">
            <label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
              Postal Address
            </label>
            <input
              id="postalCode"
              placeholder="Full Postal Address Here"
              {...register("postalCode", {
                required: "Postal address is required",
              })}
              className="flex h-10 w-full rounded-md border border-[#C6CAD1] bg-white px-3 py-3 text-sm text-[#00000099] placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              type="text"
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-[#223B7D] px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[#2C4890]/90"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserUpdateProfile;
