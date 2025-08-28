// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import { Upload, ChevronDown, ArrowLeft, X, Check } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";

// function BecomeProvider() {
//   const {
//     register,
//     handleSubmit,
//     // formState: { errors, isSubmitting },
//   } = useForm();

//   // files state (your existing drag/drop logic can stay)
//   const [uploadedFiles, setUploadedFiles] = React.useState<any[]>([]);
//   const [isDragOver, setIsDragOver] = React.useState(false);

//   const navigate = useNavigate();

//   const onSubmit = (data: any) => {
//     console.log("Form submitted:", {
//       ...data,
//       uploadedFiles,
//     });
//     navigate("/dashboard");
//   };

//   // file handling helpers
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
//                   required
//                   {...register("businessName", { required: true })}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Contact Name */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Contact Name *
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="John Doe"
//                   required
//                   {...register("contactName", { required: true })}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   required
//                   placeholder="example@email.com"
//                   {...register("email", { required: true })}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Phone */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   required
//                   placeholder="+1 234 567 890"
//                   {...register("phone", { required: true })}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Service Category */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Service Category *
//                 </label>
//                 <div className="relative">
//                   <select
//                     {...register("serviceCategory", { required: true })}
//                     className="w-full appearance-none rounded-md border border-[#ADADAD] bg-white px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select</option>
//                     <option value="dj">DJ Services</option>
//                     <option value="catering">Catering</option>
//                     <option value="photography">Photography</option>
//                     <option value="decoration">Decoration</option>
//                     <option value="entertainment">Entertainment</option>
//                   </select>
//                   <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
//                 </div>
//               </div>

//               {/* Primary Service Area */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Primary Service Area *
//                 </label>
//                 <div className="relative">
//                   <select
//                     {...register("primaryServiceArea", { required: true })}
//                     className="w-full appearance-none rounded-md border border-[#ADADAD] bg-white px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select</option>
//                     <option value="new-york">New York</option>
//                     <option value="los-angeles">Los Angeles</option>
//                     <option value="chicago">Chicago</option>
//                     <option value="houston">Houston</option>
//                     <option value="phoenix">Phoenix</option>
//                   </select>
//                   <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
//                 </div>
//               </div>
//             </div>

//             {/* Service Description */}
//             <div className="mt-6">
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Service Description *
//               </label>
//               <textarea
//                 rows={4}
//                 {...register("serviceDescription", { required: true })}
//                 placeholder="Describe your services..."
//                 className="w-full resize-none rounded-md border border-[#ADADAD] px-3 py-2 focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Price Range */}
//             <div className="mt-6">
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Price Range *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. $100-300"
//                 {...register("priceRange", { required: true })}
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//               />
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
//             <div className="mb-6">
//               <label className="mb-2 block text-sm font-medium text-gray-700">
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
//                   {...register("acceptTerms", { required: true })}
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
//             </div>

//             {/* Submit Button */}
//             <div className="mt-8">
//               <button
//                 type="submit"
//                 className="bg-secondary hover:bg-secondary-dark w-full cursor-pointer rounded-lg px-4 py-3 font-medium text-white transition-colors"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       {/* footer  */}
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

