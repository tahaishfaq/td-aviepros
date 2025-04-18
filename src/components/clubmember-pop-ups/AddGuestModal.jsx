import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
  } from "@headlessui/react";
  import { Fragment } from "react";
  import { useFormik } from "formik";
  import { useAuth } from "../../context/AuthContext";
  import axiosInstance from "../../utils/axiosInstance";
  import { toast, Toaster } from "sonner"; // Import sonner for toast notifications
  
  export default function AddGuestModal({ open, setOpen, onUpdate }) {
    const { user } = useAuth();
  
    const formik = useFormik({
      initialValues: {
        firstName: "",
        lastName: "",
      },
      onSubmit: async (values, { setSubmitting }) => {
        const json = {
          club_member: user?.club_member,
          guest_name: values.firstName,
          guest_last_name: values.lastName,
        };
        try {
          await axiosInstance
            .post(`/api/method/aviepros-addguest-clubmembers`, json)
            .then((res) => {
              console.log("Guest added successfully:", res.data);
              toast.success("Guest added successfully"); // Show success toast
              onUpdate(); // Call the onUpdate function from parent
            });
        } catch (error) {
          console.error("Error adding guest:", error);
          toast.error("Failed to add guest"); // Show error toast
        } finally {
          setSubmitting(false); // Reset submitting state
          formik.resetForm(); // Reset form fields
          setOpen(false); // Close the modal
        }
      },
    });
  
    return (
      <>
        <Toaster richColors /> {/* Add Toaster for toast notifications */}
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
                  <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-5 text-left align-middle shadow-popup transition-all space-y-[14px]">
                    <div className="flex justify-between items-center">
                      <DialogTitle
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Add Guest
                      </DialogTitle>
                      <button
                        type="button"
                        className="cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={() => setOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 6L18 18M18 6L6 18" />
                        </svg>
                      </button>
                    </div>
  
                    {/* Modal Description */}
                    <div className="font-light max-w-xs">
                      <p className="text-sm text-gray-500">
                        Enter guest details to notify security and ensure a seamless
                        check-in experience.
                      </p>
                    </div>
  
                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-4">
                        <div className="border border-[#00000014] rounded-lg py-2 px-4">
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-light text-gray-500"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="text-sm outline-none border-none w-full bg-transparent"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.firstName}
                          />
                        </div>
  
                        <div className="border border-[#00000014] rounded-lg py-2 px-4">
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-light text-gray-500"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="text-sm outline-none border-none w-full bg-transparent"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.lastName}
                          />
                        </div>
                      </div>
  
                      <div>
                        <button
                          type="submit"
                          className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white outline-none cursor-pointer hover:bg-green-600 transition-colors"
                          disabled={formik.isSubmitting}
                        >
                          {formik.isSubmitting ? "Adding..." : "Add Guest"}
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