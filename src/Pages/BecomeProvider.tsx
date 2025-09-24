import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  Globe,
  Instagram,
  Check,
  ArrowLeft,
} from "lucide-react";
import { useRequestProviderMutation } from "@/redux/features/property/propertyApi";

type FormValues = {
  businessName: string;
  email: string;
  contactName: string;
  phone: string;
  serviceCategory: string;
  primaryServiceArea: string;
  serviceDescription: string;
  priceRange: string;
  website?: string;
  instagram?: string;
};

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  preview: string;
  file: File;
};

const BecomeProvider = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [requestProvider, { isLoading }] = useRequestProviderMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file),
        file,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      file,
    }));
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };
  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      // Create payload exactly as backend expects
      const payload: Record<string, unknown> = {
        bussinessName: data.businessName,
        email: data.email,
        contactName: data.contactName,
        phone: data.phone,
        serviceCategory: [data.serviceCategory],
        serviceArea: data.primaryServiceArea,
        latitude: 40.7128,
        longitude: -74.006,
        description: data.serviceDescription,
        priceRange: data.priceRange,
        website: data.website || null,
        instagram: data.instagram || null,
      };

      // Append JSON payload as a string
      formData.append("data", JSON.stringify(payload));
      console.log(payload);
      console.log(formData);

      // Append all uploaded files
      uploadedFiles.forEach((file) => {
        formData.append("files", file.file);
      });

      const res = await requestProvider(formData).unwrap();
      console.log("✅ Provider request submitted successfully", res);

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Failed to submit provider request:", err);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-3 xl:px-0">
      <header className="mb-1">
        <Link to={"/home/providers"} className="flex items-center gap-2">
          <ArrowLeft />
          Back to Providers
        </Link>
      </header>
      <div className="py-6">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-blue-900">
              Become a Party Provider
            </h1>
            <p className="text-gray-600">
              Join our network of trusted party professionals and grow your
              business!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Name */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center font-medium text-gray-700">
                  <Briefcase className="text-secondary mr-2 h-5 w-5" /> Business
                  Name
                </label>
                <input
                  type="text"
                  {...register("businessName", {
                    required: "Business name is required",
                  })}
                  className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.businessName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 flex items-center font-medium text-gray-700">
                  <Mail className="text-secondary mr-2 h-5 w-5" /> Email
                </label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Contact Name */}
              <div>
                <label className="mb-2 flex items-center font-medium text-gray-700">
                  <FileText className="text-secondary mr-2 h-5 w-5" /> Contact
                  Name
                </label>
                <input
                  type="text"
                  {...register("contactName", {
                    required: "Contact name is required",
                  })}
                  className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
                />
                {errors.contactName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.contactName.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 flex items-center font-medium text-gray-700">
                  <Phone className="text-secondary mr-2 h-5 w-5" /> Phone
                </label>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Service Category */}
              <div>
                <label className="mb-2 flex items-center font-medium text-gray-700">
                  <Briefcase className="text-secondary mr-2 h-5 w-5" /> Service
                  Category
                </label>
                <input
                  type="text"
                  {...register("serviceCategory", {
                    required: "Service category is required",
                  })}
                  className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
                />
                {errors.serviceCategory && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.serviceCategory.message}
                  </p>
                )}
              </div>

              {/* Primary Service Area */}
              <div>
                <label className="mb-2 flex items-center font-medium text-gray-700">
                  <MapPin className="text-secondary mr-2 h-5 w-5" /> Primary
                  Service Area
                </label>
                <input
                  type="text"
                  {...register("primaryServiceArea", {
                    required: "Primary service area is required",
                  })}
                  className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
                />
                {errors.primaryServiceArea && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.primaryServiceArea.message}
                  </p>
                )}
              </div>

              {/* Price Range */}
              <div>
                <label className="mb-2 flex items-center font-medium text-gray-700">
                  <DollarSign className="text-secondary mr-2 h-5 w-5" /> Price
                  Range
                </label>
                <input
                  type="text"
                  {...register("priceRange", {
                    required: "Price range is required",
                  })}
                  className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
                />
                {errors.priceRange && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.priceRange.message}
                  </p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="mb-2 flex items-center font-medium text-gray-700">
                  <Globe className="text-secondary mr-2 h-5 w-5" /> Website
                  (Optional)
                </label>
                <input
                  type="url"
                  {...register("website")}
                  className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="mb-2 flex items-center font-medium text-gray-700">
                  <Instagram className="text-secondary mr-2 h-5 w-5" />{" "}
                  Instagram (Optional)
                </label>
                <input
                  type="text"
                  {...register("instagram")}
                  className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
                />
              </div>
            </div>
            {/* Description */}
            <div>
              <label className="mb-2 flex items-center font-medium text-gray-700">
                <FileText className="text-secondary mr-2 h-5 w-5" /> Service
                Description
              </label>
              <textarea
                {...register("serviceDescription", {
                  required: "Description is required",
                })}
                className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
                rows={4}
              ></textarea>
              {errors.serviceDescription && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.serviceDescription.message}
                </p>
              )}
            </div>
            {/* File Upload */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Upload Portfolio Images
              </label>
              <div
                onClick={handleFileClick}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="hover:border-secondary hover:text-secondary flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-gray-500 transition"
              >
                <Upload className="mb-2 h-8 w-8" />
                <p>Drag and drop files here, or click to select files</p>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {/* Preview */}
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="relative overflow-hidden rounded-lg border"
                  >
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-32 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white shadow"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-secondary hover:bg-secondary-dark w-full cursor-pointer rounded-lg px-4 py-3 font-medium text-white transition-colors disabled:opacity-60"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
      {/* Footer */}
      <div className="mt-8 w-full rounded-lg bg-[#D2EAFF] p-6">
        <h2 className="text-secondary mb-4 text-2xl font-semibold">
          What Happens Next?
        </h2>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="text-secondary text-base">
              We'll review your application within 24-48 hours
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="text-secondary text-base">
              You'll receive an email with your provider dashboard access
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="text-secondary text-base">
              Start receiving booking requests from local families!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeProvider;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from "react";
// import { Upload, ChevronDown, ArrowLeft, X, Check } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";

// function BecomeProvider() {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm();

//   const [uploadedFiles, setUploadedFiles] = React.useState<any[]>([]);
//   const [isDragOver, setIsDragOver] = React.useState(false);
//   // const [isOpen, setIsOpen] = useState(false);

//   const navigate = useNavigate();

//   const [value, setLocalValue] = useState("");
//   // const [primaryValue, setPrimaryLocalValue] = useState("");
//   const [isOpen, setIsOpen] = useState<null | "service" | "primary">(null);

//   const options = [
//     { value: "", label: "Select" },
//     { value: "dj", label: "DJ Services" },
//     { value: "catering", label: "Catering" },
//     { value: "photography", label: "Photography" },
//     { value: "decoration", label: "Decoration" },
//     { value: "entertainment", label: "Entertainment" },
//   ];

//   const [primaryValue, setPrimaryValue] = useState("");
//   const primaryOptions = [
//     { value: "", label: "Select" },
//     { value: "new-york", label: "New York" },
//     { value: "los-angeles", label: "Los Angeles" },
//     { value: "chicago", label: "Chicago" },
//     { value: "houston", label: "Houston" },
//     { value: "phoenix", label: "Phoenix" },
//   ];

//   // change isOpen from boolean to string | null

//   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;
//     const newFiles = Array.from(files).map((file) => ({
//       id: Math.random().toString(36).substring(2, 9),
//       name: file.name,
//       size: file.size,
//       preview: URL.createObjectURL(file),
//     }));
//     setUploadedFiles((prev) => [...prev, ...newFiles]);
//   };

//   const removeFile = (id: string) => {
//     setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragOver(true);
//   };
//   const handleDragLeave = () => setIsDragOver(false);
//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     const files = e.dataTransfer.files;
//     const newFiles = Array.from(files).map((file) => ({
//       id: Math.random().toString(36).substring(2, 9),
//       name: file.name,
//       size: file.size,
//       preview: URL.createObjectURL(file),
//     }));
//     setUploadedFiles((prev) => [...prev, ...newFiles]);
//   };

//   const formatFileSize = (size: number) => {
//     return (size / 1024).toFixed(1) + " KB";
//   };

//   // handel submit fun
//   const onSubmit = (data: any) => {
//     console.log("Form submitted:", {
//       ...data,
//       uploadedFiles,
//     });
//     navigate("/dashboard");
//   };

//   return (
//     <div className="container mx-auto mt-10 px-3 xl:px-0">
//       <header className="mb-1">
//         <Link to={"/home/providers"} className="flex items-center gap-2">
//           <ArrowLeft />
//           Back to Providers
//         </Link>
//       </header>
//       <div className="py-6">
//         <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
//           {/* Header */}
//           <div className="mb-8 text-center">
//             <h1 className="mb-2 text-3xl font-bold text-blue-900">
//               Become a Party Provider
//             </h1>
//             <p className="text-gray-600">
//               Join our network of trusted party professionals and grow your
//               business!
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="">
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//               {/* Business Name */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Business Name *
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Sarah Johnson"
//                   {...register("businessName", {
//                     required: "Business Name is required",
//                     pattern: {
//                       value: /^[A-Za-z\s]*$/, // only letters and spaces
//                       message: "Only letters are allowed",
//                     },
//                   })}
//                   onInput={(e) => {
//                     e.currentTarget.value = e.currentTarget.value.replace(
//                       /[^A-Za-z\s]/g,
//                       "",
//                     );
//                   }}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {errors.businessName && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {String(errors.businessName.message)}
//                   </p>
//                 )}
//               </div>

//               {/* Contact Name */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Contact Name *
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="John Doe"
//                   {...register("contactName", {
//                     required: "Contact Name is required",
//                     pattern: {
//                       value: /^[A-Za-z\s]*$/, // only letters and spaces
//                       message: "Only letters are allowed",
//                     },
//                   })}
//                   onInput={(e) => {
//                     e.currentTarget.value = e.currentTarget.value.replace(
//                       /[^A-Za-z\s]/g,
//                       "",
//                     );
//                   }}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {errors.contactName && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {String(errors.contactName.message)}
//                   </p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="example@email.com"
//                   {...register("email", { required: "Email is required" })}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {String(errors.email.message)}
//                   </p>
//                 )}
//               </div>

//               {/* Phone */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   placeholder="+1 234 567 890"
//                   {...register("phone", {
//                     required: "Phone Number is required",
//                     pattern: {
//                       value: /^[0-9+ ]*$/, // only numbers, spaces, and + allowed
//                       message: "Only numbers are allowed",
//                     },
//                   })}
//                   onInput={(e) => {
//                     // allow only numbers, spaces, and plus sign
//                     e.currentTarget.value = e.currentTarget.value.replace(
//                       /[^0-9+ ]/g,
//                       "",
//                     );
//                   }}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {errors.phone && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {String(errors.phone.message)}
//                   </p>
//                 )}
//               </div>

//               {/* Service Category */}

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Service Category <span className="text-gray-700">*</span>
//                 </label>

//                 {/* Hidden input for react-hook-form */}
//                 <input
//                   type="hidden"
//                   {...register("serviceCategory", {
//                     required: "Service Category is required",
//                   })}
//                   value={value}
//                 />

//                 <div className="relative">
//                   {/* Custom trigger */}
//                   <div
//                     onClick={() =>
//                       setIsOpen(isOpen === "service" ? null : "service")
//                     }
//                     className="w-full cursor-pointer appearance-none rounded-md border border-[#ADADAD] bg-white px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500"
//                   >
//                     {value
//                       ? options.find((o) => o.value === value)?.label
//                       : "Select"}
//                     <ChevronDown className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
//                   </div>

//                   {/* Dropdown */}
//                   {isOpen === "service" && (
//                     <div className="absolute right-0 left-0 z-10 mt-1 rounded-md border border-gray-200 bg-white shadow-lg">
//                       <ul className="max-h-48 overflow-y-auto text-sm">
//                         {options.map((opt) => (
//                           <li
//                             key={opt.value}
//                             onClick={() => {
//                               setLocalValue(opt.value); // update local state for display
//                               setValue("serviceCategory", opt.value); // update react-hook-form
//                               setIsOpen(null); // close dropdown
//                             }}
//                             className="cursor-pointer px-3 py-2 hover:bg-blue-100"
//                           >
//                             {opt.label}
//                           </li>
//                         ))}
//                       </ul>
//                       <button
//                         type="button"
//                         onClick={() => setIsOpen(null)}
//                         className="bg-secondary-dark hover:bg-secondary w-full rounded-b-md px-4 py-2 text-sm font-medium text-white transition"
//                       >
//                         OK
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {errors.serviceCategory && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {String(errors.serviceCategory.message)}
//                   </p>
//                 )}
//               </div>

//               {/* Primary Service Area */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Primary Service Area *
//                 </label>

//                 {/* Hidden input for react-hook-form */}
//                 <input
//                   type="hidden"
//                   {...register("primaryServiceArea", {
//                     required: "Primary Service Area is required",
//                   })}
//                   value={primaryValue}
//                 />

//                 <div className="relative">
//                   <div
//                     onClick={() =>
//                       setIsOpen(isOpen === "primary" ? null : "primary")
//                     }
//                     className="w-full cursor-pointer appearance-none rounded-md border border-[#ADADAD] bg-white px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500"
//                   >
//                     {primaryValue
//                       ? primaryOptions.find((o) => o.value === primaryValue)
//                           ?.label
//                       : "Select"}
//                     <ChevronDown className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
//                   </div>

//                   {isOpen === "primary" && (
//                     <div className="absolute right-0 left-0 z-10 mt-1 rounded-md border border-gray-200 bg-white shadow-lg">
//                       <ul className="max-h-48 overflow-y-auto text-sm">
//                         {primaryOptions.map((opt) => (
//                           <li
//                             key={opt.value}
//                             onClick={() => {
//                               setPrimaryValue(opt.value); // local state
//                               setValue("primaryServiceArea", opt.value); // update form state
//                               setIsOpen(null); // close dropdown
//                             }}
//                             className="cursor-pointer px-3 py-2 hover:bg-blue-100"
//                           >
//                             {opt.label}
//                           </li>
//                         ))}
//                       </ul>
//                       <button
//                         type="button"
//                         onClick={() => setIsOpen(null)}
//                         className="bg-secondary-dark hover:bg-secondary w-full rounded-b-md px-4 py-2 text-sm font-medium text-white transition"
//                       >
//                         OK
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {errors.primaryServiceArea && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {String(errors.primaryServiceArea.message)}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Service Description */}
//             <div className="mt-6">
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Service Description *
//               </label>
//               <textarea
//                 rows={4}
//                 {...register("serviceDescription", {
//                   required: "Service Description is required",
//                 })}
//                 placeholder="Describe your services..."
//                 className="w-full resize-none rounded-md border border-[#ADADAD] px-3 py-2 focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.serviceDescription && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {String(errors.serviceDescription.message)}
//                 </p>
//               )}
//             </div>
//             {/* Price Range * */}

//             <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
//               <div className="">
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Price Range *
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="e.g. 100-300"
//                   {...register("priceRange", {
//                     required: "Price Range is required",
//                     pattern: {
//                       value: /^[0-9-]*$/, // only numbers and dash
//                       message: "Only numbers and '-' are allowed",
//                     },
//                   })}
//                   onInput={(e) => {
//                     e.currentTarget.value = e.currentTarget.value.replace(
//                       /[^0-9-]/g,
//                       "",
//                     );
//                   }}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {errors.priceRange && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {String(errors.priceRange.message)}
//                   </p>
//                 )}
//               </div>
//               {/* postal address here  */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Full Postal Address *
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter Your Full Postal Address"
//                   {...register("postalAddress", {
//                     required: "Postal Address is required",
//                   })}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {errors.postalAddress && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {String(errors.postalAddress.message)}
//                   </p>
//                 )}
//               </div>
//             </div>
//             {/* Website + Instagram */}
//             <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Website (Optional)
//                 </label>
//                 <select
//                   {...register("website")}
//                   className="w-full appearance-none rounded-md border border-[#ADADAD] bg-white px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select</option>
//                   <option value="website1">Website 1</option>
//                   <option value="website2">Website 2</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Instagram (Optional)
//                 </label>
//                 <select
//                   {...register("instagram")}
//                   className="w-full appearance-none rounded-md border border-[#ADADAD] bg-white px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select</option>
//                   <option value="instagram1">Instagram 1</option>
//                   <option value="instagram2">Instagram 2</option>
//                 </select>
//               </div>
//             </div>

//             {/* Upload Portfolio Images */}
//             <div className="mt-8 mb-6">
//               <label className="mb-3 block text-sm font-medium text-gray-700">
//                 Upload Inspiration Images
//               </label>
//               <div
//                 className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
//                   isDragOver
//                     ? "border-blue-400 bg-blue-50"
//                     : "border-gray-300 hover:border-gray-400"
//                 }`}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//                 onClick={() =>
//                   (
//                     document.getElementById("file-input") as HTMLInputElement
//                   ).click()
//                 }
//               >
//                 <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
//                 <p className="mb-1 font-medium text-gray-700">
//                   Click to upload or drag and drop
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   PNG, JPG, GIF up to 10MB each
//                 </p>
//                 <input
//                   id="file-input"
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleFileInput}
//                   className="hidden"
//                 />
//               </div>

//               {uploadedFiles.length > 0 && (
//                 <div className="mt-4">
//                   <p className="mb-3 font-medium text-gray-700">
//                     Uploaded Images ({uploadedFiles.length})
//                   </p>
//                   <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
//                     {uploadedFiles.map((file) => (
//                       <div key={file.id} className="group relative">
//                         <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
//                           <img
//                             src={file.preview}
//                             alt={file.name}
//                             className="h-full w-full object-cover"
//                           />
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => removeFile(file.id)}
//                           className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
//                         >
//                           <X className="h-4 w-4" />
//                         </button>
//                         <div className="mt-1 truncate text-xs text-gray-500">
//                           {file.name}
//                         </div>
//                         <div className="text-xs text-gray-400">
//                           {formatFileSize(file.size)}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Terms */}
//             <div className="mt-6">
//               <label className="flex items-start gap-3">
//                 <input
//                   type="checkbox"
//                   {...register("acceptTerms", {
//                     required: "You must accept the terms",
//                   })}
//                   className="mt-1 h-4 w-4 rounded border-[#ADADAD] text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="text-sm text-gray-700">
//                   I accept the{" "}
//                   <span className="text-blue-600 underline">
//                     Terms of Service
//                   </span>{" "}
//                   and{" "}
//                   <span className="text-blue-600 underline">
//                     Privacy Policy
//                   </span>
//                   *
//                 </span>
//               </label>
//               {errors.acceptTerms && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {String(errors.acceptTerms.message)}
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <div className="mt-8">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="bg-secondary hover:bg-secondary-dark w-full cursor-pointer rounded-lg px-4 py-3 font-medium text-white transition-colors"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-8 w-full rounded-lg bg-[#D2EAFF] p-6">
//         <h2 className="text-secondary mb-4 text-2xl font-semibold">
//           What Happens Next?
//         </h2>

//         <div className="space-y-3">
//           <div className="flex items-start gap-3">
//             <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
//             <p className="text-secondary text-base">
//               We'll review your application within 24-48 hours
//             </p>
//           </div>

//           <div className="flex items-start gap-3">
//             <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
//             <p className="text-secondary text-base">
//               You'll receive an email with your provider dashboard access
//             </p>
//           </div>

//           <div className="flex items-start gap-3">
//             <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
//             <p className="text-secondary text-base">
//               Start receiving booking requests from local families!
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BecomeProvider;
