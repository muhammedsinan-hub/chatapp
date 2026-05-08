import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || "");
      setBio(authUser.bio || "");
    }
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      if (!selectedImage) {
        await updateProfile({ fullName: name, bio });

        navigate("/");
        setIsUpdating(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          await updateProfile({
            profilePic: reader.result,
            fullName: name,
            bio,
          });
          navigate("/");
        } catch (err) {
          console.log("Upload error:", err);
        } finally {
          setIsUpdating(false);
        }
      };
      reader.onerror = () => {
        console.log("FileReader failed");
        setIsUpdating(false);
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.log("Profile update failed:", error);
      setIsUpdating(false);
    }
  };


  //Remove profile photo
  const handleRemovePhoto = async () => {
    try {
      setIsUpdating(true);
      await updateProfile({ profilePic: "", fullName: name, bio });
      setSelectedImage(null);
      toast.success("Profile photo removed");
    } catch (error) {
      console.error("Remove failed", error);
      toast.error("Failed to remove photo");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-no-repeat flex items-center justify-center bg-cover">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg p-5">
        {/* LEFT SIDE: Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-5 flex-1"
        >
          <h3 className="text-lg font-medium text-center md:text-left uppercase">
            Profile Details
          </h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <div className="relative">
              <img
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : authUser?.profilePic || assets.avatar_icon
                }
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border border-white/10"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px]">Edit</span>
              </div>
            </div>
            <span className="text-sm text-gray-400 uppercase">
              Upload profile image
            </span>
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your Name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent text-white"
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent text-white h-24"
          ></textarea>

          <button
            type="submit"
            disabled={isUpdating}
            className={`bg-gradient-to-r from-purple-500 to-violet-600 text-white p-2 rounded-full text-lg font-medium cursor-pointer shadow-lg hover:brightness-110 active:scale-95 transition-all ${
              isUpdating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUpdating ? "Saving..." : "SAVE"}
          </button>
        </form>

        {/* RIGHT SIDE: Preview Section */}
        <div className="mx-10 max-sm:my-10 flex flex-col items-center gap-5">
          <div className="w-44 h-44 flex items-center justify-center">
            {selectedImage ||
            (authUser?.profilePic && authUser.profilePic !== "") ? (
              <div
                key="profile-frame"
                className="w-full h-full rounded-full border-4 border-violet-500/30 shadow-2xl overflow-hidden bg-black/20"
              >
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : authUser?.profilePic
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <img
                key="logo-frame"
                src={assets.logo_icon}
                alt="Logo"
                className="max-w-[150px] object-contain"
              />
            )}
          </div>

          {(selectedImage ||
            (authUser?.profilePic && authUser.profilePic !== "")) && (
            <button
              onClick={handleRemovePhoto}
              type="button"
              disabled={isUpdating}
              className="text-xs text-violet-500 hover:text-violet-400 uppercase cursor-pointer transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
