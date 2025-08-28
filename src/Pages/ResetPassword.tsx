/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// ✅ Zod Schema
const schema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

function ResetPassword() {
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  //   const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange", //  real-time validation
  });

  // ✅ Submit handler
  const onSubmit = async (data: FormData) => {
    console.log(data);
    // if (!token) {
    //   console.error("No token found in URL");
    //   Swal.fire({
    //     icon: "error",
    //     title: "Error",
    //     text: "No token found in URL!",
    //   });
    //   return;
    // }

    // try {
    //   const res = await fetch(
    //     "https://lachlanreid-covermate-nestjs-ywn6.onrender.com/api/v1/auth/reset-password",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         token: token,
    //         password: data.password,
    //       }),
    //     },
    //   );

    //   if (res.ok) {
    //     Swal.fire({
    //       icon: "success",
    //       title: "Success",
    //       text: "Password reset successfully!",
    //       timer: 2000,
    //       showConfirmButton: false,
    //     });
    //     navigate("/login"); // Navigate after success
    //   } else {
    //     const errorData = await res.json();
    //     Swal.fire({
    //       icon: "error",
    //       title: "Error",
    //       text: errorData.message || "Failed to reset password",
    //     });
    //   }
    // } catch (error: any) {
    //   console.error("Error resetting password:", error);
    //   Swal.fire({
    //     icon: "error",
    //     title: "Error",
    //     text: error.message || "Something went wrong",
    //   });
    // }
  };

  return (
    <div>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md px-6 md:px-0">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-semibold text-gray-900">
              Reset Password?
            </h1>
            <p className="text-sm leading-relaxed text-gray-600">
              Please enter a new password & confirm to reset your password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#1D2028]"
              >
                New Password <span className="text-[#1D2028]">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  {...register("password")}
                  className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 transform cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-[#1D2028]"
              >
                Confirm Password <span className="text-[#1D2028]">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 transform cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                isSubmitting ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <DotSpinner size={20} speed={0.9} color="white" />
                  <span>Reseting</span>
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
