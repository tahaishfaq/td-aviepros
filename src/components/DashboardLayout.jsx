import {
  CalendarIcon,
  DocumentTextIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import claps from "../assets/icons/clap 1.png";
import location_user from "../assets/icons/location-user-01.png";
import add_team from "../assets/icons/add-team.png";
import arrow from "../assets/icons/arrow.png";
import calendar from "../assets/icons/calendar-01.png";
import report from "../assets/icons/file-02.png";
import AddGuestModal from "./pop-ups/AddGuestModal";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import EditGuestModal from "./pop-ups/EditGuestModal";

const quickActions = [
  {
    title: "Vacation Alert",
    icon: calendar,
    // badge: 17,
  },
  {
    title: "Day Visitor",
    icon: location_user,
  },
  {
    title: "Add Guest",
    icon: add_team,
  },
  {
    title: "Incident Report",
    icon: report,
  },
];

const vacations = [
  {
    text: "Office ipsum you must be muted. Back-end incentivize sandwich high creep finish cross-pollination. Our digital underlying proceduralize don’t.",
    date: "17 March – 25 March",
  },
  {
    text: "Office ipsum you must be muted. Back-end incentivize sandwich high creep finish cross-pollination. Our digital underlying proceduralize don’t.",
    date: "17 March – 25 March",
  },
];

const DashboardLayout = () => {
  const { user } = useAuth();
  // Separate states for each modal
  const [isDayVisitorModalOpen, setIsDayVisitorModalOpen] = useState(false);
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [isVacationAlertModalOpen, setIsVacationAlertModalOpen] =
    useState(false);
  const [isIncidentReportModalOpen, setIsIncidentReportModalOpen] =
    useState(false);

  // Handle card clicks to open the corresponding modal
  const handleCardClick = (title) => {
    switch (title) {
      case "Day Visitor":
        setIsDayVisitorModalOpen(true);
        break;
      case "Add Guest":
        setIsAddGuestModalOpen(true);
        break;
      case "Vacation Alert":
        setIsVacationAlertModalOpen(true);
        break;
      case "Incident Report":
        setIsIncidentReportModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Close functions for each modal
  const closeDayVisitorModal = () => setIsDayVisitorModalOpen(false);
  const closeAddGuestModal = () => setIsAddGuestModalOpen(false);
  const closeVacationAlertModal = () => setIsVacationAlertModalOpen(false);
  const closeIncidentReportModal = () => setIsIncidentReportModalOpen(false);

  const visitors = [
    {
      id: 1,
      name: "Wilson Schleifer",
      phone: "415-555-0132",
      type: "Day Visitor",
    },
    {
      id: 2,
      name: "Wilson Schleifer",
      phone: "415-555-0132",
      type: "Contractor",
    },
    {
      id: 3,
      name: "Wilson Schleifer",
      phone: "415-555-0132",
      type: "Delivery",
    },
  ];

  const getPillClasses = (visitorType) => {
    const typeLower = visitorType.toLowerCase();

    switch (typeLower) {
      case "day visitor":
        return "bg-[#EFF8FF] text-[#175CD3]";
      case "contractor":
        return "bg-[#EEF4FF] text-[#3538CD]";
      case "delivery":
        return "bg-[#FFF6ED] text-[#C4320A]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  const [isEditGuestModalOpen, setIsEditGuestModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guests, setGuests] = useState([]);

  const fetchGuests = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/method/aviepros-fetch-guests?homeowner_address=${user?.homeowner_address}`
      );
      console.log("Fetched data:", res.data);
      setGuests(res?.data?.guests);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    if (user?.homeowner_address) {
      fetchGuests();
    }
  }, [user?.homeowner_address]);

  const handleGuestClick = (guest) => {
    setSelectedGuest(guest);
    setIsEditGuestModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-0 lg:px-0 md:px-2 pt-6 pb-3 space-y-6">
      <div className="">
        <h1 className="text-3xl font-medium">
          hey! Welcome to{" "}
          <div className="flex gap-x-2">
            <span className="">AVIE PRO</span>
            <img src={claps} alt="clap" className="size-7 object-contain" />
          </div>
        </h1>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions?.map((action) => (
          <div
            key={action.title}
            className="bg-white p-4 rounded-xl cursor-pointer"
            onClick={() => handleCardClick(action.title)}
          >
            <div className="flex flex-col w-full gap-y-6">
              <div className="flex items-center justify-between">
                <img
                  src={action.icon}
                  alt={`${action.title} icon`}
                  className="size-8"
                />
                <div className="flex items-center">
                  {action.badge && (
                    <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full mr-2">
                      {action.badge}
                    </span>
                  )}
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

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Vacations Section */}
        <div className="bg-white p-4 rounded-lg border border-[#F5F5F5] space-y-3">
          <h2 className="text-sm font-normal text-gray-600">Vacations</h2>
          {vacations.length > 0 ? (
            <div className="space-y-4 divide-y-1 divide-[#E9EAEB]">
              {vacations?.map((item, index) => (
                <div key={index} className="space-y-2 pb-4">
                  <p className="text-gray-500 text-sm font-normal">
                    {item.text}
                  </p>

                  <p className="text-gray-700 font-medium text-sm bg-[#F5F5F5] rounded-full py-1.5 px-2.5 inline-flex">
                    {item.date}
                  </p>
                </div>
              ))}
            </div>
          ) : (
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
              <span className="text-gray-400 text-xs font-normal ">
                No result found
              </span>
            </div>
          )}
        </div>

        {/* Visitors Section */}
        <div className="bg-white p-4 rounded-lg border border-[#F5F5F5] space-y-3">
          <h2 className="text-sm font-normal text-gray-600">Visitor</h2>
          {visitors?.length > 0 ? (
            <div className="space-y-3">
              {visitors?.map((visitor) => (
                <div
                  key={visitor.id}
                  className="bg-white p-3 rounded-lg border border-[#E9EAEB] flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium">{visitor.name}</p>
                    <p className="text-gray-500 text-xs">{visitor.phone}</p>
                  </div>

                  <span
                    className={`font-medium text-sm rounded-full py-1.5 px-4 capitalize ${getPillClasses(
                      visitor.type
                    )}`}
                  >
                    {visitor.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
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
              <span className="text-gray-400 text-xs font-normal ">
                No result found
              </span>
            </div>
          )}
        </div>

        {/* Guests Section */}
        <div className="bg-white p-4 rounded-lg border border-[#F5F5F5] space-y-3">
          <h2 className="text-sm font-normal text-gray-600">Guest</h2>
          {guests?.length > 0 ? (
            <div className="space-y-3 cursor-pointer">
              {guests?.map((guest, index) => (
                <div
                  key={index}
                  onClick={()=> handleGuestClick(guest)}
                  className="bg-white p-3 rounded-lg border border-[#E9EAEB] flex justify-between items-center"
                >
                  <div>
                    <p className="text-[15px] font-medium">{guest.guest_name}</p>
                  </div>

                  <span
                    className={`font-medium text-gray-700 bg-[#F5F5F5] text-sm rounded-full py-0.5 px-3 capitalize`}
                  >
                    {guest?.visiting_as}
                  </span>
                </div>
              ))}
            </div>
          ) : (
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
              <span className="text-gray-400 text-xs font-normal ">
                No result found
              </span>
            </div>
          )}
        </div>

        {/* Members Section */}
        <div className="bg-white p-4 rounded-lg border border-[#F5F5F5] space-y-3">
          <h2 className="text-sm font-normal text-gray-600">Member</h2>
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
            <span className="text-gray-400 text-xs font-normal ">
              No result found
            </span>
          </div>
        </div>
      </div>

      <AddGuestModal open={isAddGuestModalOpen} setOpen={closeAddGuestModal} onUpdate={fetchGuests}/>
      <EditGuestModal open={isEditGuestModalOpen} setOpen={setIsEditGuestModalOpen} guest={selectedGuest} onUpdate={fetchGuests}/>

      {isDayVisitorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Day Visitor
              </h2>
              <button
                onClick={closeDayVisitorModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-600">
              This is the Day Visitor pop-up. Add your content here.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeDayVisitorModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vacation Alert Modal */}
      {isVacationAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Vacation Alert
              </h2>
              <button
                onClick={closeVacationAlertModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-600">
              This is the Vacation Alert pop-up. Add your content here.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeVacationAlertModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Report Modal */}
      {isIncidentReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Incident Report
              </h2>
              <button
                onClick={closeIncidentReportModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-600">
              This is the Incident Report pop-up. Add your content here.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeIncidentReportModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
