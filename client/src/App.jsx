import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import assets from "./assets/assets";

function App() {

  const { authUser, isCheckingAuth } = useContext(AuthContext);

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {

    if (!isCheckingAuth) {
      setTimeout(() => {
        setShowLoader(false);
      }, 3000);
    }

  }, [isCheckingAuth]);

  if (isCheckingAuth || showLoader) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center bg-[#1a1a1a]">

        {/* Logo */}
        <img
          src={assets.logo}
          alt="Logo"
          className="w-20 sm:w-24 mb-4"
        />

        {/* Welcome Text */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Welcome Back
        </h1>

        <p className="text-sm text-gray-400 mt-2 mb-8">
          Preparing your chat experience...
        </p>

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-t-purple-500 border-gray-700 rounded-full animate-spin"></div>

        {/* Bottom Message */}
        <p className="text-sm text-gray-400 mt-4">
          Please wait while we connect everything...
        </p>

      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] bg-[url('/bgImage.svg')] bg-cover min-h-screen">

      <Toaster />

      <Routes>

        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

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