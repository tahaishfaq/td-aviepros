// import React, { useState, useEffect } from "react";
// import logo from "../assets/logo.png";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { Link, useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import { useAuth } from "../context/AuthContext";
// import { toast, Toaster } from "sonner";

// const Login = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   // Check if already logged in
//   useEffect(() => {
//     if (localStorage.getItem("session_id") && localStorage.getItem("user")) {
//       navigate("/dashboard");
//     }
//   }, [navigate]);

//   // Formik setup
//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: Yup.object({
//       email: Yup.string().email("Invalid email").required("Email is required"),
//       password: Yup.string()
//         .min(6, "Too short")
//         .required("Password is required"),
//     }),
//     onSubmit: async (values) => {
//       setLoading(true);
//       try {
//         const res = await axiosInstance.post(
//           "/api/method/merak_hotel_security.aviepros.login",
//           values
//         );

//         console.log(res);

//         // Check the API response status
//         if (res.data.message.status === "error") {
//           // Display error message to the user
//           toast.error(res.data.message.message || "Invalid email or password");
//           return; // Stop further execution
//         }

//         // If login is successful, proceed with storing user data
//         login(
//           res.data.message.user,
//           res.data.message.session_id,
//           res.data.message.api_key,
//           res.data.message.api_secret
//         );

//         setTimeout(() => {
//           navigate("/dashboard");
//         }, 1000);
//       } catch (error) {
//         console.error("Login error:", error);
//         // Handle network or unexpected errors
//         toast.error("An error occurred during login. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     },
//   });
//   return (
//     <>
//       <Toaster richColors />
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 lg:px-0 md:px-2 sm:px-2">
//         <div className="w-full max-w-md space-y-6">
//           <div className="flex justify-center">
//             <img src={logo} alt="Logo" className="size-20" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-medium text-center text-gray-800">
//               Let's Get to Know You!
//             </h1>
//             <p className="text-center font-light">
//               Please provide your details to set up your account.
//             </p>
//           </div>

//           <form className="space-y-4" onSubmit={formik.handleSubmit}>
//             <div>
//               <div className="bg-white px-4 py-2 rounded-lg border border-border font-light">
//                 <label className="block text-xs text-gray-500">Email</label>
//                 <input
//                   name="email"
//                   type="email"
//                   placeholder="Enter Email"
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.email}
//                   className="w-full text-xs outline-none placeholder:text-gray-700 text-gray-700"
//                 />
//               </div>
//               {formik.touched.email && formik.errors.email && (
//                 <p className="text-xs text-red-500 mt-1 ml-2">
//                   {formik.errors.email}
//                 </p>
//               )}
//             </div>

//             <div>
//               <div className="bg-white px-4 py-2 rounded-lg border border-border font-light">
//                 <label className="block text-xs text-gray-500">Password</label>
//                 <input
//                   name="password"
//                   type="password"
//                   placeholder="Enter Password"
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.password}
//                   className="w-full text-xs outline-none placeholder:text-gray-700 text-gray-700"
//                 />
//               </div>
//               {formik.touched.password && formik.errors.password && (
//                 <p className="text-xs text-red-500 mt-1 ml-2">
//                   {formik.errors.password}
//                 </p>
//               )}
//             </div>

//             {/* <button
//             type="submit"
//             className="w-full px-5 py-3 bg-green-600 text-white cursor-pointer rounded-lg border border-green-600 signup-shadow"
//           >
//             Submit
//           </button> */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full px-5 py-3 bg-green-600 text-white rounded-lg border border-green-600 signup-shadow ${
//                 loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
//               }`}
//             >
//               {loading ? "Logging in..." : "Submit"}
//             </button>
//           </form>
//           <Link to="/forget-password" className="flex justify-center">
//             <p className="text-center text-sm font-medium text-green-600">Forget Password</p>
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { toast, Toaster } from "sonner";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
              <div className="relative bg-white px-4 py-2 rounded-lg border border-border font-light">
                <label className="block text-xs text-gray-500">Password</label>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="w-full text-xs outline-none placeholder:text-gray-700 text-gray-700 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-500 mt-1 ml-2">
                  {formik.errors.password}
                </p>
              )}
            </div>

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
          <Link to="/forget-password" className="flex justify-center">
            <p className="text-center text-sm font-medium text-green-600">Forget Password</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;