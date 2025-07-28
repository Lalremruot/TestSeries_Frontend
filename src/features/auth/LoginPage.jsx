import { useState, useEffect } from "react";
import axiosInstance from "../../../api";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useContext";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [step, setStep] = useState("send"); // 'send' or 'verify'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Check if user is already logged in and redirect
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo);
    }
  }, [navigate, location.state]);

  const handleSendOtp = async () => {
    if (!phone) return toast.info("Enter phone number");

    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/user/auth/otp/send", { phone });
      setSessionId(res.data.sessionId);
      setStep("verify");
      toast.success("OTP sent!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !sessionId || !phone) {
      return toast.warning("Please fill all fields");
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/user/auth/otp/verify", {
  phone,
  sessionId,
  otp,
});

      console.log("Login response:", res.data);

      // Store user data with token
      const userData = {
        _id: res.data._id,
        phone: res.data.phone,
        isVerified: res.data.isVerified,
        token: res.data.token
      };

      console.log("User data to store:", userData);
      localStorage.setItem("user", JSON.stringify(userData));
      login(userData);

toast.success(res.data.message);
// Redirect to the original page or home
const redirectTo = location.state?.from || "/";
navigate(redirectTo);
    } catch (err) {
      toast.error(err.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold text-center">Login with OTP</h2>

        {step === "send" && (
          <>
            <input
              type="tel"
              placeholder="Phone number"
              className="w-full px-4 py-2 border rounded focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <p className="text-sm text-center text-gray-600">
              OTP sent to <strong>{phone}</strong>
            </p>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded focus:outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className={`w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full text-blue-500 mt-2 hover:underline"
            >
              Resend OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
