import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type PaymentSession = {
  id: string;
  amount_paid?: number;
  currency?: string;
};

export default function ConfirmInviatationPage() {
  const navigate = useNavigate(); // ✅ for navigation
  const location = useLocation(); // ✅ to get query params

  const [session, setSession] = useState<PaymentSession | null>(null);

  // Get session_id from query string
  const queryParams = new URLSearchParams(location.search);
  const session_id = queryParams.get("session_id");

  useEffect(() => {
    if (session_id) {
      // Fetch session details from your backend
      fetch(`/api/payment-session?session_id=${session_id}`)
        .then((res) => res.json())
        .then((data) => setSession(data))
        .catch((err) => console.error("Error fetching payment session:", err));
    }
  }, [session_id]);

  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="mb-4 text-3xl font-bold">Thank You for Your Purchase!</h1>

      {session ? (
        <div>
          <p className="mb-2">
            Your payment was successful and your order is confirmed.
          </p>
          <p className="mb-8">
            We’ve sent a receipt to your email associated with this purchase.
          </p>

          <div className="mb-6 rounded-lg border bg-gray-50 p-4">
            <p>
              <strong>Order ID:</strong> {session.id}
            </p>
            {session.amount_paid && session.currency && (
              <p>
                <strong>Amount Paid:</strong>{" "}
                {(session.amount_paid / 100).toFixed(2)}{" "}
                {session.currency.toUpperCase()}
              </p>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/orders")} // navigate to orders
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              View Order
            </button>
            <button
              onClick={() => navigate("/")} // navigate home
              className="rounded-lg border px-6 py-3 hover:bg-gray-100"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <p>Loading your order details…</p>
      )}

      <p className="mt-12 text-sm text-gray-500">
        If you have any questions, please contact our support at{" "}
        <a href="mailto:support@mafetefacile.fr">support@mafetefacile.fr</a>.
      </p>
    </div>
  );
}
