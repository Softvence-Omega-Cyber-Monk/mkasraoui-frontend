import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCreateQuoteMutation } from "@/redux/features/quotes/quotesApi";
import type { QuoteRequest } from "@/redux/types/quotes.type";
import toast from "react-hot-toast";
import RequestContent from "./RequestContent";

export default function RequestQuote() {
  const [searchParams] = useSearchParams();
  const initialProviderId = searchParams.get("providerId") || "";

  const [formData, setFormData] = useState({
    providerId: initialProviderId,
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    numberOfGuest: "",
    partyTheme: "",
    partyLocation: "",
    budgetRange: "",
    description: "",
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [createQuote, { isLoading }] = useCreateQuoteMutation();

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.date.trim()) newErrors.date = "Date is required";
    if (!formData.time.trim()) newErrors.time = "Time is required";
    if (!formData.numberOfGuest.trim())
      newErrors.numberOfGuest = "Number of guests is required";
    if (!formData.partyLocation.trim())
      newErrors.partyLocation = "Party location is required";
    if (!formData.partyTheme.trim())
      newErrors.partyTheme = "Party Theme is required";
    if (!formData.budgetRange.trim())
      newErrors.budgetRange = "Budget range is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const formattedDate = formData.date
      ? new Date(formData.date).toISOString()
      : "";
    const formattedTime =
      formData.date && formData.time
        ? new Date(`${formData.date}T${formData.time}`).toISOString()
        : "";

    const payload: QuoteRequest = {
      providerId: formData.providerId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formattedDate,
      time: formattedTime,
      numberOfGuest: Number(formData.numberOfGuest),
      partyTheme: formData.partyTheme,
      partyLocation: formData.partyLocation,
      description: formData.description,
      budgetRange: formData.budgetRange,
    };

    try {
      await createQuote(payload).unwrap();
      toast.success("Quote submitted successfully!");
      setFormData({
        providerId: "",
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        numberOfGuest: "",
        partyTheme: "",
        partyLocation: "",
        budgetRange: "",
        description: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Failed to submit quote:", err);
      toast.error("Failed to submit quote");
    }
  };

  return (
    <div className="container mx-auto mt-10 max-w-7xl px-3 xl:px-0">
      <header className="mb-6">
        <Link to={"/home/providers"} className="flex items-center gap-2">
          <ArrowLeft />
          Back to Providers
        </Link>
      </header>

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

        <div className="space-y-6 p-6">
          {/* Name & Email */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-500">{errors.date}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-500">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Guests & Theme */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Number of Guests
              </label>
              <input
                type="number"
                value={formData.numberOfGuest}
                onChange={(e) =>
                  handleInputChange("numberOfGuest", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.numberOfGuest && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.numberOfGuest}
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Party Location
            </label>
            <input
              type="text"
              value={formData.partyLocation}
              onChange={(e) =>
                handleInputChange("partyLocation", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            {errors.partyLocation && (
              <p className="mt-1 text-sm text-red-500">
                {errors.partyLocation}
              </p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Budget Range
            </label>
            <input
              type="text"
              value={formData.budgetRange}
              onChange={(e) => handleInputChange("budgetRange", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            {errors.budgetRange && (
              <p className="mt-1 text-sm text-red-500">{errors.budgetRange}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-secondary hover:bg-secondary-dark w-full rounded-lg px-4 py-3 font-medium text-white transition-colors focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            {isLoading ? "Submitting..." : "Submit Quote"}
          </button>
        </div>
      </div>

      <RequestContent />
    </div>
  );
}

// import { ArrowLeft, ChevronDown } from "lucide-react";
// import { useState } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import { useCreateQuoteMutation } from "@/redux/features/quotes/quotesApi";
// import { useGetProvidersQuery } from "@/redux/features/property/propertyApi";
// import type { QuoteRequest } from "@/redux/types/quotes.type";
// import type { Provider } from "@/redux/types/property.type";
// import toast from "react-hot-toast";
// import RequestContent from "./RequestContent";

// export default function RequestQuote() {
//   const [searchParams] = useSearchParams();
//   const initialProviderId = searchParams.get("providerId") || "";

//   const [formData, setFormData] = useState({
//     providerId: initialProviderId,
//     name: "",
//     email: "",
//     phone: "",
//     date: "",
//     time: "",
//     numberOfGuest: "",
//     partyTheme: "",
//     partyLocation: "",
//     budgetRange: "",
//     description: "",
//   });

//   const [errors, setErrors] = useState<Partial<typeof formData>>({});

//   const { data: providersData, isLoading: providersLoading } =
//     useGetProvidersQuery({ limit: 10, page: 1 });

//   const providersList: Provider[] = (providersData?.data?.data || []).filter(
//     (provider) => provider.isApproved,
//   );

//   const [createQuote, { isLoading }] = useCreateQuoteMutation();

//   const handleInputChange = (field: keyof typeof formData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const validate = (): boolean => {
//     const newErrors: Partial<typeof formData> = {};
//     if (!formData.providerId) newErrors.providerId = "Select a provider";
//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
//     if (!formData.date.trim()) newErrors.date = "Date is required";
//     if (!formData.time.trim()) newErrors.time = "Time is required";
//     if (!formData.numberOfGuest.trim())
//       newErrors.numberOfGuest = "Number of guests is required";
//     if (!formData.partyLocation.trim())
//       newErrors.partyLocation = "Party location is required";
//     if (!formData.partyTheme.trim())
//       newErrors.partyTheme = "Party Theme is required";
//     if (!formData.budgetRange.trim())
//       newErrors.budgetRange = "Budget range is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;

//     let formattedDate = "";
//     let formattedTime = "";

//     if (formData.date) formattedDate = new Date(formData.date).toISOString();
//     if (formData.date && formData.time)
//       formattedTime = new Date(
//         `${formData.date}T${formData.time}`,
//       ).toISOString();

//     const payload: QuoteRequest = {
//       providerId: formData.providerId,
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       date: formattedDate,
//       time: formattedTime,
//       numberOfGuest: Number(formData.numberOfGuest),
//       partyTheme: formData.partyTheme,
//       partyLocation: formData.partyLocation,
//       description: formData.description,
//       budgetRange: formData.budgetRange,
//     };

//     try {
//       await createQuote(payload).unwrap();
//       toast.success(" Quote submitted successfully!"); // ✅ Show toast

//       setFormData({
//         providerId: "",
//         name: "",
//         email: "",
//         phone: "",
//         date: "",
//         time: "",
//         numberOfGuest: "",
//         partyTheme: "",
//         partyLocation: "",
//         budgetRange: "",
//         description: "",
//       });
//       setErrors({});
//     } catch (err) {
//       console.error("❌ Failed to submit quote:", err);
//       toast.error("❌ Failed to submit quote");
//     }
//   };
//   return (
//     <div className="container mx-auto mt-10 max-w-7xl px-3 xl:px-0">
//       <header className="mb-6">
//         <Link to={"/home/providers"} className="flex items-center gap-2">
//           <ArrowLeft />
//           Back to Providers
//         </Link>
//       </header>

//       <div className="border-border-primary rounded-md border bg-white p-6">
//         <div className="mb-8 text-center">
//           <h1 className="mb-2 text-3xl font-bold text-gray-900">
//             Request a Quote
//           </h1>
//           <p className="mb-1 text-gray-600">
//             Get a personalized quote from{" "}
//             <span className="font-semibold">Sweet Dreams Bakery</span>
//           </p>
//           <p className="text-gray-500">Typical price range: $50-200</p>
//         </div>

//         <div className="space-y-8 p-6">
//           {/* Provider Selection */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Select Provider <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <select
//                 value={formData.providerId}
//                 onChange={(e) =>
//                   handleInputChange("providerId", e.target.value)
//                 }
//                 className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select provider</option>
//                 {providersLoading ? (
//                   <option>Loading...</option>
//                 ) : (
//                   providersList.map((provider) => (
//                     <option key={provider.id} value={provider.id}>
//                       {provider.bussinessName}
//                     </option>
//                   ))
//                 )}
//               </select>
//               <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
//             </div>
//             {errors.providerId && (
//               <p className="mt-1 text-sm text-red-500">{errors.providerId}</p>
//             )}
//           </div>

//           {/* Name & Email */}
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Your Name
//               </label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => handleInputChange("name", e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.name && (
//                 <p className="mt-1 text-sm text-red-500">{errors.name}</p>
//               )}
//             </div>
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleInputChange("email", e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-500">{errors.email}</p>
//               )}
//             </div>
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               value={formData.phone}
//               onChange={(e) => handleInputChange("phone", e.target.value)}
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//             />
//             {errors.phone && (
//               <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
//             )}
//           </div>

//           {/* Date & Time */}
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Date
//               </label>
//               <input
//                 type="date"
//                 value={formData.date}
//                 onChange={(e) => handleInputChange("date", e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.date && (
//                 <p className="mt-1 text-sm text-red-500">{errors.date}</p>
//               )}
//             </div>
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Time
//               </label>
//               <input
//                 type="time"
//                 value={formData.time}
//                 onChange={(e) => handleInputChange("time", e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.time && (
//                 <p className="mt-1 text-sm text-red-500">{errors.time}</p>
//               )}
//             </div>
//           </div>

//           {/* Guests & Theme */}
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Number of Guests
//               </label>
//               <input
//                 type="number"
//                 value={formData.numberOfGuest}
//                 onChange={(e) =>
//                   handleInputChange("numberOfGuest", e.target.value)
//                 }
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.numberOfGuest && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.numberOfGuest}
//                 </p>
//               )}
//             </div>
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Party Theme
//               </label>
//               <input
//                 type="text"
//                 value={formData.partyTheme}
//                 onChange={(e) =>
//                   handleInputChange("partyTheme", e.target.value)
//                 }
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Location */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Party Location
//             </label>
//             <input
//               type="text"
//               value={formData.partyLocation}
//               onChange={(e) =>
//                 handleInputChange("partyLocation", e.target.value)
//               }
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//             />
//             {errors.partyLocation && (
//               <p className="mt-1 text-sm text-red-500">
//                 {errors.partyLocation}
//               </p>
//             )}
//           </div>

//           {/* Budget */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Budget Range
//             </label>
//             <input
//               type="text"
//               value={formData.budgetRange}
//               onChange={(e) => handleInputChange("budgetRange", e.target.value)}
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//             />
//             {errors.budgetRange && (
//               <p className="mt-1 text-sm text-red-500">{errors.budgetRange}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Description
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => handleInputChange("description", e.target.value)}
//               rows={4}
//               className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Submit Button */}

//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="bg-secondary hover:bg-secondary-dark w-full cursor-pointer rounded-lg px-4 py-3 font-medium text-white transition-colors focus:ring-4 focus:ring-blue-300 focus:outline-none"
//           >
//             {isLoading ? "Submitting..." : "Submit Quote"}
//           </button>
//         </div>
//       </div>
//       <RequestContent />
//     </div>
//   );
// }
