import React from "react";
import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";
import InviteHomeOwnerMembers from "./InviteHomeOwnerMembers";
import InviteClubMembers from "./InviteClubMembers";


const dashboardLayouts = {
  "Primary Member": InviteHomeOwnerMembers,
  "Secondary Member": InviteHomeOwnerMembers,
  "Club Primary Member": InviteClubMembers,
  "Club Secondary Member": InviteClubMembers,
};

const MembersLayout = () => {
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

export default MembersLayout;
