import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = ({ selectedUser, messages }) => {
  const { logout, onlineUsers } = useContext(AuthContext);

  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const sharedMedia = messages
    ?.filter((msg) => msg.image)
    .map((msg) => msg.image);
  const isOnline = onlineUsers?.includes(selectedUser?._id);

  return (
    selectedUser && (
      <div
        className={`bg-[#121212]/50 h-full text-white w-[300px] flex flex-col border-l border-white/5 animate-in slide-in-from-right duration-300 relative ${
          selectedUser ? "" : "max-md:hidden"
        }`}
      >
        {/* TOP SECTION: User Info */}
        <div className="pt-10 flex flex-col items-center gap-2 text-xs font-light px-5 shrink-0">
          <div className="relative">
            <img
              onClick={() => setIsZoomed(!isZoomed)}
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt="profile"
              className={`w-20 h-20 rounded-full object-cover border-2 border-violet-500/20 cursor-pointer transition-all duration-300 shadow-2xl ${
                isZoomed ? "scale-125 z-50 ring-4 ring-black/30" : "scale-100"
              }`}
            />
          </div>

          <div className="text-center">
            <h1 className="text-xl font-medium flex items-center justify-center gap-2 text-amber-100 mt-2">
              {isOnline && (
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              )}
              {selectedUser.fullName}
            </h1>
            <p className="text-gray-400 text-[10px] mt-0.5">
              {isOnline ? "Online" : "Offline"}
            </p>
            <p className="text-gray-400 mt-2 line-clamp-2 px-2">
              {selectedUser.bio || "Hi! I am using QuickChat"}
            </p>
          </div>
        </div>

        <hr className="border-white/10 my-5 mx-5 shrink-0" />

        {/* MIDDLE SECTION: Shared Media */}
        <div className="px-5 flex-1 overflow-y-auto scrollbar-hide">
          <p className="text-center text-[12px] uppercase tracking-[2px] text-white-500 mb-4">
            Media
          </p>
          <div className="grid grid-cols-2 gap-2 pb-5">
            {sharedMedia && sharedMedia.length > 0 ? (
              sharedMedia.map((url, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(url)}
                  className="cursor-pointer aspect-square overflow-hidden rounded-lg bg-white/5 hover:opacity-80 transition"
                >
                  <img
                    src={url}
                    alt="media"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))
            ) : (
              <p className="col-span-2 text-center text-gray-600 py-10 text-[11px] italic">
                No Media Shared Yet
              </p>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: Logout */}
        <div className="p-5 shrink-0">
          <button
            onClick={() => logout()}
            className="w-full bg-gradient-to-r from-purple-500 to-violet-700 text-white text-xs font-medium py-3 rounded-full cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-purple-500/10"
          >
            Logout
          </button>
        </div>

        {/*MEDIA ZOOM*/}
        {selectedImage && (
          <div
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Zoomed"
              className="max-w-full max-h-[70%] rounded-lg shadow-2xl object-contain animate-in zoom-in-95 duration-300"
            />
            <p className="text-white/40 text-[10px] mt-4 tracking-widest uppercase">
              Click anywhere to close
            </p>
          </div>
        )}
      </div>
    )
  );
};

export default RightSidebar;
