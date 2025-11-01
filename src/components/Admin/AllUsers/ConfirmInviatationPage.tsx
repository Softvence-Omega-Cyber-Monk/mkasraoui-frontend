import { useLocation, useNavigate } from "react-router-dom";
import {
  useConfirmInvitationQuery,
  useCancelInvitationMutation,
} from "@/redux/features/invitations/invitationsApi";
import Swal from "sweetalert2";

export default function ConfirmInvitationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const { data: confirmData } = useConfirmInvitationQuery(token || "", {
    skip: !token,
  });
  const [cancelInvitation, { isLoading: isCancelling }] =
    useCancelInvitationMutation();

  const handleCancel = async () => {
    if (!token) return;
    try {
      const res: any = await cancelInvitation(token).unwrap();
      Swal.fire("Cancelled", res.data?.message || res.message, "success");
      navigate("/"); // redirect home
    } catch (err: any) {
      Swal.fire(
        "Error",
        err.data?.message || "Failed to cancel invitation",
        "error",
      );
    }
  };

  const handleConfirm = () => {
    Swal.fire("Confirmed", "Your invitation is confirmed!", "success");
    navigate("/"); // navigate home or orders page
  };

  if (!token) {
    return (
      <p className="mt-8 text-center">Invalid or missing invitation token.</p>
    );
  }

  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="mb-4 text-3xl font-bold">Invitation Confirmation</h1>

      {confirmData ? (
        <div className="space-y-6">
          <p>
            Hello <strong>{confirmData.data.guest_name || "Guest"}</strong>,
          </p>
          <p>
            You have an invitation for the event. Please confirm or cancel your
            attendance.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleConfirm}
              className="cursor-pointer rounded-lg bg-[#223B7D] px-6 py-3 text-white hover:bg-[#052069]"
            >
              Confirm
            </button>
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="cursor-pointer rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-800 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p>Loading invitation details…</p>
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// type PaymentSession = {
//   id: string;
//   amount_paid?: number;
//   currency?: string;
// };

// export default function ConfirmInviatationPage() {
//   const navigate = useNavigate(); // ✅ for navigation
//   const location = useLocation(); // ✅ to get query params

//   const [session, setSession] = useState<PaymentSession | null>(null);

//   // Get session_id from query string
//   const queryParams = new URLSearchParams(location.search);
//   const session_id = queryParams.get("session_id");

//   useEffect(() => {
//     if (session_id) {
//       // Fetch session details from your backend
//       fetch(`/api/payment-session?session_id=${session_id}`)
//         .then((res) => res.json())
//         .then((data) => setSession(data))
//         .catch((err) => console.error("Error fetching payment session:", err));
//     }
//   }, [session_id]);

//   return (
//     <div className="container mx-auto p-8 text-center">
//       <h1 className="mb-4 text-3xl font-bold">Thank You for Your Purchase!</h1>

//       {session ? (
//         <div>
//           <p className="mb-2">
//             Your payment was successful and your order is confirmed.
//           </p>
//           <p className="mb-8">
//             We’ve sent a receipt to your email associated with this purchase.
//           </p>

//           <div className="mb-6 rounded-lg border bg-gray-50 p-4">
//             <p>
//               <strong>Order ID:</strong> {session.id}
//             </p>
//             {session.amount_paid && session.currency && (
//               <p>
//                 <strong>Amount Paid:</strong>{" "}
//                 {(session.amount_paid / 100).toFixed(2)}{" "}
//                 {session.currency.toUpperCase()}
//               </p>
//             )}
//           </div>

//           <div className="flex justify-center space-x-4">
//             <button
//               onClick={() => navigate("/orders")} // navigate to orders
//               className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
//             >
//               View Order
//             </button>
//             <button
//               onClick={() => navigate("/")} // navigate home
//               className="rounded-lg border px-6 py-3 hover:bg-gray-100"
//             >
//               Continue Shopping
//             </button>
//           </div>
//         </div>
//       ) : (
//         <p>Loading your order details…</p>
//       )}

//       <p className="mt-12 text-sm text-gray-500">
//         If you have any questions, please contact our support at{" "}
//         <a href="mailto:support@mafetefacile.fr">support@mafetefacile.fr</a>.
//       </p>
//     </div>
//   );
// }
