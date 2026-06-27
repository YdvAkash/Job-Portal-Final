import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/const";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/verify-email/${token}`);
        if (res.data.success) {
          setStatus("success");
          setMessage(res.data.message);
        } else {
          setStatus("error");
          setMessage(res.data.message);
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. The link might be expired or invalid.");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Verifying...</h2>
            <p className="text-gray-500 mt-2">{message}</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Success!</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Verification Failed</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
