import React, { useEffect, useState, useContext } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(input.toLowerCase()),
  );

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  //MENU CLOSE
  useEffect(() => {
    const handleClickOutside = () => {
      if (showMenu) setShowMenu(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showMenu]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUnseenMessages((prev) => ({
      ...prev,
      [user._id]: 0,
    }));
  };

  return (
    <div
      className={`bg-[#818582]/10 h-full p-5 overflow-y-auto scrollbar-hide text-white ${selectedUser ? "max-md:hidden" : "w-full md:w-80 md:rounded-r-xl"}`}
    >
      {" "}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          {/*  3-DOT MENU (CLICK BASED) */}
          <div className="relative py-2" onClick={(e) => e.stopPropagation()}>
            <img
              onClick={() => setShowMenu(!showMenu)}
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer hover:opacity-70 transition-opacity active:scale-90"
            />

            {showMenu && (
              <div className="absolute top-full right-0 z-50 w-36 p-2 mt-2 rounded-lg bg-[#282142] border border-white/10 text-gray-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div
                  onClick={() => {
                    navigate("/profile");
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 p-2 cursor-pointer hover:bg-white/5 rounded-md transition text-sm"
                >
                  Edit Profile
                </div>
                <hr className="my-1 border-white/5" />
                <div
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 p-2 cursor-pointer hover:bg-red-500/10 hover:text-red-400 rounded-md transition text-sm font-medium"
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search user..."
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              onClick={() => handleUserSelect(user)}
              key={user._id}
              className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                selectedUser?._id === user._id
                  ? "bg-[#282142]"
                  : "hover:bg-[#282142]/30"
              }`}
            >
              <div className="relative">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1e1e1e] rounded-full"></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.fullName}</p>
                <p
                  className={`text-[10px] ${onlineUsers.includes(user._id) ? "text-green-400" : "text-gray-400"}`}
                >
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </p>
              </div>

              {unseenMessages[user._id] > 0 && (
                <div className="bg-violet-600 text-white text-[10px] font-bold h-5 min-w-[20px] px-1 flex justify-center items-center rounded-full">
                  {unseenMessages[user._id]}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-xs text-center mt-10">
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
