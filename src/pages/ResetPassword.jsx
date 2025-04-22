import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Extract token from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get("token");
    if (resetToken) {
      setToken(resetToken);
    } else {
      setError(
        "Invalid or missing reset token. Please check your link or request a new one."
      );
    }
  }, [location]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      await axiosInstance
        .post("api/method/merak_hotel_security.aviepros.reset_password", {
          token: token,
          new_password: newPassword,
          confirm_new_password: confirmPassword,
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success(
              "Password reset successfully. You can now log in with your new password."
            );
            setTimeout(() => {
              navigate("/");
            }, 300);
          } else {
            setError("Failed to reset password. Please try again.");
          }
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
            Reset Your Password
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter new password"
                disabled={isLoading || !token}
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Confirm new password"
                disabled={isLoading || !token}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !token}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 ${
                isLoading || !token
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            <div className="text-center">
              <button
                onClick={() => navigate("/login")}
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

export default ResetPassword;
