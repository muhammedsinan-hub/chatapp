import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";

const HomePage = () => {

  const [selectedUser, setSelectedUser] = useState(false);

  return (

    <div className="w-full h-screen p-2 sm:px-[8%] sm:py-[3%] bg-transparent">

      <div
        className="backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden h-full flex relative bg-[#121212]/40"
      >

        {/* Sidebar */}
        <Sidebar />

        {/* Chat Area */}
        <ChatContainer />

        {/* Right Sidebar - only desktop */}
        <div className="hidden lg:block">
          <RightSidebar
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </div>

      </div>

    </div>

  );
};

export default HomePage;