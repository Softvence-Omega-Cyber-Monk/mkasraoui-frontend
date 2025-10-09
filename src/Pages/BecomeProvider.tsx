import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRequestProviderMutation } from "@/redux/features/property/propertyApi";
import GetStarted from "@/components/Map/GetStarted";

const serviceCategories = [
  { value: "VENUE_SPACES", label: "Venue Spaces" },
  { value: "FOOD_CATERING", label: "Food & Catering" },
  { value: "CAKES_DESSERTS", label: "Cakes & Desserts" },
  { value: "BALLOON_DECOR", label: "Balloon Decoration" },
  { value: "FLORAL_DECOR", label: "Floral Decoration" },
  { value: "LIGHTING_SETUP", label: "Lighting Setup" },
  { value: "DJs_BANDS", label: "DJs & Bands" },
  { value: "MAGICIANS", label: "Magicians" },
  { value: "PHOTOGRAPHY", label: "Photography" },
  { value: "VIDEOGRAPHY", label: "Videography" },
  { value: "PHOTO_BOOTH", label: "Photo Booth" },
  { value: "PARTY_SUPPLIES", label: "Party Supplies" },
  { value: "SOUND_SYSTEM", label: "Sound System" },
  { value: "INVITATIONS", label: "Invitations" },
  { value: "RETURN_GIFTS", label: "Return Gifts" },
  { value: "HOSTS_ANCHORS", label: "Hosts / Anchors" },
  { value: "KIDS_ENTERTAINMENT", label: "Kids Entertainment" },
  { value: "PREMIUM_LUXURY", label: "Premium Luxury" },
];

