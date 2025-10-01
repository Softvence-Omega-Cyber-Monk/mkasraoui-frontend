import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
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
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted:", data);
  };

  return (
    <div>
      <div className="mx-auto max-w-md py-10">
        <h1 className="text-center text-5xl font-bold">Get in touch</h1>
      </div>
      <div className="flex items-center justify-center bg-gray-50 px-4">
        <div className="flex w-full max-w-7xl overflow-hidden rounded-lg bg-white">
          {/* Left side: Form */}
          <div className="w-full p-8 md:w-1/2">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Your full name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-sm text-red-500">{errors.name?.message}</p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="your.email@example.com"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-sm text-red-500">{errors.email?.message}</p>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  {...register("subject", { required: "Subject is required" })}
                  placeholder="What is this about?"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-sm text-red-500">
                  {errors.subject?.message}
                </p>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message", { required: "Message is required" })}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-sm text-red-500">
                  {errors.message?.message}
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-secondary-dark hover:bg-secondary-light w-full cursor-pointer rounded-md px-4 py-2 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
    </div>
  );
};

export default ContactUs;
