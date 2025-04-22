import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation for email
    if (!email) {
      setError("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      await axiosInstance
        .post("/api/method/merak_hotel_security.aviepros.forget_password", {
          email,
        })
        .then((response) => {
          if (response.data.message.status === "error") {
            toast.error(response.data.message.message || "An error occurred.");
            return;
          }
          toast.success("Password reset link sent to your email.");
          setTimeout(() => {
            navigate("/");
          }, 1000);
        });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-4 text-center">
            Forgot Password
          </h2>

          <p className="text-sm text-gray-600 mb-4 text-center">
            Enter your email address, and we’ll send you a link to reset your
            password.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center">
              <button
                onClick={() => navigate("/")}
                className="text-sm text-green-600 hover:underline"
              >
                Back to Login
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgetPassword;
