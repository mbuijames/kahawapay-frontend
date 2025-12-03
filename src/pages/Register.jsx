import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetMessages();

    if (password !== confirmPassword) {
      return setError("❌ Passwords do not match");
    }
    if (password.length < 6) {
      return setError("❌ Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await registerUser(email, password); // backend call
      setSuccess("✅ Registration successful. Please verify OTP.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    resetMessages();

  const handleVerifyOtp = async (e) => {
  e.preventDefault();
  resetMessages();

  setLoading(true);
  try {
    await verifyOtp(email, otp); // <-- now uses backend instead of 123456

    localStorage.setItem("userEmail", email);

    setSuccess("✅ Registration complete. Redirecting...");
    setTimeout(() => navigate("/login"), 1500);
  } catch (err) {
    setError(err.message || "❌ Invalid OTP");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Create Account
      </h2>

      {error && <p className="mb-4 text-red-600 text-center">{error}</p>}
      {success && <p className="mb-4 text-green-600 text-center">{success}</p>}

      {step === 1 && (
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            className="w-full border border-gray-300 rounded-md p-2"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP (123456)"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength="6"
            className="w-full border border-gray-300 rounded-md p-2 text-center tracking-widest"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700"
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
}
