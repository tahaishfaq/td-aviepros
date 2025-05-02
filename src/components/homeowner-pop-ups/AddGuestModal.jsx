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

export default function AddGuestModal({ open, setOpen, onUpdate }) {
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      relationship: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      const json = {
        home_address_id: user?.homeowner_address,
        first_name: values.firstName,
        last_name: values.lastName,
        visiting_as: values.relationship,
      };
      console.log("Form values:", json);
      try {
        await axiosInstance
          .post("/api/method/aviepros-add-guest", json)
          .then((res) => {
            console.log("Guest added successfully:", res.data);
            toast.success("Guest added successfully");
            onUpdate();
          });
      } catch (error) {
        console.error("Error adding guest:", error);
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
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-5 text-left align-middle shadow-popup transition-all space-y-[14px]">
                  <div className="flex justify-between items-center">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-medium leading-6"
                    >
                      {user?.is_101_duntreath === 1
                        ? "Invite Employee"
                        : "Invite Guest"}
                    </DialogTitle>
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Modal Description */}
                  <div className="font-light max-w-xs">
                    <p className="text-sm text-gray-500">
                      Enter{" "}
                      {user?.is_101_duntreath === 1 ? "employee" : "guest"}{" "}
                      details to notify security and ensure a seamless check-in
                      experience.
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

                    <div className="border border-[#00000014] rounded-lg py-2 px-4">
                      <label
                        htmlFor="relationship"
                        className="block text-sm font-light text-gray-500"
                      >
                        Relationship
                      </label>
                      <input
                        type="text"
                        id="relationship"
                        name="relationship"
                        className="text-sm outline-none border-none w-full bg-transparent"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.relationship}
                      />
                    </div>

                    <div className="">
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white outline-none cursor-pointer"
                        disabled={formik.isSubmitting}
                      >
                        {formik.isSubmitting
                          ? "Adding..."
                          : user?.is_101_duntreath === 1
                          ? "Add Employee"
                          : "Add Guest"}
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
