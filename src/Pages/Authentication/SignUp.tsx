import loginHeader from "@/assets/auth/loginHeader.png";
import partyKids from "@/assets/auth/partyKids-2.jpg";
import { Check, Eye, EyeOff, Lock, Mail, Phone, User, X } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiPostOffice } from "react-icons/gi";

import { DownArrow } from "@/components/Icons";
import { countryCodes } from "@/utils/countryCodes";

type FormData = {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
  postalCode: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    countryCode: "+880",
    phone: "",
    password: "",
    confirmPassword: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Validation functions
  const validateName = (name: string): string => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name))
      return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return "Phone number is required";
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phone)) return "Phone number can only contain digits";
    if (phone.length < 6 || phone.length > 15)
      return "Phone number must be 6-15 digits";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password))
      return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(password))
      return "Password must contain at least one special character";
    return "";
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string,
  ): string => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const getPasswordStrength = (
    password: string,
  ): { level: "weak" | "medium" | "strong"; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&])/.test(password)) strength++;

    if (strength <= 2) return { level: "weak", color: "bg-red-500" };
    if (strength <= 3) return { level: "medium", color: "bg-yellow-500" };
    return { level: "strong", color: "bg-green-500" };
  };

  const validatePostalCode = (postalCode: string): string => {
    if (!postalCode.trim()) return "Postal address is required";
    if (postalCode.trim().length < 5)
      return "Postal address must be at least 5 characters";
    return "";
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate the changed field in real-time and update errors accordingly
    let errorMessage = "";
    switch (field) {
      case "name":
        errorMessage = validateName(value);
        break;
      case "email":
        errorMessage = validateEmail(value);
        break;
      case "phone":
        errorMessage = validatePhone(value);
        break;
      case "password":
        errorMessage = validatePassword(value);

        // Also re-validate confirmPassword if password changes
        if (formData.confirmPassword) {
          const confirmPasswordError = validateConfirmPassword(
            formData.confirmPassword,
            value,
          );
          setErrors((prev) => ({
            ...prev,
            confirmPassword: confirmPasswordError,
          }));
        }
        break;
      case "confirmPassword":
        errorMessage = validateConfirmPassword(value, formData.password);
        break;
      case "postalCode": // 👈 add this
        errorMessage = validatePostalCode(value);
    }

    setErrors((prev) => ({
      ...prev,
      [field]: errorMessage,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.confirmPassword,
        formData.password,
      ),
      postalCode: validatePostalCode(formData.postalCode),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Account created successfully!");

      setFormData({
        name: "",
        email: "",
        countryCode: "+880",
        phone: "",
        password: "",
        confirmPassword: "",
        postalCode: "",
      });
      console.log(formData);
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
      // todo: have to be fixed during api integration
      navigate("/auth/login");
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="flex h-full max-h-screen min-h-screen bg-gray-50">
      {/* Left Side */}
      <div className="relative flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2">
        {/* Decorative header */}
        <img
          src={loginHeader}
          alt="Decorations"
          className="pointer-events-none absolute top-0 left-0 z-0 h-auto w-full object-contain"
        />

        {/* Content */}
        <div className="relative z-10 mt-12 w-full max-w-md xl:mt-0">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Create Account
            </h1>
            <p className="text-gray-600">Join us today and get started!</p>
          </div>

          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("name", e.target.value)
                  }
                  placeholder="Enter your full name"
                  className={`w-full rounded-lg border py-3 pr-4 pl-10 transition-all duration-200 focus:ring-2 focus:outline-none ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                />
                {formData.name && !errors.name && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
              {errors.name && (
                <p className="mt-1 flex items-center text-sm text-red-600">
                  <X className="mr-1 h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("email", e.target.value)
                  }
                  placeholder="Enter your email address"
                  className={`w-full rounded-lg border py-3 pr-4 pl-10 transition-all duration-200 focus:ring-2 focus:outline-none ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                />
                {formData.email && !errors.email && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 flex items-center text-sm text-red-600">
                  <X className="mr-1 h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Phone Number *
              </label>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={formData.countryCode}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleInputChange("countryCode", e.target.value)
                    }
                    className="min-w-[100px] appearance-none rounded-lg border border-gray-300 bg-white px-3 py-3 pr-8 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <DownArrow />
                  </div>
                </div>
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("phone", e.target.value)
                    }
                    placeholder="Enter phone number"
                    className={`w-full rounded-lg border py-3 pr-4 pl-10 transition-all duration-200 focus:ring-2 focus:outline-none ${
                      errors.phone
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                  {formData.phone && !errors.phone && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
              </div>
              {errors.phone && (
                <p className="mt-1 flex items-center text-sm text-red-600">
                  <X className="mr-1 h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Create a strong password"
                  className={`w-full rounded-lg border py-3 pr-12 pl-10 transition-all duration-200 focus:ring-2 focus:outline-none ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 flex-1 rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{
                          width:
                            passwordStrength.level === "weak"
                              ? "33%"
                              : passwordStrength.level === "medium"
                                ? "66%"
                                : "100%",
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 capitalize">
                      {passwordStrength.level}
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 flex items-center text-sm text-red-600">
                  <X className="mr-1 h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm your password"
                  className={`w-full rounded-lg border py-3 pr-12 pl-10 transition-all duration-200 focus:ring-2 focus:outline-none ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                {formData.confirmPassword &&
                  !errors.confirmPassword &&
                  formData.confirmPassword === formData.password && (
                    <div className="absolute inset-y-0 right-8 flex items-center pr-3">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  )}
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 flex items-center text-sm text-red-600">
                  <X className="mr-1 h-3 w-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            {/* postal code  */}
            <div className="relative flex-1">
              <label
                htmlFor="postalCode"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Postal Address <span className="text-red-500">*</span>
              </label>

              {/* Left Icon */}
              <div className="absolute top-9 left-0 flex items-center pl-3">
                <GiPostOffice className="h-5 w-5 text-gray-400" />
              </div>

              {/* Input Field */}
              <input
                id="postalCode"
                type="text"
                required
                value={formData.postalCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("postalCode", e.target.value)
                }
                placeholder="Enter your full postal address"
                className={`w-full rounded-lg border px-10 py-2.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none ${
                  errors.postalCode
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />

              {/* Success Icon */}
              {formData.postalCode && !errors.postalCode && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              )}

              {/* Error Message */}
              {errors.postalCode && (
                <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full cursor-pointer rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 ${
                isSubmitting
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-secondary hover:bg-secondary-dark transform shadow-lg hover:-translate-y-0.5 hover:shadow-xl focus:ring-4 focus:ring-blue-200"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to={"/auth/login"}
                className="text-secondary font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
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
