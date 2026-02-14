import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

function App() {
  const { authUser, isCheckingAuth } = useContext(AuthContext);
  const [showLoader, setShowLoader] = useState(true);

useEffect(() => {
  if (!isCheckingAuth) {
    setShowLoader(false);
  }
}, [isCheckingAuth]);


  if (isCheckingAuth || showLoader) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1a1a1a]">
        <div className="w-12 h-12 border-4 border-t-purple-500 border-gray-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
<div className="bg-[#1a1a1a] bg-[url('/bgImage.svg')] bg-cover min-h-screen">
      <Toaster />
      <Routes>
        {/* Show HomePage if logged in, otherwise redirect to LoginPage */}
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />

        {/* Prevent logged-in users from accessing the LoginPage */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        {/* Protect the ProfilePage - accessible only to logged-in users */}
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
