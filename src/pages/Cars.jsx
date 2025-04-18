import React from "react";
import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";
import HomeOwnerCars from "./HomeOwnerCars";
import ClubMemberCars from "./ClubMemberCars";

const dashboardLayouts = {
  "Primary Member": HomeOwnerCars,
  "Club Primary Member": ClubMemberCars,
};

const Cars = () => {
  const { user } = useAuth();

  const userRole = user?.roles[0] || "Primary Member";
  const LayoutComponent = dashboardLayouts[userRole] || DashboardLayout;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar user={user} />
      <LayoutComponent />
    </div>
  );
};

export default Cars;