type FormValues = {
  businessName: string;
  email: string;
  contactName: string;
  phone: string;
  serviceCategory: string[];
  primaryServiceArea: string;
  serviceDescription: string;
  price: string;
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
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State for location & destination (only using location for primary service area)
  const [addPlaceData, setAddPlaceData] = useState<{
    location: { lat: number; lng: number } | null;
    destination: { lat: number; lng: number } | null;
    homeAddress?: string;
    destinationAddress?: string;
  }>({ location: null, destination: null });

  const handleDataUpdate = (data: Partial<typeof addPlaceData>) => {
    setAddPlaceData((prev) => ({ ...prev, ...data }));
    // Update react-hook-form values dynamically
    if (data.homeAddress) setValue("primaryServiceArea", data.homeAddress);
  };

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

      // Only add lat/lng if location is selected
      const latitude = addPlaceData.location?.lat || null;
      const longitude = addPlaceData.location?.lng || null;

      const payload: Record<string, unknown> = {
        bussinessName: data.businessName,
        email: data.email,
        contactName: data.contactName,
        phone: data.phone,
        serviceCategory: data.serviceCategory,
        serviceArea: data.primaryServiceArea,
        latitude,
        longitude,
        description: data.serviceDescription,
        price: data.price,
        website: data.website || null,
        instagram: data.instagram || null,
      };

      formData.append("data", JSON.stringify(payload));

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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Business Name */}
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

                <Controller
                  name="serviceCategory"
                  control={control}
                  rules={{
                    required: "At least one service category is required",
                  }}
                  render={({ field }) => {
                    const [open, setOpen] = useState(false);
                    const toggleCategory = (value: string) => {
                      const newValue = field.value?.includes(value)
                        ? field.value.filter((v: string) => v !== value)
                        : [...(field.value || []), value];
                      field.onChange(newValue);
                    };
                    return (
                      <div className="relative">
                        <div
                          onClick={() => setOpen(!open)}
                          className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 p-3"
                        >
                          <span className="text-gray-700">
                            {field.value?.length > 0
                              ? field.value
                                  .map(
                                    (v: string) =>
                                      serviceCategories.find(
                                        (c) => c.value === v,
                                      )?.label,
                                  )
                                  .join(", ")
                              : "Select categories"}
                          </span>
                          {open ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>

                        {open && (
                          <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                            <ul className="max-h-64 overflow-y-auto">
                              {serviceCategories.map((cat) => (
                                <li
                                  key={cat.value}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      field.value?.includes(cat.value) || false
                                    }
                                    onChange={() => toggleCategory(cat.value)}
                                    className="h-4 w-4"
                                  />
                                  <label className="cursor-pointer">
                                    {cat.label}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />

                {errors.serviceCategory && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.serviceCategory.message}
                  </p>
                )}
              </div>

              {/* Primary Service Area */}

              <div className="">
                <label className="mb-2 flex items-center font-medium text-gray-700">
                  <MapPin className="text-secondary mr-2 h-5 w-5" /> Primary
                  Service Area
                </label>
                <GetStarted
                  location={addPlaceData.location}
                  destination={addPlaceData.destination}
                  onLocationChange={(coords) => {
                    if (coords) handleDataUpdate({ location: coords });
                  }}
                  onDestinationChange={() => {}}
                  onLocationAddressChange={(homeAddress) =>
                    handleDataUpdate({ homeAddress })
                  }
                  onDestinationAddressChange={() => {}}
                />
                {errors.primaryServiceArea && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.primaryServiceArea.message}
                  </p>
                )}
              </div>

              {/* <div className="">
                <label className="mb-2 flex items-center font-medium text-gray-700">
                  <MapPin className="text-secondary mr-2 h-5 w-5" /> Primary
                  Service Area
                </label>
                <GetStarted
                  location={addPlaceData.location}
                  destination={addPlaceData.destination}
                  onLocationChange={(coords) => {
                    if (coords) handleDataUpdate({ location: coords });
                  }}
                  onDestinationChange={() => {}}
                  onLocationAddressChange={(homeAddress) =>
                    handleDataUpdate({ homeAddress })
                  }
                  onDestinationAddressChange={() => {}}
                />
                {errors.primaryServiceArea && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.primaryServiceArea.message}
                  </p>
                )}
              </div> */}

              {/* Price Range */}
              <div>
                <label className="mb-2 flex items-center font-medium text-gray-700">
                  <DollarSign className="text-secondary mr-2 h-5 w-5" /> Price
                  Range
                </label>
                <input
                  type="text"
                  {...register("price", {
                    required: "Price range is required",
                  })}
                  className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.price.message}
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
              Start managing your services and bookings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeProvider;

// import { useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Upload,
//   X,
//   Briefcase,
//   Mail,
//   Phone,
//   MapPin,
//   FileText,
//   DollarSign,
//   Globe,
//   Instagram,
//   Check,
//   ArrowLeft,
// } from "lucide-react";
// import { useRequestProviderMutation } from "@/redux/features/property/propertyApi";

// import { Controller } from "react-hook-form";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const serviceCategories = [
//   { value: "VENUE_SPACES", label: "Venue Spaces" },
//   { value: "FOOD_CATERING", label: "Food & Catering" },
//   { value: "CAKES_DESSERTS", label: "Cakes & Desserts" },
//   { value: "BALLOON_DECOR", label: "Balloon Decoration" },
//   { value: "FLORAL_DECOR", label: "Floral Decoration" },
//   { value: "LIGHTING_SETUP", label: "Lighting Setup" },
//   { value: "DJs_BANDS", label: "DJs & Bands" },
//   { value: "MAGICIANS", label: "Magicians" },
//   { value: "PHOTOGRAPHY", label: "Photography" },
//   { value: "VIDEOGRAPHY", label: "Videography" },
//   { value: "PHOTO_BOOTH", label: "Photo Booth" },
//   { value: "PARTY_SUPPLIES", label: "Party Supplies" },
//   { value: "SOUND_SYSTEM", label: "Sound System" },
//   { value: "INVITATIONS", label: "Invitations" },
//   { value: "RETURN_GIFTS", label: "Return Gifts" },
//   { value: "HOSTS_ANCHORS", label: "Hosts / Anchors" },
//   { value: "KIDS_ENTERTAINMENT", label: "Kids Entertainment" },
//   { value: "PREMIUM_LUXURY", label: "Premium Luxury" },
// ];

// type FormValues = {
//   businessName: string;
//   email: string;
//   contactName: string;
//   phone: string;
//   serviceCategory: string[];
//   primaryServiceArea: string;
//   serviceDescription: string;
//   price: string;
//   website?: string;
//   instagram?: string;
// };

// type UploadedFile = {
//   id: string;
//   name: string;
//   size: number;
//   preview: string;
//   file: File;
// };

// const BecomeProvider = () => {
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [requestProvider, { isLoading }] = useRequestProviderMutation();
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<FormValues>();
//   const navigate = useNavigate();

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleFileClick = () => fileInputRef.current?.click();

//   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const newFiles = Array.from(e.target.files).map((file) => ({
//         id: crypto.randomUUID(),
//         name: file.name,
//         size: file.size,
//         preview: URL.createObjectURL(file),
//         file,
//       }));
//       setUploadedFiles((prev) => [...prev, ...newFiles]);
//     }
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const files = Array.from(e.dataTransfer.files).map((file) => ({
//       id: crypto.randomUUID(),
//       name: file.name,
//       size: file.size,
//       preview: URL.createObjectURL(file),
//       file,
//     }));
//     setUploadedFiles((prev) => [...prev, ...files]);
//   };

//   const removeFile = (id: string) => {
//     setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
//   };
//   const onSubmit = async (data: FormValues) => {
//     try {
//       const formData = new FormData();

//       // Create payload exactly as backend expects
//       const payload: Record<string, unknown> = {
//         bussinessName: data.businessName,
//         email: data.email,
//         contactName: data.contactName,
//         phone: data.phone,
//         serviceCategory: data.serviceCategory,
//         serviceArea: data.primaryServiceArea,
//         latitude: 40.7128,
//         longitude: -74.006,
//         description: data.serviceDescription,
//         price: data.price,
//         website: data.website || null,
//         instagram: data.instagram || null,
//       };

//       // Append JSON payload as a string
//       formData.append("data", JSON.stringify(payload));
//       console.log(payload);
//       console.log(formData);

//       // Append all uploaded files
//       uploadedFiles.forEach((file) => {
//         formData.append("files", file.file);
//       });

//       const res = await requestProvider(formData).unwrap();
//       console.log("✅ Provider request submitted successfully", res);

//       navigate("/dashboard");
//     } catch (err) {
//       console.error("❌ Failed to submit provider request:", err);
//     }
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

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Business Name */}
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//               <div>
//                 <label className="mb-2 flex items-center font-medium text-gray-700">
//                   <Briefcase className="text-secondary mr-2 h-5 w-5" /> Business
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   {...register("businessName", {
//                     required: "Business name is required",
//                   })}
//                   className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
//                 />
//                 {errors.businessName && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.businessName.message}
//                   </p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="mb-2 flex items-center font-medium text-gray-700">
//                   <Mail className="text-secondary mr-2 h-5 w-5" /> Email
//                 </label>
//                 <input
//                   type="email"
//                   {...register("email", { required: "Email is required" })}
//                   className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               {/* Contact Name */}
//               <div>
//                 <label className="mb-2 flex items-center font-medium text-gray-700">
//                   <FileText className="text-secondary mr-2 h-5 w-5" /> Contact
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   {...register("contactName", {
//                     required: "Contact name is required",
//                   })}
//                   className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
//                 />
//                 {errors.contactName && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.contactName.message}
//                   </p>
//                 )}
//               </div>

//               {/* Phone */}
//               <div>
//                 <label className="mb-2 flex items-center font-medium text-gray-700">
//                   <Phone className="text-secondary mr-2 h-5 w-5" /> Phone
//                 </label>
//                 <input
//                   type="tel"
//                   {...register("phone", {
//                     required: "Phone number is required",
//                   })}
//                   className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
//                 />
//                 {errors.phone && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.phone.message}
//                   </p>
//                 )}
//               </div>

//               {/* Service Category */}
//               {/* <div>
//                 <label className="mb-2 flex items-center font-medium text-gray-700">
//                   <Briefcase className="text-secondary mr-2 h-5 w-5" /> Service
//                   Category
//                 </label>
//                 <input
//                   type="text"
//                   {...register("serviceCategory", {
//                     required: "Service category is required",
//                   })}
//                   className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
//                 />
//                 {errors.serviceCategory && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.serviceCategory.message}
//                   </p>
//                 )}
//               </div> */}

//               {/* Service Category */}
//               <div>
//                 <label className="mb-2 flex items-center font-medium text-gray-700">
//                   <Briefcase className="text-secondary mr-2 h-5 w-5" /> Service
//                   Category
//                 </label>

//                 <Controller
//                   name="serviceCategory"
//                   control={control}
//                   rules={{
//                     required: "At least one service category is required",
//                   }}
//                   render={({ field }) => {
//                     const [open, setOpen] = useState(false);

//                     const toggleCategory = (value: string) => {
//                       const newValue = field.value?.includes(value)
//                         ? field.value.filter((v: string) => v !== value)
//                         : [...(field.value || []), value];
//                       field.onChange(newValue);
//                     };

//                     return (
//                       <div className="relative">
//                         {/* Selected Box */}
//                         <div
//                           onClick={() => setOpen(!open)}
//                           className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 p-3"
//                         >
//                           <span className="text-gray-700">
//                             {field.value?.length > 0
//                               ? field.value
//                                   .map(
//                                     (v: string) =>
//                                       serviceCategories.find(
//                                         (c) => c.value === v,
//                                       )?.label,
//                                   )
//                                   .join(", ")
//                               : "Select categories"}
//                           </span>
//                           {open ? (
//                             <ChevronUp className="h-5 w-5" />
//                           ) : (
//                             <ChevronDown className="h-5 w-5" />
//                           )}
//                         </div>

//                         {/* Dropdown */}
//                         {open && (
//                           <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
//                             <ul className="max-h-64 overflow-y-auto">
//                               {serviceCategories.map((cat) => (
//                                 <li
//                                   key={cat.value}
//                                   className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
//                                 >
//                                   <input
//                                     type="checkbox"
//                                     checked={
//                                       field.value?.includes(cat.value) || false
//                                     }
//                                     onChange={() => toggleCategory(cat.value)}
//                                     className="h-4 w-4"
//                                   />
//                                   <label className="cursor-pointer">
//                                     {cat.label}
//                                   </label>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   }}
//                 />

//                 {errors.serviceCategory && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.serviceCategory.message}
//                   </p>
//                 )}
//               </div>

//               {/* Primary Service Area */}
//               <div>
//                 <label className="mb-2 flex items-center font-medium text-gray-700">
//                   <MapPin className="text-secondary mr-2 h-5 w-5" /> Primary
//                   Service Area
//                 </label>
//                 <input
//                   type="text"
//                   {...register("primaryServiceArea", {
//                     required: "Primary service area is required",
//                   })}
//                   className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
//                 />
//                 {errors.primaryServiceArea && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.primaryServiceArea.message}
//                   </p>
//                 )}
//               </div>

//               {/* Price Range */}
//               <div>
//                 <label className="mb-2 flex items-center font-medium text-gray-700">
//                   <DollarSign className="text-secondary mr-2 h-5 w-5" /> Price
//                   Range
//                 </label>
//                 <input
//                   type="text"
//                   {...register("price", {
//                     required: "Price range is required",
//                   })}
//                   className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
//                 />
//                 {errors.price && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.price.message}
//                   </p>
//                 )}
//               </div>

//               {/* Website */}
//               <div>
//                 <label className="mb-2 flex items-center font-medium text-gray-700">
//                   <Globe className="text-secondary mr-2 h-5 w-5" /> Website
//                   (Optional)
//                 </label>
//                 <input
//                   type="url"
//                   {...register("website")}
//                   className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
//                 />
//               </div>

//               {/* Instagram */}
//               <div>
//                 <label className="mb-2 flex items-center font-medium text-gray-700">
//                   <Instagram className="text-secondary mr-2 h-5 w-5" />{" "}
//                   Instagram (Optional)
//                 </label>
//                 <input
//                   type="text"
//                   {...register("instagram")}
//                   className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
//                 />
//               </div>
//             </div>
//             {/* Description */}
//             <div>
//               <label className="mb-2 flex items-center font-medium text-gray-700">
//                 <FileText className="text-secondary mr-2 h-5 w-5" /> Service
//                 Description
//               </label>
//               <textarea
//                 {...register("serviceDescription", {
//                   required: "Description is required",
//                 })}
//                 className="focus:border-secondary focus:ring-secondary/20 w-full rounded-lg border border-gray-300 p-3 focus:ring-2"
//                 rows={4}
//               ></textarea>
//               {errors.serviceDescription && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.serviceDescription.message}
//                 </p>
//               )}
//             </div>
//             {/* File Upload */}
//             <div>
//               <label className="mb-2 block font-medium text-gray-700">
//                 Upload Portfolio Images
//               </label>
//               <div
//                 onClick={handleFileClick}
//                 onDrop={handleDrop}
//                 onDragOver={(e) => e.preventDefault()}
//                 className="hover:border-secondary hover:text-secondary flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-gray-500 transition"
//               >
//                 <Upload className="mb-2 h-8 w-8" />
//                 <p>Drag and drop files here, or click to select files</p>
//                 <input
//                   type="file"
//                   multiple
//                   ref={fileInputRef}
//                   onChange={handleFileInput}
//                   className="hidden"
//                   accept="image/*"
//                 />
//               </div>

//               {/* Preview */}
//               <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
//                 {uploadedFiles.map((file) => (
//                   <div
//                     key={file.id}
//                     className="relative overflow-hidden rounded-lg border"
//                   >
//                     <img
//                       src={file.preview}
//                       alt={file.name}
//                       className="h-32 w-full object-cover"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeFile(file.id)}
//                       className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white shadow"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="bg-secondary hover:bg-secondary-dark w-full cursor-pointer rounded-lg px-4 py-3 font-medium text-white transition-colors disabled:opacity-60"
//             >
//               {isLoading ? "Submitting..." : "Submit"}
//             </button>
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
// };

// export default BecomeProvider;
