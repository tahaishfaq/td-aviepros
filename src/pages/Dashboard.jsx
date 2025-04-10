// src/pages/Dashboard.jsx
import React from "react";
import Navbar from "../components/Navbar";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";


const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar user={user} />
      <DashboardLayout />
    </div>
  );
};

export default Dashboard;