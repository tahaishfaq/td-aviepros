// src/components/GuestModal.jsx
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useFormik } from "formik";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { toast, Toaster } from "sonner";
import moment from "moment";

export default function AddIncidentReportModal({ open, setOpen, onUpdate }) {
  const { user } = useAuth();

  const reportTypes = [
    "Homeowner Complaint",
    // "Speeding",
    // "Trespassing",
  ];

  const formik = useFormik({
    initialValues: {
      incident_name: "",
      incident_type: "Homeowner Complaint", // Default value as seen in the first image (Violence, but updated to match the new list)
      incident_description: "",
      // submitted_by, submitted_at, and officer_name will be handled automatically
    },
    onSubmit: async (values, { setSubmitting }) => {
      const json = {
        incident_name: values.incident_name,
        incident_type: values.incident_type,
        incident_description: values.incident_description,
        submitted_by: user?.email,
        submitted_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      console.log("Form values:", json);
      try {
        await axiosInstance
          .post("/api/resource/Aviepros Incident Reports", json)
          .then((res) => {
            console.log("Incident report submitted successfully:", res.data);
            toast.success("Incident report submitted successfully");
            //   onUpdate();
          });
      } catch (error) {
        console.error("Error submitting incident report:", error);
        toast.error("Failed to submit incident report");
      } finally {
        setSubmitting(false);
        formik.resetForm();
        setOpen(false);
      }
    },
  });

  return (
    <>
      <Toaster richColors />
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#252B377A]" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-5 text-left align-middle shadow-popup transition-all space-y-5">
                  <div className="flex justify-between items-center">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-medium leading-6"
                    >
                      Submit your incident report
                    </DialogTitle>
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={formik.handleSubmit} className="space-y-4">
                    {/* Incident Type (Select Category) */}
                    <div className="border border-[#00000014] rounded-lg py-2 px-4">
                      <label
                        htmlFor="incident_type"
                        className="block text-sm font-light text-gray-500"
                      >
                        Select Category
                      </label>
                      <select
                        id="incident_type"
                        name="incident_type"
                        className="text-sm outline-none border-none w-full bg-transparent"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.incident_type}
                      >
                        {reportTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Incident Name (Report) */}
                    <div className="border border-[#00000014] rounded-lg py-2 px-4">
                      <label
                        htmlFor="incident_name"
                        className="block text-sm font-light text-gray-500"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="incident_name"
                        name="incident_name"
                        className="text-sm outline-none border-none w-full bg-transparent"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.incident_name}
                      />
                    </div>

                    {/* Incident Description (Write Note here.....) */}
                    <div className="border border-[#00000014] rounded-lg py-2 px-4">
                      <label
                        htmlFor="incident_description"
                        className="block text-sm font-light text-gray-500"
                      >
                        Write Note here.....
                      </label>
                      <textarea
                        id="incident_description"
                        name="incident_description"
                        className="text-sm outline-none border-none w-full bg-transparent resize-none"
                        rows="4"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.incident_description}
                      />
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white outline-none cursor-pointer"
                        disabled={formik.isSubmitting}
                      >
                        {formik.isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
