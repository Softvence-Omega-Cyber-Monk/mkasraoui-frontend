/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

interface ManageRSVPsProps {
  guests: Guest[];
  getStatusStyles: (status: string) => string;
  handleBack: () => void;
}

// ✅ Validation schema
const guestSchema = z.object({
  name: z.string().min(1, "Guest name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone must be at least 6 characters"),
});

type GuestFormData = z.infer<typeof guestSchema>;

export default function ManageRSVPsTab({
  guests,
  getStatusStyles,
  handleBack,
}: ManageRSVPsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
  });

  // ✅ Submit handler
  const onSubmit = (data: GuestFormData) => {
    console.log("Form submitted:", data);
    reset(); // clear after submit
  };

  return (
    <div className="">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Guest List & RSVPs</h1>

        <div className="bg-white">
          <div className="rounded-xl bg-[#F9FAFB] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[#000000]">
              Add New Guest
            </h2>

            {/* ✅ Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center gap-4 md:flex-row md:items-start"
            >
              <div className="flex flex-1 flex-col">
                <input
                  type="text"
                  placeholder="Guest name"
                  {...register("name")}
                  className="h-12 w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className="h-12 w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <input
                  type="text"
                  placeholder="Phone"
                  {...register("phone")}
                  className="h-12 w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="hover:bg-secondary-light h-12 cursor-pointer rounded-md bg-[#223B7D] px-8 font-medium text-white transition-colors duration-200 focus:outline-none"
              >
                Add Guest
              </button>
            </form>
          </div>
        </div>

        {/* guest list section */}
        <div className="space-y-4">
          {guests.map((guest) => (
            <div
              key={guest.id}
              className="rounded-xl border border-[#DFDFDF] bg-white"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {guest.name}
                    </h3>
                    <p className="text-gray-600">
                      {guest.email} • {guest.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getStatusStyles(
                        guest.status,
                      )}`}
                    >
                      {guest.status}
                    </span>
                    <button className="hover:bg-secondary-dark flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-[#223B7D] text-white transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            type="button"
            className="cursor-pointer rounded-md border border-[#C9C9C9] px-6 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200"
          >
            Previous
          </button>
        </div>
      </div>
    </div>
  );
}
