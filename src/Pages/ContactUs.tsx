import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCreateContactMutation } from "@/redux/features/contact/contactApi";
import Swal from "sweetalert2";
import img from "@/assets/who.png";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const ContactUs: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  const [createContact] = useCreateContactMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const res = await createContact(data).unwrap();
      if (res?.success) {
        Swal.fire({
          title: "Message Sent!",
          text: res.message || "Your message has been sent successfully.",
          icon: "success",
          confirmButtonColor: "#223B7D",
        });
        reset();
      } else {
        Swal.fire({
          title: "Oops!",
          text: res?.message || "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonColor: "#D33",
        });
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err?.data?.message || "Failed to send message",
        icon: "error",
        confirmButtonColor: "#D33",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      {/* Heading */}
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-5xl font-bold">Get in touch</h1>
        <p className="mt-2 text-gray-600">We'd love to hear from you!</p>
      </div>

      {/* Form + Image Container */}
      <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-center gap-6 overflow-hidden md:flex-row">
        {/* Left side: Form */}
        <div className="w-full rounded-2xl border border-[#E5E7EB] p-8 md:w-1/2">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">
            Send us a message
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                {...register("name", { required: "Name is required" })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-[#223B7D] focus:ring-2 focus:ring-[#223B7D] focus:outline-none"
              />
              <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-[#223B7D] focus:ring-2 focus:ring-[#223B7D] focus:outline-none"
              />
              <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                placeholder="What is this about?"
                {...register("subject", { required: "Subject is required" })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-[#223B7D] focus:ring-2 focus:ring-[#223B7D] focus:outline-none"
              />
              <p className="text-sm text-red-500">{errors.subject?.message}</p>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Tell us more about your inquiry..."
                {...register("message", { required: "Message is required" })}
                className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2 focus:border-[#223B7D] focus:ring-2 focus:ring-[#223B7D] focus:outline-none"
              />
              <p className="text-sm text-red-500">{errors.message?.message}</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-[#223B7D] px-4 py-2 font-medium text-white transition-colors hover:bg-[#2E4BA0] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Right side: Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={img}
            alt="Contact illustration"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

// import React from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { useCreateContactMutation } from "@/redux/features/contact/contactApi";
// import img from "@/assets/who.png";
// import { toast } from "react-hot-toast";

// type FormValues = {
//   name: string;
//   email: string;
//   subject: string;
//   message: string;
// };

// const ContactUs: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<FormValues>();

//   const [createContact, { isLoading }] = useCreateContactMutation();

//   const onSubmit: SubmitHandler<FormValues> = async (data) => {
//     try {
//       const res = await createContact(data).unwrap();
//       if (res?.success) {
//         toast.success("Your message has been sent!");
//         reset();
//       } else {
//         toast.error(res?.message || "Something went wrong!");
//       }
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Failed to send message");
//     }
//   };

//   return (
//     <div>
//       <div className="mx-auto max-w-md py-10">
//         <h1 className="text-center text-5xl font-bold">Get in touch</h1>
//       </div>

//       <div className="flex items-center justify-center bg-gray-50 px-4">
//         <div className="flex w-full max-w-7xl overflow-hidden rounded-lg bg-white shadow-lg">
//           {/* Left side: Form */}
//           <div className="w-full p-8 md:w-1/2">
//             <h2 className="mb-6 text-2xl font-semibold text-gray-900">
//               Send us a message
//             </h2>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               {/* Name */}
//               <div className="space-y-2">
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                   Name
//                 </label>
//                 <input
//                   id="name"
//                   type="text"
//                   {...register("name", { required: "Name is required" })}
//                   placeholder="Your full name"
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#223B7D] focus:ring-2 focus:ring-[#223B7D] focus:outline-none"
//                 />
//                 <p className="text-sm text-red-500">{errors.name?.message}</p>
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   {...register("email", { required: "Email is required" })}
//                   placeholder="your.email@example.com"
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                 />
//                 <p className="text-sm text-red-500">{errors.email?.message}</p>
//               </div>

//               {/* Subject */}
//               <div className="space-y-2">
//                 <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
//                   Subject
//                 </label>
//                 <input
//                   id="subject"
//                   type="text"
//                   {...register("subject", { required: "Subject is required" })}
//                   placeholder="What is this about?"
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                 />
//                 <p className="text-sm text-red-500">{errors.subject?.message}</p>
//               </div>

//               {/* Message */}
//               <div className="space-y-2">
//                 <label htmlFor="message" className="block text-sm font-medium text-gray-700">
//                   Message
//                 </label>
//                 <textarea
//                   id="message"
//                   rows={5}
//                   {...register("message", { required: "Message is required" })}
//                   placeholder="Tell us more about your inquiry..."
//                   className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                 />
//                 <p className="text-sm text-red-500">{errors.message?.message}</p>
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 className="bg-[#223B7D] hover:bg-[#2E4BA0] w-full cursor-pointer rounded-md px-4 py-2 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Sending..." : "Send Message"}
//               </button>
//             </form>
//           </div>

//           {/* Right side: Image */}
//           <div className="hidden md:block md:w-1/2">
//             <img src={img} alt="Contact illustration" className="h-full w-full object-cover" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactUs;

// import React from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import img from "@/assets/who.png";

// type FormValues = {
//   name: string;
//   email: string;
//   subject: string;
//   message: string;
// };

// const ContactUs: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<FormValues>();

//   const onSubmit: SubmitHandler<FormValues> = async (data) => {
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     console.log("Form submitted:", data);
//   };

//   return (
//     <div>
//       <div className="mx-auto max-w-md py-10">
//         <h1 className="text-center text-5xl font-bold">Get in touch</h1>
//       </div>
//       <div className="flex items-center justify-center bg-gray-50 px-4">
//         <div className="flex w-full max-w-7xl overflow-hidden rounded-lg bg-white">
//           {/* Left side: Form */}
//           <div className="w-full p-8 md:w-1/2">
//             <h2 className="mb-6 text-2xl font-semibold text-gray-900">
//               Send us a message
//             </h2>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               {/* Name */}
//               <div className="space-y-2">
//                 <label
//                   htmlFor="name"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Name
//                 </label>
//                 <input
//                   id="name"
//                   type="text"
//                   {...register("name", { required: "Name is required" })}
//                   placeholder="Your full name"
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                 />
//                 <p className="text-sm text-red-500">{errors.name?.message}</p>
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   {...register("email", { required: "Email is required" })}
//                   placeholder="your.email@example.com"
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                 />
//                 <p className="text-sm text-red-500">{errors.email?.message}</p>
//               </div>

//               {/* Subject */}
//               <div className="space-y-2">
//                 <label
//                   htmlFor="subject"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Subject
//                 </label>
//                 <input
//                   id="subject"
//                   type="text"
//                   {...register("subject", { required: "Subject is required" })}
//                   placeholder="What is this about?"
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                 />
//                 <p className="text-sm text-red-500">
//                   {errors.subject?.message}
//                 </p>
//               </div>

//               {/* Message */}
//               <div className="space-y-2">
//                 <label
//                   htmlFor="message"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Message
//                 </label>
//                 <textarea
//                   id="message"
//                   rows={5}
//                   {...register("message", { required: "Message is required" })}
//                   placeholder="Tell us more about your inquiry..."
//                   className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                 />
//                 <p className="text-sm text-red-500">
//                   {errors.message?.message}
//                 </p>
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 className="bg-secondary-dark hover:bg-secondary-light w-full cursor-pointer rounded-md px-4 py-2 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Sending..." : "Send Message"}
//               </button>
//             </form>
//           </div>

//           {/* Right side: Image */}
//           <div className="hidden md:block md:w-1/2">
//             <img
//               src={img}
//               alt="Contact illustration"
//               className="h-full w-full object-cover"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactUs;
