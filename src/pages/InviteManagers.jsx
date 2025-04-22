import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";

const InviteManagers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Managers");
  const [managers, setManagers] = useState([]);
  const [groundWorkers, setGroundWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [invitingManager, setInvitingManager] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [managerToRevoke, setManagerToRevoke] = useState(null);

  // Fetch managers and ground workers
  const fetchManagers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/method/aviepros-get-members?homeowner_address=${user?.homeowner_address}`
      );
      console.log("Fetched managers:", res?.data?.data);
      // Format the API response and split into managers and ground workers
      const formattedData = res?.data?.data?.map((item) => ({
        ...item,
        member_type: item.member_type === "Non-Resident" ? "Ground Workers" : item.member_type === "Secondary" && "Managers",
      })) || [];

      // Split into two arrays
      const managersList = formattedData.filter((item) => item.member_type === "Managers");
      const groundWorkersList = formattedData.filter((item) => item.member_type === "Ground Workers");

      setManagers(managersList);
      setGroundWorkers(groundWorkersList);
    } catch (error) {
      console.error("Error fetching managers:", error);
      setManagers([]);
      setGroundWorkers([]);
      toast.error("Failed to fetch managers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Invite a manager (only for Managers tab)
  const inviteManager = async (managerId) => {
    setInvitingManager(managerId);
    try {
      setManagers((prevManagers) =>
        prevManagers.map((manager) =>
          manager.name === managerId
            ? { ...manager, access_status: "Invited" }
            : manager
        )
      );

      const res = await axiosInstance.post(
        "/api/method/merak_hotel_security.aviepros.aviepros_invite_secondary_member",
        {
          homeowner_address: user?.homeowner_address,
          member_id: managerId,
        }
      );

      if (res.data.status === "success") {
        console.log("Manager invited successfully:", res.data);
        toast.success(res.data.message || "Manager invited successfully");
      } else {
        console.error("API error:", res.data.message);
        setManagers((prevManagers) =>
          prevManagers.map((manager) =>
            manager.name === managerId
              ? { ...manager, access_status: "Not Invited" }
              : manager
          )
        );
        toast.error(res.data.message || "Failed to invite manager.");
      }
    } catch (error) {
      console.error("Error inviting manager:", error);
      setManagers((prevManagers) =>
        prevManagers.map((manager) =>
          manager.name === managerId
            ? { ...manager, access_status: "Not Invited" }
            : manager
        )
      );
      toast.error("Failed to invite manager. Please try again.");
    } finally {
      setInvitingManager(null);
    }
  };

  // Revoke access for a manager (only for Managers tab)
  const revokeManager = async (managerId) => {
    setInvitingManager(managerId);
    try {
      setManagers((prevManagers) =>
        prevManagers.map((manager) =>
          manager.name === managerId
            ? { ...manager, access_status: "Revoked" }
            : manager
        )
      );

      const res = await axiosInstance.post(
        "/api/method/merak_hotel_security.aviepros.aviepros_revoke_secondary_member",
        {
          homeowner_address: user?.homeowner_address,
          member_id: managerId,
        }
      );

      console.log("Revoke response:", res.data);
    } catch (error) {
      console.error("Error revoking manager access:", error);
      setManagers((prevManagers) =>
        prevManagers.map((manager) =>
          manager.name === managerId
            ? { ...manager, access_status: "Invited" }
            : manager
        )
      );
      toast.error("Failed to revoke access. Please try again.");
    } finally {
      setInvitingManager(null);
      setShowModal(false);
    }
  };

  // Open the confirmation modal
  const openRevokeModal = (manager) => {
    setManagerToRevoke(manager);
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setManagerToRevoke(null);
  };

  // Confirm revocation
  const confirmRevoke = () => {
    if (managerToRevoke) {
      revokeManager(managerToRevoke.name);
    }
  };

  useEffect(() => {
    if (user?.homeowner_address) {
      fetchManagers();
    }
  }, [user?.homeowner_address]);

  // Filter managers based on the active tab
  const filteredList = activeTab === "Managers" ? managers : groundWorkers;

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <Toaster richColors />

      <div className="bg-gray-100 min-h-screen">
        <Navbar user={user} />
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#252B377A] flex items-center justify-center z-50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Confirm Revoke Access
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to revoke access for{" "}
                  <span className="font-medium">
                    {managerToRevoke?.owner_name}
                  </span>
                  ?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRevoke}
                    disabled={invitingManager === managerToRevoke?.name}
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 ${
                      invitingManager === managerToRevoke?.name
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {invitingManager === managerToRevoke?.name
                      ? "Revoking..."
                      : "Yes"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-[545px] mx-auto px-4 sm:px-0 lg:px-0 md:px-2 pt-6 pb-3 space-y-8">
          <div className="flex items-end gap-x-2.5">
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
            <h1 className="text-2xl font-normal">Managers</h1>
          </div>

          {/* Tabs */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 grid-cols-2 relative">
            {["Managers", "Ground Workers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative sm:px-4 lg:px-4 px-2 py-2 rounded-lg font-medium text-sm transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-105 ${
                  activeTab === tab ? "bg-green-600 text-white scale-105" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Managers/Ground Workers List */}
          <div className="bg-white rounded-lg space-y-4">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="divide-y divide-[#E9EAEB]"
                >
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4"
                    >
                      <div className="space-y-2">
                        <Skeleton width={150} height={16} />
                        <Skeleton width={100} height={14} />
                      </div>
                      <Skeleton width={60} height={24} />
                    </div>
                  ))}
                </motion.div>
              ) : filteredList.length > 0 ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="divide-y divide-[#E9EAEB]"
                >
                  {filteredList?.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className={`flex justify-between items-center p-4`}
                    >
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.owner_name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.contact ? item.contact : "---"}
                        </p>
                      </div>
                      {/* Show Invite/Revoke buttons only for Managers */}
                      {activeTab === "Managers" ? (
                        item.access_status === "Not Invited" ? (
                          <button
                            onClick={() => inviteManager(item.name)}
                            disabled={invitingManager === item.name}
                            className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200 ${
                              invitingManager === item.name
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer rounded-md"
                            }`}
                          >
                            {invitingManager === item.name
                              ? "Inviting..."
                              : "Invite"}
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.access_status === "Invited"
                                  ? "bg-green-100 text-green-800"
                                  : item.access_status === "Revoked"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item.access_status}
                            </span>
                            {item.access_status === "Invited" && (
                              <button
                                onClick={() => openRevokeModal(item)}
                                disabled={invitingManager === item.name}
                                className={`px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors duration-200 ${
                                  invitingManager === item.name
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer rounded-md"
                                }`}
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        )
                      ) : null}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-col items-center justify-center h-full py-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="36"
                    height="36"
                    color="#d5d7da"
                    fill="none"
                  >
                    <path
                      d="M15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16 4C17.6568 4 19 5.34315 19 7C19 8.22309 18.268 9.27523 17.2183 9.7423"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M13.7143 14H10.2857C7.91876 14 5.99998 15.9188 5.99998 18.2857C5.99998 19.2325 6.76749 20 7.71426 20H16.2857C17.2325 20 18 19.2325 18 18.2857C18 15.9188 16.0812 14 13.7143 14Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17.7143 13C20.0812 13 22 14.9188 22 17.2857C22 18.2325 21.2325 19 20.2857 19"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8 4C6.34315 4 5 5.34315 5 7C5 8.22309 5.73193 9.27523 6.78168 9.7423"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3.71429 19C2.76751 19 2 18.2325 2 17.2857C2 14.9188 3.91878 13 6.28571 13"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span className="text-gray-400 text-xs font-normal">
                    No result found
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteManagers;