import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { toast, Toaster } from "sonner";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Check if already logged in
  useEffect(() => {
    if (localStorage.getItem("session_id") && localStorage.getItem("user")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Too short")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await axiosInstance.post(
          "/api/method/merak_hotel_security.aviepros.login",
          values
        );

        console.log(res);

        // Check the API response status
        if (res.data.message.status === "error") {
          // Display error message to the user
          toast.error(res.data.message.message || "Invalid email or password");
          return; // Stop further execution
        }

        // If login is successful, proceed with storing user data
        login(
          res.data.message.user,
          res.data.message.session_id,
          res.data.message.api_key,
          res.data.message.api_secret
        );

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } catch (error) {
        console.error("Login error:", error);
        // Handle network or unexpected errors
        toast.error("An error occurred during login. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 lg:px-0 md:px-2 sm:px-2">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <img src={logo} alt="Logo" className="size-20" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-center text-gray-800">
              Let's Get to Know You!
            </h1>
            <p className="text-center font-light">
              Please provide your details to set up your account.
            </p>
          </div>

          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div>
              <div className="bg-white px-4 py-2 rounded-lg border border-border font-light">
                <label className="block text-xs text-gray-500">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="w-full text-xs outline-none placeholder:text-gray-700 text-gray-700"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500 mt-1 ml-2">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="bg-white px-4 py-2 rounded-lg border border-border font-light">
                <label className="block text-xs text-gray-500">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="w-full text-xs outline-none placeholder:text-gray-700 text-gray-700"
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-500 mt-1 ml-2">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* <button
            type="submit"
            className="w-full px-5 py-3 bg-green-600 text-white cursor-pointer rounded-lg border border-green-600 signup-shadow"
          >
            Submit
          </button> */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-5 py-3 bg-green-600 text-white rounded-lg border border-green-600 signup-shadow ${
                loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? "Logging in..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
