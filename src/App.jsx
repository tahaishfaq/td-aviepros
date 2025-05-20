// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectRoute";
import Settings from "./pages/Settings";

import Cars from "./pages/Cars";
import MembersLayout from "./pages/MembersLayout";
import InviteManagers from "./pages/InviteManagers";
import ResetPassword from "./pages/ResetPassword";
import ForgetPassword from "./pages/ForgetPassword";
import { LandingPage } from "./pages/LandingPage";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
        <Route path="/landing" element={<LandingPage />} />
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/members" element={<MembersLayout />} />
            <Route path="/managers" element={<InviteManagers />} />
          </Route>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;