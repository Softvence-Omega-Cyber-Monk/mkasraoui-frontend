import loginHeader from "@/assets/auth/loginHeader.png";
import partyKids from "@/assets/auth/partyKids-2.jpg";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useUserStore } from "@/store/useUserStore";
import { Check, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

type Errors = {
  email: string;
  password: string;
};

export default function Login() {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password");
  const [errors, setErrors] = useState<Errors>({ email: "", password: "" });

  // Validate a single field
  const validateField = (name: keyof Errors, value: string): string => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    if (name === "email") {
      // Basic email regex check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format";
    }
    return "";
  };

  // Validate all fields at once
  const validateAll = (): Errors => {
    return {
      email: validateField("email", email),
      password: validateField("password", password),
    };
  };

  // Handle input change with realtime validation
  const handleChange =
    (field: keyof Errors) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (field === "email") setEmail(value);
      if (field === "password") setPassword(value);

      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value),
      }));
    };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const newErrors = validateAll();
  setErrors(newErrors);

  const hasErrors = Object.values(newErrors).some((error) => error !== "");
  if (hasErrors) return;

  try {
    const res = await login({ email, password }).unwrap();

    // Save token and user info
    localStorage.setItem("access_token", res.data.accessToken);
    localStorage.setItem("userName", res.data.user.name);
    localStorage.setItem("userRole", res.data.user.role); // save role if needed

    toast.success("Login Successful");

    // Update global user state
    setUser(true);

    // Conditional redirect based on role
    const role = res.data.user.role;
    if (role === "ADMIN") {
      navigate("/admin-dashboard");
    } else if (role === "PROVIDER") {
      navigate("/dashboard");
    } else {
      navigate("/home/my-account");
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error?.data?.message || "Login failed");
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
        {/* Content */}
        <div className="relative z-10 w-full max-w-md">
          <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">
            Log In
          </h1>

          <form className="space-y-6" onSubmit={handleLogin}>
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
                  onChange={handleChange("email")}
                  className={`w-full rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handleChange("password")}
                  className={`w-full rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"
                    } py-3 pr-10 pl-10 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" className="rounded" />
                Remember Me
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-red-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-secondary hover:bg-secondary-dark w-full cursor-pointer rounded-lg py-3 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus:ring-4 focus:ring-blue-200"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-secondary font-medium hover:underline"
            >
              Register
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
