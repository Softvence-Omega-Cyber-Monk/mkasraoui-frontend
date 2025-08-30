import ServiceTable from "../components/Services/ServiceTable";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  title: string;
  description: string;
  packageInclusions: string;
  price: string;
  files: File[];
};

function Services() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange", // enables live validation for isValid
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
      setValue("files", [...selectedFiles, ...files]); // store in hook-form
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageAndVideoFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/"),
    );

    setSelectedFiles((prev) => [...prev, ...imageAndVideoFiles]);
    setValue("files", [...selectedFiles, ...imageAndVideoFiles]); // store in hook-form
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Final Submit
  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <div>
      <ServiceTable />
      {/* from start here  */}
      <div className="mt-8">
        <div className="w-full rounded-lg">
          {/* Header */}
          <h1 className="mb-8 text-2xl font-semibold text-gray-900">
            Add/Edit Service
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Title Field */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-[#121417]"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter service title"
                  {...register("title", { required: "Title is required" })}
                  className="w-full rounded-xl border border-[#DBE0E5] bg-[#FFFFFF] px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-[#121417]"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full resize-none rounded-xl border border-[#DBE0E5] bg-[#FFFFFF] px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Package Inclusions Field */}
              <div>
                <label
                  htmlFor="packageInclusions"
                  className="mb-2 block text-sm font-medium text-[#121417]"
                >
                  Package Inclusions
                </label>
                <input
                  type="text"
                  id="packageInclusions"
                  placeholder="List package inclusions"
                  {...register("packageInclusions", {
                    required: "Package inclusions are required",
                  })}
                  className="w-full rounded-xl border border-[#DBE0E5] bg-[#FFFFFF] px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.packageInclusions && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.packageInclusions.message}
                  </p>
                )}
              </div>

              {/* Price Field */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-[#121417]"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  placeholder="Enter price"
                  {...register("price", {
                    valueAsNumber: true,
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  className="w-full rounded-xl border border-[#DBE0E5] bg-[#FFFFFF] px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Photos/Videos Upload Area */}
              <div className="mt-10">
                <div
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                    isDragOver
                      ? "border-blue-400 bg-blue-50"
                      : "border-[#DBE0E5] hover:border-gray-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleUploadClick}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <h2 className="pt-4 text-lg font-bold text-[#121417]">
                      Photos/Videos
                    </h2>
                    <div>
                      <p className="mb-2 text-sm text-gray-600">
                        Drag and drop or browse to upload photos and videos
                      </p>
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="mt-4 mb-4 cursor-pointer rounded-xl border border-[#DBE0E5] bg-[#F0F2F5] px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Selected files:
                    </p>
                    <ul className="space-y-1">
                      {selectedFiles.map((file, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                          MB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="submit"
                disabled={!isValid}
                className={`cursor-pointer rounded-xl px-6 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                  isValid
                    ? "hover:bg-secondary-dark bg-[#0D80F2] text-white"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                } `}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => console.log("Cancel clicked")}
                className="hover:bg-secondary-dark cursor-pointer rounded-xl border border-[#DBE0E5] bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Services;
