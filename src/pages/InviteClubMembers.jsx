import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";

const InviteClubMembers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [invitingMember, setInvitingMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [memberToRevoke, setMemberToRevoke] = useState(null);

  // Fetch club members
  const fetchClubMembers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/method/aviepros-invite-secondary-clubmember?club_member=${user?.club_member}`
      );
      console.log("Fetched club secondary members:", res?.data);
      setMembers(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching club members:", error);
      setMembers([]);
      toast.error("Failed to fetch members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Invite a club member
  const inviteMember = async (memberId) => {
    setInvitingMember(memberId); // Set loading state for this member
    try {
      // Optimistically update the UI
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.name === memberId
            ? { ...member, access_status: "Invited" }
            : member
        )
      );

      const res = await axiosInstance.post(
        "/api/method/merak_hotel_security.aviepros.aviepros_invite_club_secondary_member",
        {
          club_member_id: user?.club_member,
          member_id: memberId,
        }
      );

      // Check API response status
      if (res.data.status === "success") {
        console.log("Club member invited successfully:", res.data);
        toast.success(res.data.message || "Member invited successfully");
      } else {
        // Handle API error response
        console.error("API error:", res.data.message);
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.name === memberId
              ? { ...member, access_status: "Not Invited" }
              : member
          )
        );
        toast.error(res.data.message || "Failed to invite member.");
      }
    } catch (error) {
      // Handle network errors or unexpected issues
      console.error("Error inviting club member:", error);
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.name === memberId
            ? { ...member, access_status: "Not Invited" }
            : member
        )
      );
      toast.error("Failed to invite member. Please try again.");
    } finally {
      setInvitingMember(null);
    }
  };

  // Revoke access for a club member
  const revokeMember = async (memberId) => {
    setInvitingMember(memberId); // Reuse loading state for this member
    try {
      // Optimistically update the UI
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.name === memberId
            ? { ...member, access_status: "Revoked" }
            : member
        )
      );

      const res = await axiosInstance.post(
        "/api/method/merak_hotel_security.aviepros.aviepros_revoke_club_secondary_member",
        {
          club_member_id: user?.club_member,
          member_id: memberId,
        }
      );
      console.log("Revoke member response:", res.data);
      // Check API response status
      if (res.data.message.status === "success") {
        console.log("Club member access revoked successfully:", res.data);
        toast.success(res.data.message.message || "Access revoked successfully");
      } else {
        console.error("API error:", res.data.message);
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.name === memberId
              ? { ...member, access_status: "Invited" }
              : member
          )
        );
        toast.error(res.data.message || "Failed to revoke access.");
      }
    } catch (error) {
      console.error("Error revoking club member access:", error);
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.name === memberId
            ? { ...member, access_status: "Invited" }
            : member
        )
      );
      const errorMessage = error.response?.data?.message || "Failed to revoke access. Please try again.";
      toast.error(errorMessage);
    } finally {
      setInvitingMember(null);
      setShowModal(false); // Close the modal after revocation
    }
  };

  // Open the confirmation modal
  const openRevokeModal = (member) => {
    setMemberToRevoke(member);
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setMemberToRevoke(null);
  };

  // Confirm revocation
  const confirmRevoke = () => {
    if (memberToRevoke) {
      revokeMember(memberToRevoke.name);
    }
  };

  useEffect(() => {
    if (user?.club_member) {
      fetchClubMembers();
    }
  }, [user?.club_member]);

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <Toaster richColors />

      {/* Confirmation Modal */}
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
                <span className="font-medium">{memberToRevoke?.guest_name || "this member"}</span>?
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
                  disabled={invitingMember === memberToRevoke?.name}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 ${
                    invitingMember === memberToRevoke?.name
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {invitingMember === memberToRevoke?.name ? "Revoking..." : "Yes"}
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
          <h1 className="text-2xl font-normal">Club Members</h1>
        </div>

        {/* Members List */}
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
            ) : members.length > 0 ? (
              <motion.div
                key="members"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="divide-y divide-[#E9EAEB]"
              >
                {members?.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="flex justify-between items-center p-4"
                  >
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {member.guest_name || "N/A"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {member.contact || "N/A"}
                      </p>
                    </div>
                    {member.access_status === "Not Invited" ? (
                      <button
                        onClick={() => inviteMember(member.name)}
                        disabled={invitingMember === member.name}
                        className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200 ${
                          invitingMember === member.name
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer rounded-md"
                        }`}
                      >
                        {invitingMember === member.name
                          ? "Inviting..."
                          : "Invite"}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            member.access_status === "Invited"
                              ? "bg-green-100 text-green-800"
                              : member.access_status === "Revoked"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.access_status}
                        </span>
                        {member.access_status === "Invited" && (
                          <button
                            onClick={() => openRevokeModal(member)}
                            disabled={invitingMember === member.name}
                            className={`px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors duration-200 ${
                              invitingMember === member.name
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer rounded-md"
                            }`}
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    )}
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
    </>
  );
};

export default InviteClubMembers;