//           {/* <div className="flex items-start gap-3">
//             <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
//             <p className="text-secondary text-base">
//               Once Confirmed, Your Party Service Is Booked!
//             </p>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BecomeProvider;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Upload, ChevronDown, ArrowLeft, X, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function BecomeProvider() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [uploadedFiles, setUploadedFiles] = React.useState<any[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log("Form submitted:", {
      ...data,
      uploadedFiles,
    });
    navigate("/dashboard");
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    const newFiles = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const formatFileSize = (size: number) => {
    return (size / 1024).toFixed(1) + " KB";
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Business Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Business Name *
                </label>
                <input
                  type="text"
                  placeholder="Sarah Johnson"
                  {...register("businessName", {
                    required: "Business Name is required",
                  })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-500">
                    {String(errors.businessName.message)}
                  </p>
                )}
              </div>

              {/* Contact Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Contact Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("contactName", {
                    required: "Contact Name is required",
                  })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.contactName && (
                  <p className="mt-1 text-sm text-red-500">
                    {String(errors.contactName.message)}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  {...register("email", { required: "Email is required" })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {String(errors.email.message)}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+1 234 567 890"
                  {...register("phone", {
                    required: "Phone Number is required",
                  })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {String(errors.phone.message)}
                  </p>
                )}
              </div>

              {/* Service Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Service Category *
                </label>
                <div className="relative">
                  <select
                    {...register("serviceCategory", {
                      required: "Service Category is required",
                    })}
                    className="w-full appearance-none rounded-md border border-[#ADADAD] bg-white px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="dj">DJ Services</option>
                    <option value="catering">Catering</option>
                    <option value="photography">Photography</option>
                    <option value="decoration">Decoration</option>
                    <option value="entertainment">Entertainment</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                </div>
                {errors.serviceCategory && (
                  <p className="mt-1 text-sm text-red-500">
                    {String(errors.serviceCategory.message)}
                  </p>
                )}
              </div>

              {/* Primary Service Area */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Primary Service Area *
                </label>
                <div className="relative">
                  <select
                    {...register("primaryServiceArea", {
                      required: "Primary Service Area is required",
                    })}
                    className="w-full appearance-none rounded-md border border-[#ADADAD] bg-white px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="new-york">New York</option>
                    <option value="los-angeles">Los Angeles</option>
                    <option value="chicago">Chicago</option>
                    <option value="houston">Houston</option>
                    <option value="phoenix">Phoenix</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                </div>
                {errors.primaryServiceArea && (
                  <p className="mt-1 text-sm text-red-500">
                    {String(errors.primaryServiceArea.message)}
                  </p>
                )}
              </div>
            </div>

            {/* Service Description */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Service Description *
              </label>
              <textarea
                rows={4}
                {...register("serviceDescription", {
                  required: "Service Description is required",
                })}
                placeholder="Describe your services..."
                className="w-full resize-none rounded-md border border-[#ADADAD] px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.serviceDescription && (
                <p className="mt-1 text-sm text-red-500">
                  {String(errors.serviceDescription.message)}
                </p>
              )}
            </div>

            {/* Price Range */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price Range *
              </label>
              <input
                type="text"
                placeholder="e.g. $100-300"
                {...register("priceRange", {
                  required: "Price Range is required",
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.priceRange && (
                <p className="mt-1 text-sm text-red-500">
                  {String(errors.priceRange.message)}
                </p>
              )}
            </div>

            {/* Website + Instagram */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Website (Optional)
                </label>
                <select
                  {...register("website")}
                  className="w-full appearance-none rounded-md border border-[#ADADAD] bg-white px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="website1">Website 1</option>
                  <option value="website2">Website 2</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Instagram (Optional)
                </label>
                <select
                  {...register("instagram")}
                  className="w-full appearance-none rounded-md border border-[#ADADAD] bg-white px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="instagram1">Instagram 1</option>
                  <option value="instagram2">Instagram 2</option>
                </select>
              </div>
            </div>

            {/* Upload Portfolio Images */}
            <div className="mt-8 mb-6">
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Upload Inspiration Images
              </label>
              <div
                className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() =>
                  (
                    document.getElementById("file-input") as HTMLInputElement
                  ).click()
                }
              >
                <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="mb-1 font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="mb-3 font-medium text-gray-700">
                    Uploaded Images ({uploadedFiles.length})
                  </p>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="group relative">
                        <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="mt-1 truncate text-xs text-gray-500">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="mt-6">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register("acceptTerms", {
                    required: "You must accept the terms",
                  })}
                  className="mt-1 h-4 w-4 rounded border-[#ADADAD] text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I accept the{" "}
                  <span className="text-blue-600 underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-600 underline">
                    Privacy Policy
                  </span>
                  *
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-500">
                  {String(errors.acceptTerms.message)}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-secondary hover:bg-secondary-dark w-full cursor-pointer rounded-lg px-4 py-3 font-medium text-white transition-colors"
              >
                Submit
              </button>
            </div>
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
}

export default BecomeProvider;
