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


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/members" element={<MembersLayout />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;