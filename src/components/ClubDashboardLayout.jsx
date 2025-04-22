import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AddGuestModal from "./clubmember-pop-ups/AddGuestModal";
import AddVisitorCallInModal from "./clubmember-pop-ups/AddVisitorCallInModal";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import moment from "moment";
import usertime from "../assets/icons/user-time.png";
import usergroup from "../assets/icons/user-group.png";
import addteam from "../assets/icons/add-team.png";
import arrow from "../assets/icons/arrow.png";
import trash from "../assets/icons/delete.png";
import { toast, Toaster } from "sonner";

const quickActions = [
  { title: "Guest List", icon: usertime },
  { title: "Visitor Call", icon: addteam },
  { title: "Secondary Member", icon: usergroup },
];

const ClubDashboardLayout = () => {
  const { user } = useAuth();
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [isAddVisitorModalOpen, setIsAddVisitorModalOpen] = useState(false);
  const [guestList, setGuestList] = useState([]);
  const [dayVisitors, setDayVisitors] = useState([]);
  const [secondaryMembers, setSecondaryMembers] = useState([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const [isLoadingVisitors, setIsLoadingVisitors] = useState(true);

  const getPillClasses = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "invited":
        return "bg-green-100 text-green-700";
      case "revoked":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const fetchGuestList = async () => {
    setIsLoadingGuests(true);
    try {
      const res = await axiosInstance.get(
        `/api/resource/Club Access/${user?.club_member}`
      );
      console.log("Guest list data:", res?.data?.data);
      setGuestList(res?.data?.data?.guests || []);
      setSecondaryMembers(res?.data?.data?.allowed_guests || []);
    } catch (error) {
      console.error("Error fetching guest list:", error);
      setGuestList([]);
    } finally {
      setIsLoadingGuests(false);
    }
  };

  const fetchDayVisitors = async () => {
    const currentDate = moment()
      .startOf("day")
      .add(3, "hours")
      .format("MM-DD-YYYY HH:mm:ss");
    console.log("Current date:", currentDate);
    setIsLoadingVisitors(true);
    try {
      const res = await axiosInstance.get(
        `/api/resource/Visitor Call-In?fields=["*"]&filters=[["club_member","=","${user?.club_member}"],["termination_date",">","${currentDate}"]]`
      );
      console.log("Fetched visitors:", res?.data);
      setDayVisitors(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching visitors:", error);
      setDayVisitors([]);
    } finally {
      setIsLoadingVisitors(false);
    }
  };

  const handleDeleteGuest = async (name) => {
    const json = {
      club_member: user?.club_member,
      guest_id: name,
    };
    try {
      await axiosInstance
        .post(`/api/method/aviepros-deleteguest-clubmember`, json)
        .then((res) => {
          console.log("Guest deleted successfully:", res.data);
          toast.success("Guest deleted successfully");
          fetchGuestList();
        });
    } catch (error) {
      console.error("Error deleting guest:", error);
      toast.error("Failed to delete guest");
    }
  };

  const handleDeleteVisitor = async (visitor) => {
    try {
      await axiosInstance
        .delete(`/api/resource/Visitor Call-In/${visitor?.name}`)
        .then((res) => {
          console.log("Visitor deleted successfully:", res.data);
          toast.success("Visitor deleted successfully");
          fetchDayVisitors();
        });
    } catch (error) {
      console.error("Error deleting visitor:", error);
      toast.error("Failed to delete visitor");
    }
  };

  useEffect(() => {
    if (user?.club_member) {
      fetchGuestList();
      fetchDayVisitors();
    } else {
      setIsLoadingGuests(false);
      setIsLoadingVisitors(false);
    }
  }, [user?.club_member]);

  const handleCardClick = (title) => {
    if (title === "Guest List") {
      setIsAddGuestModalOpen(true);
    } else if (title === "Visitor Call") {
      setIsAddVisitorModalOpen(true);
    }
  };

  const NoResultFound = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="36"
        height="36"
        color="#d5d7da"
        fill="none"
      >
        <path
          d="M12.5 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453365 18.0441 4.1628 16.324 5.57757 15.4816C7.827 14.1422 10.4865 13.7109 13 14.1878"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M15.5 6.5C15.5 8.98528 13.4853 11 11 11C8.51472 11 6.5 8.98528 6.5 6.5C6.5 4.01472 8.51472 2 11 2C13.4853 2 15.5 4.01472 15.5 6.5Z"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <path
          d="M18.6911 14.5777L19.395 15.9972C19.491 16.1947 19.7469 16.3843 19.9629 16.4206L21.2388 16.6343C22.0547 16.7714 22.2467 17.3682 21.6587 17.957L20.6668 18.9571C20.4989 19.1265 20.4069 19.4531 20.4589 19.687L20.7428 20.925C20.9668 21.9049 20.4509 22.284 19.591 21.7718L18.3951 21.0581C18.1791 20.929 17.8232 20.929 17.6032 21.0581L16.4073 21.7718C15.5514 22.284 15.0315 21.9009 15.2554 20.925L15.5394 19.687C15.5914 19.4531 15.4994 19.1265 15.3314 18.9571L14.3395 17.957C13.7556 17.3682 13.9436 16.7714 14.7595 16.6343L16.0353 16.4206C16.2473 16.3843 16.5033 16.1947 16.5993 15.9972L17.3032 14.5777C17.6872 13.8074 18.3111 13.8074 18.6911 14.5777Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span className="text-gray-400 text-xs font-normal">No result found</span>
    </div>
  );

  return (
    <>
      <Toaster richColors />
      <div className="max-w-7xl mx-auto px-4 sm:px-0 lg:px-0 md:px-2 pt-6 pb-3 space-y-6">
        <div>
          <h1 className="text-3xl font-medium">
            hey! Welcome to{" "}
            <div className="flex gap-x-2">
              <span className="">AVIE PRO</span>
              <span className="text-green-500">🌿</span>
            </div>
          </h1>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <div
              key={action.title}
              onClick={() => handleCardClick(action.title)}
              className="bg-white p-4 rounded-xl cursor-pointer"
            >
              <div className="flex flex-col w-full gap-y-6">
                <div className="flex items-center justify-between">
                  <img
                    src={action.icon}
                    alt={`${action.title} icon`}
                    className="size-8"
                  />
                  <div className="flex items-center">
                    <img src={arrow} alt="Arrow icon" className="size-6" />
                  </div>
                </div>
                <span className="text-lg font-medium text-gray-900">
                  {action.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-[#F5F5F5] space-y-3">
            <h2 className="text-sm font-normal text-gray-600">Guest List</h2>
            {isLoadingGuests ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-lg border border-[#E9EAEB] flex justify-between items-center"
                  >
                    <div className="space-y-2">
                      <Skeleton height={20} width={120} />
                    </div>
                    <Skeleton height={20} width={20} />
                  </div>
                ))}
              </div>
            ) : guestList.length > 0 ? (
              <div className="space-y-3">
                {guestList.map((guest, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-lg border border-[#E9EAEB] flex justify-between items-center"
                  >
                    <div>
                      <p className="text-[15px] font-medium">
                        {guest?.guest_name + " " + guest?.guest_last_name}
                      </p>
                    </div>
                    <div onClick={() => handleDeleteGuest(guest?.name)}>
                      <img
                        src={trash}
                        className="size-5 cursor-pointer"
                        alt="Delete icon"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoResultFound />
            )}
          </div>

          {/* Visitor Call Section */}
          <div className="bg-white p-4 rounded-lg border border-[#F5F5F5] space-y-3">
            <h2 className="text-sm font-normal text-gray-600">Visitor Call</h2>
            {isLoadingVisitors ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-lg border border-[#E9EAEB] flex justify-between items-center"
                  >
                    <div className="space-y-2">
                      <Skeleton height={20} width={120} />
                    </div>
                    <Skeleton height={20} width={20} />
                  </div>
                ))}
              </div>
            ) : dayVisitors.length > 0 ? (
              <div className="space-y-3">
                {dayVisitors.map((visitor, index) => (
                  <div
                    key={index}
                    onClick={() => handleDeleteVisitor(visitor)}
                    className="bg-white p-3 rounded-lg border border-[#E9EAEB] flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {visitor?.visitor_name}
                      </p>
                    </div>
                    <img
                      src={trash}
                      className="size-5 cursor-pointer"
                      alt="Delete icon"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <NoResultFound />
            )}
          </div>

          {/* Secondary Member Section */}
          <div className="bg-white p-4 rounded-lg border border-[#F5F5F5] space-y-3">
            <h2 className="text-sm font-normal text-gray-600">
              Secondary Member
            </h2>
            {secondaryMembers?.length > 0 ? (
              <div className="space-y-3">
                {secondaryMembers?.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-lg border border-[#E9EAEB] flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">
                          {member.guest_name}
                        </p>
                        <p className="text-gray-500 text-xs">{member.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoResultFound />
            )}
          </div>
        </div>
      </div>
      <AddGuestModal
        open={isAddGuestModalOpen}
        setOpen={setIsAddGuestModalOpen}
        onUpdate={fetchGuestList}
      />
      <AddVisitorCallInModal
        open={isAddVisitorModalOpen}
        setOpen={setIsAddVisitorModalOpen}
        onUpdate={fetchDayVisitors}
      />
    </>
  );
};

export default ClubDashboardLayout;
