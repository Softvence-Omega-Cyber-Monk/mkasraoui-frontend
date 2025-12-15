import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-xl">
        <CheckCircleIcon className="mx-auto h-20 w-20 text-[#223B7D]" />

        <h1 className="mt-6 text-3xl font-bold text-gray-800">
          Payment Successful
        </h1>

        <p className="mt-4 text-base leading-relaxed text-gray-600">
          Your payment has been processed successfully. Thank you for your
          purchase.
        </p>

        {sessionId && (
          <p className="mt-4 text-sm text-gray-500">
            Transaction ID:{" "}
            <span className="font-mono text-gray-700 break-all">{sessionId}</span>
          </p>
        )}

        <button
          onClick={handleBackHome}
          className="mt-8 w-full cursor-pointer rounded-lg bg-[#223B7D] px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-[#031d64]"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
