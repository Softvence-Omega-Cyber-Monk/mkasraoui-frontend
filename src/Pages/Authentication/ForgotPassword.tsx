import loginHeader from "@/assets/auth/loginHeader.png";
import partyKids from "@/assets/auth/partyKids-2.jpg";
import { Check, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "" });
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Enter a valid email";
    return "";
  };

  // realtime validation on change
  const onEmailChange = (value: string) => {
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    setErrors({ email: emailError });

    if (emailError) return;

    // simulate API call / success
    setSubmitted(true);
    // TODO: call your forgot-password API here
    // e.g. await api.forgotPassword(email);
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

        {/* Content */}
        <div className="relative z-10 w-full max-w-md">
          <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">
            Forgot Password
          </h1>

          <p className="mb-6 text-center text-sm text-gray-600">
            Enter your email and we'll send you a link to reset your password.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
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

                {/* right-check icon (only when format is valid & no error) */}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={submitted}
              className={`bg-secondary hover:bg-secondary-dark w-full cursor-pointer rounded-lg py-3 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus:ring-4 focus:ring-blue-200 ${
                submitted ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {submitted ? "Link Sent" : "Send Reset Link"}
            </button>

            {/* Success message */}
            {submitted && (
              <p className="mt-3 text-center text-sm text-green-600">
                If an account exists for that email, a reset link has been sent.
              </p>
            )}
          </form>

          {/* Back to Login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Remembered your password?{" "}
            <Link
              to="/auth/login"
              className="text-secondary font-medium hover:underline"
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
