import React from "react";
import Navbar from "../components/Navbar";
import DashboardLayout from "../components/DashboardLayout";
import ClubDashboardLayout from "../components/ClubDashboardLayout";
import { useAuth } from "../context/AuthContext";

const dashboardLayouts = {
  "Primary Member": DashboardLayout,
  "Club Primary Member": ClubDashboardLayout
};

const Dashboard = () => {
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

export default Dashboard;