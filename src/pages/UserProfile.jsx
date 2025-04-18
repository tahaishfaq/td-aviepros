// src/pages/UserProfile.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { toast, Toaster } from "sonner";

const UserProfile = () => {
  const { user, login, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    user?.user_image ? window.$BackEndURL + user.user_image : null
  );

  // Validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    contactNumber: Yup.string().required("Contact number is required"),
    address: Yup.string().required("Address is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      firstName: user?.first_name || user?.name?.split(" ")[0] || "",
      lastName:
        user?.last_name ||
        (user?.name?.split(" ").length > 1 ? user?.name?.split(" ")[1] : "") ||
        "",
      email: user?.email || "",
      contactNumber: user?.phone || user?.contact_number || "",
      address: user?.address || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let uploadedImageUrl = null;

        // If there's a new image selected, upload it
        if (imageFile) {
          const formData = new FormData();
          formData.append("file", imageFile);

          const uploadResponse = await axiosInstance.post(
            "/api/method/upload_file",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          uploadedImageUrl = uploadResponse?.data?.message?.file_url;
        }

        const json = {
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.contactNumber,
          address: values.address,
          ...(uploadedImageUrl && { user_image: uploadedImageUrl }),
        };

        const res = await axiosInstance.post(
          "/api/method/merak_hotel_security.aviepros.update_user_profile",
          json
        );

        console.log("edit-profile", res?.data);
        updateUser(res?.data?.message?.user);

        setIsEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const goBack = () => {
    navigate("/dashboard");
  };

  const handleEditToggle = () => {
    if (isEditing) {
      formik.resetForm();
    }
    setEmailDisabled(!emailDisabled);
    setIsEditing(!isEditing);
  };

  return (
    <>
    <Toaster richColors />
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-[545px] mx-auto px-4 sm:px-0 lg:px-0 md:px-2 pt-6 pb-3 space-y-12">
        <div className="flex items-end gap-x-2.5 ">
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
          <h1 className="text-2xl font-normal">User Profile</h1>
        </div>

        <div className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-y-4 sm:gap-y-0">
            <div className="flex items-center gap-x-2.5">
              {/* <div className="size-21 relative flex-shrink-0">
                {isEditing ? (
                  <>
                    <label
                      htmlFor="image-upload"
                      className="w-full h-full cursor-pointer rounded-full overflow-hidden flex items-center justify-center relative"
                    >
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.currentTarget.files[0];
                        if (file) {
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                    />
                  </>
                ) : (
                  <div className="size-21 rounded-full bg-green-100 overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 text-2xl font-semibold">
                        {formik.values.firstName.charAt(0)}
                        {formik.values.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                )}
              </div> */}

              <div className="relative flex-shrink-0 w-[84px] h-[84px]">
                {" "}
                {/* Replaced size-21 with explicit dimensions */}
                <div className="w-full h-full rounded-full bg-gray-100 relative">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-green-600 text-2xl font-semibold bg-gray-100 rounded-full">
                      {formik.values.firstName.charAt(0)}
                      {formik.values.lastName.charAt(0)}
                    </div>
                  )}

                  {/* Edit button */}
                  {isEditing && (
                    <>
                      <label
                        htmlFor="image-upload"
                        className="absolute bottom-[-4px] right-[-4px] bg-white p-1.5 rounded-full shadow-md cursor-pointer border border-gray-200 hover:bg-gray-50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H6v-3a2 2 0 01.586-1.414L15.232 5.232z"
                          />
                        </svg>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => {
                          const file = e.currentTarget.files[0];
                          if (
                            file &&
                            ["image/png", "image/jpg", "image/jpeg"].includes(
                              file.type
                            )
                          ) {
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          } else {
                            toast.info("Only PNG, JPG or JPEG files are allowed.");
                          }
                        }}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="">
                <h2 className="text-[20px] font-medium">
                  {formik.values.firstName} {formik.values.lastName}
                </h2>
                <p className="text-gray-500 text-sm font-normal">
                  {formik.values.email}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end">
              {isEditing ? (
                <button
                  onClick={handleEditToggle}
                  type="button"
                  className="px-6 py-2 rounded-full cursor-pointer font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={handleEditToggle}
                  type="button"
                  className="px-8 py-3 rounded-lg font-medium cursor-pointer transition-colors bg-green-600 text-white"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 gap-x-3 gap-y-4">
              <div className="bg-white rounded-lg px-4 py-2 border border-[#00000014]">
                <label className="block text-sm text-gray-500 font-light">
                  First Name
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full text-sm outline-none"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <span className="text-sm text-red-500 mt-1">
                        {formik.errors.firstName}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-sm">{formik.values.firstName}</span>
                )}
              </div>

              <div className="bg-white rounded-lg px-4 py-2 border border-[#00000014]">
                <label className="block text-sm text-gray-500 font-light">
                  Last Name
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full text-sm outline-none"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <span className="text-xs text-red-500 mt-1">
                        {formik.errors.lastName}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-sm">{formik.values.lastName}</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg px-4 py-2 border border-[#00000014]">
              <label className="block text-sm text-gray-500 font-light">
                Email address
              </label>
              {isEditing ? (
                <>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full text-sm outline-none ${
                      emailDisabled ? "cursor-not-allowed" : ""
                    }`}
                    disabled={emailDisabled}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <span className="text-xs text-red-500 mt-1">
                      {formik.errors.email}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm">{formik.values.email}</span>
              )}
            </div>

            <div className="bg-white rounded-lg px-4 py-2 border border-[#00000014]">
              <label className="block text-sm text-gray-500 font-light">
                Contact Number
              </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formik.values.contactNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full text-sm outline-none"
                  />
                  {formik.touched.contactNumber &&
                    formik.errors.contactNumber && (
                      <span className="text-xs text-red-500 mt-1">
                        {formik.errors.contactNumber}
                      </span>
                    )}
                </>
              ) : (
                <span className="text-sm">{formik.values.contactNumber}</span>
              )}
            </div>

            <div className="bg-white rounded-lg px-4 py-2 border border-[#00000014]">
              <label className="block text-sm text-gray-500 font-light">
                Address
              </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full text-sm outline-none"
                  />
                  {formik.touched.address && formik.errors.address && (
                    <span className="text-xs text-red-500 mt-1">
                      {formik.errors.address}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm">{formik.values.address}</span>
              )}
            </div>
            <div className="w-full">
              {isEditing && (
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-medium cursor-pointer transition-colors bg-green-600 text-white disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Profile"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserProfile;
