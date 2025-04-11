// src/pages/UserProfile.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import { toast, Toaster } from "sonner";
import { Eye, EyeOff } from "lucide-react"; // Import Lucide icons

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation schema for password update
  const validationSchema = Yup.object({
    current_password: Yup.string().required("Current password is required"),
    new_password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one letter, one number, and one special character"
      )
      .required("New password is required"),
    confirm_new_password: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Passwords must match")
      .required("Confirm new password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const json = {
          current_password: values.current_password,
          new_password: values.new_password,
          confirm_new_password: values.confirm_new_password,
        };

        const res = await axiosInstance.post(
          "/api/method/merak_hotel_security.aviepros.change_password",
          json
        );

        console.log("Password updated successfully:", res?.data?.message);
        toast.success("Password updated successfully");
        formik.resetForm();
      } catch (error) {
        console.error("Error updating password:", error);
        toast.error("Failed to update password. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <Toaster richColors />
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="max-w-[545px] mx-auto px-4 sm:px-0 lg:px-0 md:px-2 pt-6 pb-3 space-y-12">
          <div className="flex items-end gap-x-2.5">
            <button
              onClick={goBack}
              className="bg-white shadow-back-button rounded-lg p-2 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                color="#000000"
                fill="none"
              >
                <path
                  d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-normal">Change Password</h1>
          </div>

          <div className="w-full space-y-6">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div className="bg-white rounded-lg px-4 py-2 border border-[#00000014] relative">
                <label className="block text-sm text-gray-500 font-light">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="current_password"
                    value={formik.values.current_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full text-sm outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {formik.touched.current_password && formik.errors.current_password && (
                  <span className="text-xs text-red-500 mt-1">
                    {formik.errors.current_password}
                  </span>
                )}
              </div>

              {/* New Password */}
              <div className="bg-white rounded-lg px-4 py-2 border border-[#00000014] relative">
                <label className="block text-sm text-gray-500 font-light">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="new_password"
                    value={formik.values.new_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full text-sm outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {formik.touched.new_password && formik.errors.new_password && (
                  <span className="text-xs text-red-500 mt-1">
                    {formik.errors.new_password}
                  </span>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="bg-white rounded-lg px-4 py-2 border border-[#00000014] relative">
                <label className="block text-sm text-gray-500 font-light">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_new_password"
                    value={formik.values.confirm_new_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full text-sm outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {formik.touched.confirm_new_password && formik.errors.confirm_new_password && (
                  <span className="text-xs text-red-500 mt-1">
                    {formik.errors.confirm_new_password}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div className="w-full">
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-medium cursor-pointer transition-colors bg-green-600 text-white disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;