// src/components/GuestModal.jsx
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
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

// Custom CSS for the checkbox
const customStyles = `
    .custom-checkbox {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      width: 1rem; /* h-4 */
      height: 1rem; /* w-4 */
      border: 1px solid #d1d5db; /* border-gray-300 */
      border-radius: 0.25rem; /* rounded */
      background-color: white;
      cursor: pointer;
      position: relative;
    }
  
    .custom-checkbox:checked {
      background-color: #16a34a; /* bg-green-600 */
      border-color: #16a34a; /* border-green-600 */
    }
  
    .custom-checkbox:checked::after {
      content: '';
      position: absolute;
      top: 1px;
      left: 4px;
      width: 5px;
      height: 9px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  `;

export default function AddDayVisitorModal({ open, setOpen, onUpdate }) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);

  const visitorCategories = ["Day Visitor", "Delivery", "Contractor"];

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      category: "Day Visitor",
      goshen_gate: false,
      termination_date: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      const terminationDate = moment()
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");

      const json = {
        call_in_type: "HomeOwner",
        homeowner: user?.homeowner_address,
        category: values.category,
        visitor_name: `${values.first_name} ${values.last_name}`.trim(),
        goshen_gate: 0, // Removed, so always set to 0
        termination_date: terminationDate,
      };

      try {
        await axiosInstance.post("/api/resource/Visitor Call-In", json);
        toast.success("Visitor call-in submitted successfully");
        onUpdate();
      } catch (error) {
        console.error("Error submitting visitor call-in:", error);
        toast.error("Failed to submit visitor call-in");
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
      {/* Inject custom styles */}
      <style>{customStyles}</style>
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
                      Visitor call in
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
                    {/* First Name and Last Name in a Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-4">
                      <div className="border border-[#00000014] rounded-lg py-2 px-4">
                        <label
                          htmlFor="first_name"
                          className="block text-sm font-light text-gray-500"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          className="text-sm outline-none border-none w-full bg-transparent"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.first_name}
                        />
                      </div>

                      <div className="border border-[#00000014] rounded-lg py-2 px-4">
                        <label
                          htmlFor="last_name"
                          className="block text-sm font-light text-gray-500"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          className="text-sm outline-none border-none w-full bg-transparent"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.last_name}
                        />
                      </div>
                    </div>

                    {/* Category (Select type) */}
                    <div className="border border-[#00000014] rounded-lg py-2 px-4">
                      <label
                        htmlFor="category"
                        className="block text-sm font-light text-gray-500"
                      >
                        Select type
                      </label>
                      <select
                        id="category"
                        name="category"
                        className="text-sm outline-none border-none w-full bg-transparent"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.category}
                      >
                        {visitorCategories.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Goshen Gate (Checkbox) */}
                    {/* <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="goshen_gate"
                        name="goshen_gate"
                        checked={formik.values.goshen_gate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="custom-checkbox" // Use custom class instead of Tailwind classes
                      />
                      <label
                        htmlFor="goshen_gate"
                        className="text-sm font-light text-gray-500"
                      >
                        Goshen Gate
                      </label>
                    </div> */}

                    {/* Termination Date (Datetime Picker) */}
                    {/* <div className="border border-[#00000014] rounded-lg py-2 px-4">
                      <label
                        htmlFor="termination_date"
                        className="block text-sm font-light text-gray-500"
                      >
                        Termination Date
                      </label>
                      <div className="w-full">
                        <Datetime
                          value={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          dateFormat="YYYY-MM-DD"
                          timeFormat="HH:mm:ss"
                          closeOnSelect
                          inputProps={{
                            className: "w-full text-sm outline-none",
                          }}
                        />
                      </div>
                    </div> */}

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
