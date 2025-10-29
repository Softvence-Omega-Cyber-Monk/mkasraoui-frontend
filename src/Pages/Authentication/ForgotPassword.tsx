import loginHeader from "@/assets/auth/loginHeader.png";
import partyKids from "@/assets/auth/partyKids-2.jpg";
import { Check, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useRequestResetCodeMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} from "@/redux/features/auth/authApi";

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "code" | "reset">("email");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "" });
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [requestResetCode, { isLoading: requesting }] =
    useRequestResetCodeMutation();
  const [verifyResetCode, { isLoading: verifying }] =
    useVerifyResetCodeMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Enter a valid email";
    return "";
  };

  // realtime validation
  const onEmailChange = (value: string) => {
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    setErrors({ email: emailError });
    if (emailError) return;

    try {
      await requestResetCode({ email }).unwrap();
      Swal.fire("Success", "Reset code sent to your email", "success");
      setStep("code");
    } catch (err) {
      console.log(err)
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code.trim()) {
      Swal.fire("Error", "Please enter the code", "error");
      return;
    }

    try {
      await verifyResetCode({ email, code }).unwrap();
      Swal.fire("Verified", "Code verified successfully", "success");
      setStep("reset");
    } catch (err) {
      console.log(err)
    }
  };

  const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters", "error");
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    try {
      await resetPassword({ email, password, confirmPassword }).unwrap();
      Swal.fire("Success", "Password has been reset", "success");
      setStep("email");
      setEmail("");
      setCode("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="relative flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <img
          src={loginHeader}
          alt="Decorations"
          className="pointer-events-none absolute top-0 left-0 z-0 w-full object-contain"
        />

        <div className="relative z-10 w-full max-w-md">
          <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">
            Forgot Password
          </h1>

          {step === "email" && (
            <>
              <p className="mb-6 text-center text-sm text-gray-600">
                Enter your email and we’ll send you a code to reset your password.
              </p>
              <form className="space-y-6" onSubmit={handleEmailSubmit}>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => onEmailChange(e.target.value)}
                      className={`w-full rounded-lg border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } py-3 pr-10 pl-10 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none`}
                    />
                    {email.trim() && !errors.email && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={requesting}
                  className="bg-secondary cursor-pointer hover:bg-secondary-dark w-full rounded-lg py-3 text-white shadow-lg transition disabled:opacity-70"
                >
                  {requesting ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            </>
          )}

          {step === "code" && (
            <form className="space-y-6" onSubmit={handleCodeSubmit}>
              <p className="mb-6 text-center text-sm text-gray-600">
                Enter the verification code sent to <strong>{email}</strong>.
              </p>
              <input
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 px-4"
              />
              <button
                type="submit"
                disabled={verifying}
                className="bg-secondary cursor-pointer hover:bg-secondary-dark w-full rounded-lg py-3 text-white shadow-lg transition disabled:opacity-70"
              >
                {verifying ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form className="space-y-6" onSubmit={handleResetSubmit}>
              <p className="mb-6 text-center text-sm text-gray-600">
                Enter a new password for your account.
              </p>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 px-4"
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 px-4"
              />
              <button
                type="submit"
                disabled={resetting}
                className="bg-secondary cursor-pointer hover:bg-secondary-dark w-full rounded-lg py-3 text-white shadow-lg transition disabled:opacity-70"
              >
                {resetting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Remembered your password?{" "}
            <Link
              to="/auth/login"
              className="text-secondary cursor-pointer font-medium hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="relative hidden lg:block lg:w-1/2">
        <img
          src={partyKids}
          alt="Party Kids"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
