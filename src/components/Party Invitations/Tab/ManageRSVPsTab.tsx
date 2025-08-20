/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mail } from "lucide-react";
interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

interface ManageRSVPsProps {
  guests: Guest[];
  newGuest: { name: string; email: string; phone: string };
  setNewGuest: React.Dispatch<React.SetStateAction<any>>;
  handleAddGuest: () => void;
  getStatusStyles: (status: string) => string;
  handleBack: () => void;
}

export default function ManageRSVPsTab({
  guests,
  newGuest,
  setNewGuest,
  handleAddGuest,
  getStatusStyles,
  handleBack,
}: ManageRSVPsProps) {
  return (
    <div className="">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Guest List & RSVPs</h1>

        <div className="bg-white">
          <div className="rounded-xl bg-[#F9FAFB] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[#000000]">
              Add New Guest
            </h2>
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Guest name"
                  value={newGuest.name}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, name: e.target.value })
                  }
                  className="h-12 w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Email"
                  value={newGuest.email}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, email: e.target.value })
                  }
                  className="h-12 w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Phone"
                  value={newGuest.phone}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, phone: e.target.value })
                  }
                  className="h-12 w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleAddGuest}
                className="hover:bg-secondary-light h-12 cursor-pointer rounded-md bg-[#223B7D] px-8 font-medium text-white transition-colors duration-200 focus:outline-none"
              >
                Add Guest
              </button>
            </div>
          </div>
        </div>

        {/* gest list section  */}
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
                      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getStatusStyles(guest.status)}`}
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

          {/* <button
                  onClick={handleNext}
                  className="cursor-pointer rounded-md bg-[#223B7D] px-6 py-3 text-white transition-all duration-300"
                >
                  Next
                </button> */}
        </div>
      </div>
    </div>
  );
}
