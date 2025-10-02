import { useNavigate, useSearchParams } from "react-router-dom"; // or Next.js router if using Next.js
import { CheckCircleIcon } from "@heroicons/react/24/solid"; // optional icon

export default function PaymentSuccess() {
  const navigate = useNavigate(); // for react-router
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const handleBackHome = () => {
    navigate("/"); // redirect to home page
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-800">
          Payment Successful!
        </h1>
        <p className="mt-2 text-gray-600">
          Your payment has been processed successfully.
        </p>
        {sessionId && (
          <p className="mt-2 text-sm text-gray-500">
            Session ID: <span className="font-mono">{sessionId}</span>
          </p>
        )}
        <button
          onClick={handleBackHome}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
