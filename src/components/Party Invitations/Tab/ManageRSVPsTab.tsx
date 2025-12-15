/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trash } from "lucide-react";
import {
  useGetInvitationsByUserQuery,
  useDeleteInvitationMutation,
} from "@/redux/features/invitations/invitationsApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface ManageRSVPsProps {
  handleBack: () => void;
}

const getStatusStyles = (status: string) => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "border-yellow-400 text-yellow-600 bg-yellow-50";
    case "CONFIRMED":
      return "border-green-400 text-green-600 bg-green-50";
    case "DECLINED":
      return "border-red-400 text-red-600 bg-red-50";
    default:
      return "border-gray-300 text-gray-600 bg-gray-50";
  }
};

export default function ManageRSVPsTab({ handleBack }: ManageRSVPsProps) {
  const { data: invitationsData, isLoading, isError } =
    useGetInvitationsByUserQuery();
  const invitations = invitationsData?.invitations || [];
  const [deleteInvitation, { isLoading: isDeleting }] =
    useDeleteInvitationMutation();

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          deleteInvitation(id).unwrap();
          toast.success("Deleted Successfully");
        } catch (error) {
          console.error("Delete failed:", error);
          toast.error("Something went wrong");
        }
      }
    });
  };

  if (isLoading) return <p className="text-gray-600">Loading invitations...</p>;
  if (isError) return <p className="text-red-500">Failed to load invitations.</p>;

  const guestList = Array.isArray(invitations) ? invitations : [];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Guest List & RSVPs
        </h1>

        {/* Guest list section */}
        <div className="space-y-4">
          {guestList?.length === 0 ? (
            <p className="text-gray-600">No guests found.</p>
          ) : (
            guestList?.map((guest: any) => (
              <div
                key={guest.id}
                className="rounded-xl border border-[#DFDFDF] bg-white"
              >
                <div className="p-4">
                  {/* Responsive layout */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Left: image + user info */}
                    <div className="flex flex-col md:flex-row sm:items-center gap-3 flex-1">
                      <img
                        src={
                          guest.image ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt={guest.guest_name}
                        className="h-12 w-12 rounded-full object-cover border"
                      />

                      <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {guest.guest_name}
                        </h3>
                        <div className="flex gap-0 flex-col md:flex-row md:gap-2">
                          <p className="text-gray-600 text-sm sm:text-base break-all">
                            {guest.email}
                          </p>
                          <p className="hidden md:block text-gray-600">•</p>
                          <p className="text-gray-600 text-sm sm:text-base">{guest.guest_phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: status + delete button */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-xs sm:text-sm font-medium whitespace-nowrap ${getStatusStyles(
                          guest.status
                        )}`}
                      >
                        {guest.status}
                      </span>

                      <button
                        onClick={() => handleDelete(guest.id)}
                        disabled={isDeleting}
                        className="flex cursor-pointer h-10 w-10 items-center justify-center rounded-md bg-[#223B7D] text-white hover:bg-[#1a2f63] transition-colors duration-200 focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back button */}
        <div className="flex justify-between pt-4">
          <button
            onClick={handleBack}
            type="button"
            className="cursor-pointer rounded-md border border-[#C9C9C9] px-5 sm:px-6 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 text-sm sm:text-base"
          >
            Previous
          </button>
        </div>
      </div>
    </div>
  );
}
