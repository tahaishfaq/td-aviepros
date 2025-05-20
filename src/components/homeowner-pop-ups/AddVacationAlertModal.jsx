// src/components/VacationAlertModal.jsx
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { useFormik } from "formik";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { toast, Toaster } from "sonner";
import moment from "moment";
import { DateRange } from "react-date-range"; // Import react-date-range
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file

export default function AddVacationAlertModal({ open, setOpen, onUpdate }) {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [showPicker, setShowPicker] = useState(false);

  const formik = useFormik({
    initialValues: {
      officer_name: "",
      vacation_note: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      const json = {
        homeowner: user?.homeowner_address,
        vacation_start_date: dateRange[0].startDate
          ? moment(dateRange[0].startDate).format("YYYY-MM-DD")
          : null,
        vacation_end_date: dateRange[0].endDate
          ? moment(dateRange[0].endDate).format("YYYY-MM-DD")
          : null,
        submitted_by: user?.email,
        vacation_note: values.vacation_note,
      };
      console.log("Form values:", json);
      try {
        await axiosInstance
          .post("/api/resource/Vacation Call In Entry", json)
          .then((res) => {
            console.log("Vacation alert submitted successfully:", res.data);
            toast.success("Vacation alert submitted successfully");
            onUpdate();
          });
      } catch (error) {
        console.error("Error submitting vacation alert:", error);
        toast.error("Failed to submit vacation alert");
      } finally {
        setSubmitting(false);
        formik.resetForm();
        setDateRange([
          {
            startDate: null,
            endDate: null,
            key: "selection",
          },
        ]);
        setOpen(false);
      }
    },
  });

  // Format the date range for display
  const formatDateRange = () => {
    const start = dateRange[0].startDate
      ? moment(dateRange[0].startDate).format("D MMM")
      : "";
    const end = dateRange[0].endDate
      ? moment(dateRange[0].endDate).format("D MMM")
      : "";
    return start && end ? `${start} - ${end}` : "Select Date";
  };

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
                      Plan Your Vacation
                    </DialogTitle>
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Description */}
                  <div className="font-light max-w-xs">
                    <p className="text-sm text-gray-500">
                      Let your Security Team know when you'll be away so they
                      can help keep your home safe.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={formik.handleSubmit} className="space-y-4">
                    {/* Vacation Note */}
                    <div className="border border-[#00000014] rounded-lg py-2 px-4">
                      <label
                        htmlFor="vacation_note"
                        className="block text-sm font-light text-gray-500"
                      >
                        Vacation Note
                      </label>
                      <textarea
                        id="vacation_note"
                        name="vacation_note"
                        className="text-sm outline-none border-none w-full bg-transparent resize-none"
                        rows="4"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.vacation_note}
                      />
                    </div>

                    {/* Date Range Picker */}
                    <div className="border border-[#00000014] rounded-lg py-2 px-4 relative">
                      <label
                        htmlFor="date_range"
                        className="block text-sm font-light text-gray-500"
                      >
                        Select Date
                      </label>
                      <div className="w-full flex items-center">
                        <input
                          type="text"
                          id="date_range"
                          value={formatDateRange()}
                          readOnly
                          onClick={() => setShowPicker(!showPicker)}
                          className="text-sm outline-none border-none w-full bg-transparent cursor-pointer"
                        />
                        {!showPicker && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      {showPicker && (
                        <div className="mt-2">
                          <DateRange
                            editableDateInputs={true}
                            onChange={(item) => {
                              setDateRange([item.selection]);
                              if (
                                item.selection.startDate &&
                                item.selection.endDate
                              ) {
                                setShowPicker(false);
                              }
                            }}
                            moveRangeOnFirstSelection={false}
                            ranges={dateRange}
                            dateDisplayFormat="d MMM"
                          />
                        </div>
                      )}
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
