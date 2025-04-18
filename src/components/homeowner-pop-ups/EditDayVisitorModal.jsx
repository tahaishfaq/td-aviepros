// src/components/pop-ups/EditDayVisitorModal.jsx
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { useFormik } from "formik";
import axiosInstance from "../../utils/axiosInstance";
import { toast, Toaster } from "sonner";
import moment from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

// Custom CSS for the checkbox (copied from AddDayVisitorModal)
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

export default function EditDayVisitorModal({
  open,
  setOpen,
  visitor,
  onUpdate,
}) {
 

  // Split visitor_name into first_name and last_name for the form
  const [firstName, lastName] = visitor?.visitor_name
    ? visitor.visitor_name.split(" ")
    : ["", ""];

  // State for managing the termination date
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Set the initial value of selectedDate to the visitor's termination date
    if (visitor?.termination_date) {
      setSelectedDate(moment(visitor.termination_date));
    } else {
      setSelectedDate(null);
    }
  }, [visitor]);

  // Visitor categories (same as AddDayVisitorModal)
  const visitorCategories = ["Day Visitor", "Delivery", "Contractor"];

  // Formik setup for editing the visitor
  const formik = useFormik({
    initialValues: {
      first_name: firstName || "",
      last_name: lastName || "",
      category: visitor?.category || "Day Visitor",
      goshen_gate: visitor?.goshen_gate === 1,
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const json = {
        visitor_name: `${values.first_name} ${values.last_name}`.trim(),
        category: values.category,
        goshen_gate: values.goshen_gate ? 1 : 0,
        termination_date: selectedDate
          ? moment(selectedDate).format("YYYY-MM-DD HH:mm:ss")
          : null,
      };
      console.log("Form values:", json);
      try {
        await axiosInstance
          .put(`/api/resource/Visitor Call-In/${visitor.name}`, json)
          .then((res) => {
            console.log("Visitor updated successfully:", res.data);
            toast.success("Visitor updated successfully");
            onUpdate();
          });
      } catch (error) {
        console.error("Error updating visitor:", error);
        toast.error("Failed to update visitor");
      } finally {
        setSubmitting(false);
        setOpen(false);
      }
    },
  });

  // Handle visitor deletion
  const handleDelete = async () => {
    try {
      await axiosInstance
        .delete(`/api/resource/Visitor Call-In/${visitor.name}`)
        .then((res) => {
          console.log("Visitor deleted successfully:", res.data);
          toast.success("Visitor deleted successfully");
          onUpdate();
        });
    } catch (error) {
      console.error("Error deleting visitor:", error);
      toast.error("Failed to delete visitor");
    } finally {
      setOpen(false);
    }
  };

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
                      Edit Visitor
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
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="goshen_gate"
                        name="goshen_gate"
                        checked={formik.values.goshen_gate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="custom-checkbox"
                      />
                      <label
                        htmlFor="goshen_gate"
                        className="text-sm font-light text-gray-500"
                      >
                        Goshen Gate
                      </label>
                    </div>

                    {/* Termination Date (Datetime Picker) */}
                    <div className="border border-[#00000014] rounded-lg py-2 px-4">
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
                    </div>

                    {/* Buttons */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-4">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white outline-none cursor-pointer"
                      >
                        Delete
                      </button>
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white outline-none cursor-pointer"
                        disabled={formik.isSubmitting}
                      >
                        {formik.isSubmitting ? "Updating..." : "Update"}
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
