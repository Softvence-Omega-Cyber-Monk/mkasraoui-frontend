import { ArrowLeft, Check, ChevronDown, Upload, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function RequestQuote() {
  const [formData, setFormData] = useState({
    yourName: "",
    emailAddress: "",
    phoneNumber: "",
    birthdayChildName: "",
    ageTurning: "",
    partyDate: "",
    partyTime: "",
    numberOfGuests: "",
    partyTheme: "",
    partyLocation: "",
    serviceType: "",
    budgetRange: "",
    specialRequests: "",
    acceptTerms: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<Partial<FormField>>({});

  interface FormField {
    yourName: string;
    emailAddress: string;
    phoneNumber: string;
    birthdayChildName: string;
    ageTurning: string;
    partyDate: string;
    partyTime: string;
    numberOfGuests: string;
    partyTheme: string;
    partyLocation: string;
    serviceType: string;
    budgetRange: string;
    specialRequests: string;
    acceptTerms: boolean;
  }

  const handleInputChange = (
    field: keyof FormField,
    value: FormField[keyof FormField],
  ): void => {
    setFormData((prev: FormField) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file): file is File => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    const newFiles = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  interface FileInputEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & {
      files: FileList | null;
    };
  }

  const handleFileInput = (e: FileInputEvent): void => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  interface UploadedFile {
    id: number;
    file: File;
    name: string;
    size: number;
    preview: string;
  }

  const removeFile = (fileId: number): void => {
    setUploadedFiles((prev: UploadedFile[]) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const handleSubmit = () => {
    const newErrors: Partial<FormField> = {};

    if (!formData.yourName.trim()) newErrors.yourName = "Your Name is required";
    if (!formData.emailAddress.trim())
      newErrors.emailAddress = "Email is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.birthdayChildName.trim())
      newErrors.birthdayChildName = "Child's name is required";
    if (!formData.ageTurning) newErrors.ageTurning = "Age is required";
    if (!formData.partyDate) newErrors.partyDate = "Party date is required";
    if (!formData.numberOfGuests)
      newErrors.numberOfGuests = "Number of guests is required";
    if (!formData.partyLocation.trim())
      newErrors.partyLocation = "Location is required";
    if (!formData.serviceType)
      newErrors.serviceType = "Service type is required";
    if (!formData.partyTheme.trim())
      newErrors.partyTheme = "Party Theme is required";
    if (!formData.budgetRange)
      newErrors.budgetRange = "Budget range is required";
    if (!formData.specialRequests.trim())
      newErrors.specialRequests = "Special requests are required";
    // if (!formData.acceptTerms)
    //   newErrors.acceptTerms = "You must accept the terms";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", formData);
      console.log("Uploaded files:", uploadedFiles);
    }
  };

  return (
    <div className="container mx-auto mt-10 max-w-7xl px-3 xl:px-0">
      {/* header */}
      <header className="mb-6">
        <Link to={"/home/providers"} className="flex items-center gap-2">
          <ArrowLeft />
          Back to Providers
        </Link>
      </header>
      {/* main form */}
      <div className="border-border-primary rounded-md border bg-white p-6">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Request a Quote
          </h1>
          <p className="mb-1 text-gray-600">
            Get a personalized quote from{" "}
            <span className="font-semibold">Sweet Dreams Bakery</span>
          </p>
          <p className="text-gray-500">Typical price range: $50-200</p>
        </div>

        <div className="space-y-8">
          {/* Parent Information */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Parent Information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.yourName}
                  onChange={(e) => {
                    // Remove anything that's not a letter or space
                    const onlyLetters = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      "",
                    );
                    handleInputChange("yourName", onlyLetters);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Sarah Johnson"
                />
                {errors.yourName && (
                  <p className="mt-1 text-sm text-red-500">{errors.yourName}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) =>
                    handleInputChange("emailAddress", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="sarah@email.com"
                />
                {errors.emailAddress && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.emailAddress}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => {
                  // remove anything that's not a number
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                  handleInputChange("phoneNumber", onlyNumbers);
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="5551234567"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Party Details */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Party Details
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Birthday Child's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.birthdayChildName}
                  onChange={(e) => {
                    // allow only letters and spaces
                    const onlyLetters = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      "",
                    );
                    handleInputChange("birthdayChildName", onlyLetters);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Emma"
                />
                {errors.birthdayChildName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.birthdayChildName}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Age Turning <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.ageTurning}
                    onChange={(e) =>
                      handleInputChange("ageTurning", e.target.value)
                    }
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select age</option>
                    {[...Array(18)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  {errors.ageTurning && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.ageTurning}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Party Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.partyDate}
                    onChange={(e) =>
                      handleInputChange("partyDate", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.partyDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.partyDate}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Party Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={formData.partyTime}
                    onChange={(e) =>
                      handleInputChange("partyTime", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.partyTime && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.partyTime}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Number of Guests <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.numberOfGuests}
                    onChange={(e) =>
                      handleInputChange("numberOfGuests", e.target.value)
                    }
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select guest count</option>
                    <option value="1-10">1-10 guests</option>
                    <option value="11-20">11-20 guests</option>
                    <option value="21-30">21-30 guests</option>
                    <option value="31-50">31-50 guests</option>
                    <option value="50+">50+ guests</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                </div>
                {errors.numberOfGuests && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.numberOfGuests}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Party Theme
                </label>
                <input
                  type="text"
                  value={formData.partyTheme}
                  onChange={(e) =>
                    handleInputChange("partyTheme", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Emma"
                />
                {errors.partyTheme && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.partyTheme}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Party Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.partyLocation}
                onChange={(e) =>
                  handleInputChange("partyLocation", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Home address, venue, or general area"
              />
              {errors.partyLocation && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.partyLocation}
                </p>
              )}
            </div>
          </div>

          {/* Service Requirements */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Service Requirements
            </h2>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Service Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.serviceType}
                  onChange={(e) =>
                    handleInputChange("serviceType", e.target.value)
                  }
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select service type</option>
                  <option value="custom-cake">Custom Birthday Cake</option>
                  <option value="cupcakes">Cupcake Tower</option>
                  <option value="theme-cake">Theme Cake</option>
                  <option value="dessert-table">Full Dessert Table</option>
                  <option value="mini-treats">Mini Treats & Cookies</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              </div>

              {/*  Show required error */}
              {errors.serviceType && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.serviceType}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Budget Range
              </label>
              <div className="relative">
                <select
                  value={formData.budgetRange}
                  onChange={(e) =>
                    handleInputChange("budgetRange", e.target.value)
                  }
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select budget range</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100-150">$100 - $150</option>
                  <option value="150-200">$150 - $200</option>
                  <option value="200+">$200+</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              </div>

              {/* ✅ Show required error */}
              {errors.budgetRange && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.budgetRange}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Special Requests or Details
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) =>
                  handleInputChange("specialRequests", e.target.value)
                }
                rows={6}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Any special requirements, dietary restrictions, design ideas, or other details you'd like to share..."
              />
              {errors.specialRequests && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.specialRequests}
                </p>
              )}
            </div>

            {/* Upload Portfolio Images */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
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

              {/* Display uploaded files */}
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
          </div>

          {/* Terms and Submit */}
          <div>
            <div className="mb-6 flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptTerms}
                onChange={(e) =>
                  handleInputChange("acceptTerms", e.target.checked)
                }
                className="focus:border-secondary mt-1 mr-3 h-4 w-4 cursor-pointer rounded border-gray-300 text-[#1a1a1a] outline-none hover:ring-blue-300"
              />
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.acceptTerms}
                </p>
              )}
              <label htmlFor="terms" className="text-sm text-gray-700">
                I accept the Terms of Service and Privacy Policy{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="bg-secondary hover:bg-secondary-dark w-full cursor-pointer rounded-lg px-4 py-3 font-medium text-white transition-colors focus:ring-4 focus:ring-blue-300 focus:outline-none"
            >
              Send Quote Request
            </button>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="mt-8 w-full rounded-lg bg-[#D2EAFF] p-6">
        <h2 className="text-secondary mb-4 text-2xl font-semibold">
          What Happens Next?
        </h2>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="text-secondary text-base">
              Sweet Dreams Bakery Will Review Your Request Within 24 Hours
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="text-secondary text-base">
              You'll Receive A Personalized Quote Via Email
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="text-secondary text-base">
              You Can Then Confirm Or Discuss Any Adjustments
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="text-secondary text-base">
              Once Confirmed, Your Party Service Is Booked!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
