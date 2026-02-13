import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utlis";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import RightSidebar from "./RightSidebar";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setIinput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setIinput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} alt="" className="max-w-16" />
        <p className="text-lg font-medium text-white">Chat anytime anywhere</p>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex overflow-hidden relative backdrop-blur-lg md:ml-2">
      <div className="flex-1 flex flex-col relative border-r border-white/5 h-full overflow-hidden">
        {/*--------HEADER-------*/}
        <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500/30 shrink-0">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-base md:text-lg text-white flex items-center gap-2 truncate">
              {selectedUser?.fullName}
              {onlineUsers?.includes(selectedUser?._id) && (
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
              )}
            </p>
            <p className="text-[10px] md:text-xs text-gray-400">
              {onlineUsers?.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>

          {/* Back button only on mobile */}
          <img
            onClick={() => setSelectedUser(null)}
            src={assets.arrow_icon}
            alt="back"
            className="md:hidden w-6 h-6 cursor-pointer opacity-70 rotate-180"
          />

          <img
            onClick={() => setShowProfile(!showProfile)}
            src={assets.help_icon}
            alt="info"
            className={`max-md:hidden max-w-5 mr-1 cursor-pointer transition-opacity ${showProfile ? "opacity-100" : "opacity-50"}`}
          />
        </div>

        {/*------ MESSAGES AREA ------ */}
        <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide p-3 pb-24 space-y-4 overflow-x-hidden">
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => {
              const isMine = msg.senderId === authUser?._id;
              return (
                <div
                  key={msg._id || index}
                  className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* User Avatar in Chat */}
                  <img
                    src={
                      isMine
                        ? authUser?.profilePic || assets.avatar_icon
                        : selectedUser?.profilePic || assets.avatar_icon
                    }
                    alt=""
                    className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover flex-shrink-0 mb-5"
                  />

                  <div
                    className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[85%] md:max-w-[70%]`}
                  >
                    {msg.image ? (
                      <div className="relative group">
                        <img
                          onClick={() => setSelectedImage(msg.image)}
                          className="max-w-full sm:max-w-xs border border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:brightness-90 transition"
                          src={msg.image}
                          alt=""
                        />
                      </div>
                    ) : (
                      <div
                        className={`p-2.5 px-4 text-sm font-light break-words text-white ${
                          isMine
                            ? "bg-violet-600 rounded-2xl rounded-tr-none"
                            : "bg-stone-700 rounded-2xl rounded-tl-none"
                        }`}
                      >
                        {msg.text || msg.message || "No text content"}
                      </div>
                    )}
                    <p
                      className={`text-[9px] text-gray-500 mt-1 ${isMine ? "text-right" : "text-left"}`}
                    >
                      {msg.createdAt ? formatMessageTime(msg.createdAt) : ""}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 italic text-sm">
              Start a conversation with {selectedUser?.fullName}
            </div>
          )}
          <div ref={scrollEnd}></div>
        </div>

        {/*---- BOTTOM AREA (INPUT) -----*/}
        <form
          onSubmit={handleSendMessage}
          className="absolute bottom-0 left-0 right-0 flex items-center gap-2 p-3 md:p-5  from-[#121212] to-transparent"
        >
          <div className="flex-1 flex items-center bg-stone-800/95 backdrop-blur-md px-3 md:px-4 py-1 rounded-full border border-white/5 shadow-2xl">
            <input
              onChange={(e) => setIinput(e.target.value)}
              value={input}
              type="text"
              placeholder="Send a message..."
              className="flex-1 text-sm p-2 bg-transparent border-none outline-none text-white placeholder-gray-400"
            />

            <input
              onChange={handleSendImage}
              type="file"
              id="image"
              accept="image/*"
              hidden
            />
            <label htmlFor="image" className="shrink-0">
              <img
                src={assets.gallery_icon}
                alt="gallery"
                className="w-5 mx-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity relative right-1  max-md:relative max-md:right-2"
              />
            </label>
          </div>

          <button
            type="submit"
            className="shrink-0 hover:scale-105 active:scale-95 transition-transform "
          >
            <img
              src={assets.send_button}
              alt="send"
              className="w-10 h-10 md:w-11 md:h-11 cursor-pointer "
            />
          </button>
        </form>

        {/* ZOOM OVERLAY - CLICK ANYWHERE TO CLOSE */}
        {selectedImage && (
          <div
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out animate-in fade-in duration-200"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-[95%] max-h-[90%] flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Zoomed"
                className="max-w-full max-h-full rounded-lg shadow-2xl object-contain animate-in zoom-in-95 duration-200"
              />
            </div>
          </div>
        )}
      </div>

      {showProfile && (
        <div className="max-md:absolute max-md:inset-0 max-md:z-50 bg-[#121212] md:relative">
          <RightSidebar
            selectedUser={selectedUser}
            messages={messages}
            onClose={() => setShowProfile(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
