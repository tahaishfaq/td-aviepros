// src/components/pop-ups/EditGuestModal.jsx
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

export default function EditGuestModal({ open, setOpen, guest, onUpdate }) {
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: guest?.guest_name?.split(" ")[0] || "",
      lastName: guest?.guest_name?.split(" ")[1] || "",
      relationship: guest?.visiting_as || "",
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const json = {
        name: guest.name,
        homeowner_address: user?.homeowner_address,
        guest_name: values.firstName + " " + values.lastName,
        visiting_as: values.relationship,
      };
      console.log("Form values:", json);
      try {
        await axiosInstance
          .put(`/api/method/aviepros-update-guest`, json)
          .then((res) => {
            console.log("Guest updated successfully:", res.data);
            toast.success("Guest updated successfully");
            onUpdate();
          });
      } catch (error) {
        console.error("Error updating guest:", error);
        toast.error("Failed to update guest");
      } finally {
        setSubmitting(false);
        setOpen(false);
      }
    },
  });

  // Handle guest deletion
  const handleDelete = async () => {
    const json = {
      name: guest.name,
      homeowner_address: user?.homeowner_address,
    };
    console.log("Delete values:", json);
    try {
      await axiosInstance
        .post(`/api/method/aviepros-delete-guest`, json)
        .then((res) => {
          console.log("Guest deleted successfully:", res.data);
          toast.success("Guest deleted successfully");
          onUpdate();
        });
    } catch (error) {
      console.error("Error deleting guest:", error);
      toast.error("Failed to delete guest");
    } finally {
      setOpen(false);
    }
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
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-5 text-left align-middle shadow-popup transition-all space-y-[14px]">
                  <div className="flex justify-between items-center">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-medium leading-6"
                    >
                      Edit Guest
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
                    <div className="grid sm:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-4">
                      <div className="bg-[#F5F5F5] rounded-lg py-2 px-4">
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

                      <div className="bg-[#F5F5F5] rounded-lg py-2 px-4">
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

                    <div className="bg-[#F5F5F5] rounded-lg py-2 px-4">
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

                    <div className="flex items-center gap-x-3 pt-2">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-lg bg-[#D92D20] px-6 py-3 text-sm font-medium text-white outline-none cursor-pointer"
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
