import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { MdCheckCircle } from "react-icons/md";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [done, setDone] = useState(false);
  const [type, setType] = useState("");

  useEffect(() => {
    if (sessionId) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/payment-success`, { sessionId })
        .then((res) => {
          setDone(true);
        })
        .catch(() => setDone(true));
    }
  }, [sessionId]);

  if (!done) return <LoadingSpinner />;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <MdCheckCircle className="text-green-500 text-7xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-500 mb-8">
          Your payment was processed successfully. Changes have been applied to
          your account.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard/my-issues"
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg
              hover:bg-blue-700 transition"
          >
            My Issues
          </Link>
          <Link
            to="/dashboard"
            className="border border-blue-600 text-blue-600 font-semibold py-2 px-6 rounded-lg
              hover:bg-blue-50 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
