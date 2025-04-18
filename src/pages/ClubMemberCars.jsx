import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ClubMemberCars = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClubMemberCars = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/method/aviepros-get-clubmeber-cars?club_member=${user?.club_member}`
      );
      console.log("Fetched club member cars:", res?.data?.vehicles);
      setCars(res?.data?.vehicles || []);
    } catch (error) {
      console.error("Error fetching club member cars:", error);
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.club_member) {
      fetchClubMemberCars();
    } else {
      setIsLoading(false);
      setCars([]);
    }
  }, [user?.club_member]);

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    
      <div className="max-w-[545px] mx-auto px-4 sm:px-0 lg:px-0 md:px-2 pt-6 pb-3 space-y-6">
        {/* Header with Back Button */}
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
          <h1 className="text-2xl font-normal">Club Member Cars</h1>
        </div>

        {/* Club Member Cars List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg car-card-shadow space-y-4"
                >
                  {/* Title Section Skeleton */}
                  <div className="flex items-center gap-x-2 border-b border-border p-4">
                    <Skeleton width={20} height={20} />
                    <Skeleton width={100} height={20} />
                  </div>
                  {/* Content Section Skeleton */}
                  <div className="space-y-4 px-4 pb-4">
                    <div className="flex justify-between">
                      <Skeleton width={80} height={16} />
                      <Skeleton width={120} height={16} />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton width={80} height={16} />
                      <Skeleton width={120} height={16} />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton width={80} height={16} />
                      <Skeleton width={120} height={16} />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton width={80} height={16} />
                      <Skeleton width={120} height={16} />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton width={80} height={16} />
                      <Skeleton width={20} height={20} circle />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cars?.length > 0 ? (
            cars.map((car, index) => (
              <div
                key={index}
                className="bg-white rounded-lg car-card-shadow space-y-4"
              >
                <div className="flex items-center gap-x-2 border-b border-border p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    color="#57c113"
                    fill="none"
                  >
                    <path
                      d="M2.98052 13.2888C2.25918 14.591 2.05755 16.2028 2.00119 17.0021C1.98176 17.2775 2.20345 17.5 2.47992 17.5H3.98173M2.98052 13.2888C2.98052 10.144 3.89594 6.34904 5.72678 4.71122C5.88815 4.56686 6.10124 4.5 6.31787 4.5H11.1118C11.6911 4.5 12.2694 4.6171 12.7553 4.93222C13.9539 5.70953 15.7652 7.27971 17.3038 9.68934C17.4311 9.88859 17.6211 10.0398 17.8435 10.1204C18.7292 10.4415 19.7153 10.887 20.3463 11.1839C20.7723 11.3844 21.1116 11.7341 21.273 12.176C21.7174 13.393 21.9682 14.7508 22 16.9994C22.0038 17.2755 21.7793 17.5 21.5028 17.5H20.001M2.98052 13.2888C3.34135 12.6373 3.83222 12.0634 4.5 11.7073M15.9962 17.5H7.98654"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8 17.5C8 18.6046 7.10457 19.5 6 19.5C4.89543 19.5 4 18.6046 4 17.5C4 16.3954 4.89543 15.5 6 15.5C7.10457 15.5 8 16.3954 8 17.5Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <path
                      d="M20 17.5C20 18.6046 19.1046 19.5 18 19.5C16.8954 19.5 16 18.6046 16 17.5C16 16.3954 16.8954 15.5 18 15.5C19.1046 15.5 20 16.3954 20 17.5Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <path
                      d="M17.5 10C14.5 9 11 8.5 7 9C7 7 8 5 8.5 4.5"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8 11H9"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <h2 className="text-sm font-medium text-gray-900">
                    Vehicle {index + 1}
                  </h2>
                </div>
                <div className="space-y-4 px-4 pb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 font-light">Model</span>
                    <span className="text-sm font-normal">{car?.model || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 font-light">Manufacturer</span>
                    <span className="text-sm font-normal">{car?.make || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 font-light">Year</span>
                    <span className="text-sm font-normal">{car?.year || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 font-light">Number Plate</span>
                    <span className="text-sm font-normal">{car?.license_plate || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 font-light">Access Tag</span>
                    <span className="text-sm font-normal">{car?.access_tag || "Not Available"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 font-light">Color</span>
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: car?.vehicle_color || "#000000" }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="36"
                height="36"
                color="#d5d7da"
                fill="none"
              >
                <path
                  d="M9.0072 17C9.0072 18.1046 8.11177 19 7.0072 19C5.90263 19 5.0072 18.1046 5.0072 17C5.0072 15.8954 5.90263 15 7.0072 15C8.11177 15 9.0072 15.8954 9.0072 17Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M19.0072 17C19.0072 18.1046 18.1118 19 17.0072 19C15.9026 19 15.0072 18.1046 15.0072 17C15.0072 15.8954 15.9026 15 17.0072 15C18.1118 15 19.0072 15.8954 19.0072 17Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M2.00722 10H18.0072M2.00722 10C2.00722 10.78 1.98723 13.04 2.01122 15.26C2.04719 15.98 2.1671 16.58 5.00893 17M2.00722 10C2.22306 8.26 3.16234 6.2 3.64197 5.42M9.00722 10V5M14.9973 17H9.00189M2.02321 5H12.2394C12.2394 5 12.779 5 13.2586 5.048C14.158 5.132 14.9134 5.54 15.6688 6.56C16.4687 7.64 17.0837 9.008 17.8991 9.74C19.2541 10.9564 21.8321 10.58 21.976 13.16C22.012 14.48 22.012 15.92 21.952 16.16C21.8557 16.8667 21.3108 16.9821 20.633 17C20.0448 17.0156 19.3357 16.9721 18.9903 17"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              <span className="text-gray-400 text-xs font-normal">
                No result found
              </span>
            </div>
          )}
        </div>
      </div>
    
  );
};

export default ClubMemberCars;