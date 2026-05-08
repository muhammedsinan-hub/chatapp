import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // LOGOUT FUNCTION
 const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); 
  setToken(null);
  setAuthUser(null);
  if (socket) socket.disconnect();
  toast.success("Logged out successfully");
};

  const checkAuth = async () => {
    const localToken = localStorage.getItem("token");
    if (!localToken) {
      setIsCheckingAuth(false);
      return;
    }
    try {
      const { data } = await axios.get("/api/auth/check", {
        headers: { token: localToken },
      });
      if (data.success) {
        setAuthUser(data.user);
        setToken(localToken);
        axios.defaults.headers.common["token"] = localToken;
        connectSocket(data.user);
      } else {
        localStorage.removeItem("token");
        setAuthUser(null);
      }
    } catch (error) {
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(
        `/api/auth${state.startsWith("/") ? state : "/" + state}`,
        credentials,
      );
      if (data.success) {
        setAuthUser(data.userData);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["token"] = data.token;
        connectSocket(data.userData);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Login failed");
    }
  };

  const updateProfile = async (body) => {
    try {
      const localToken = localStorage.getItem("token");
      const { data } = await axios.put("/api/auth/update-profile", body, {
        headers: { token: localToken },
      });
      if (data.success) {
        setAuthUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Profile updated");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const connectSocket = (userData) => {
    if (!userData) return;
    if (socket) socket.disconnect(); 
    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (ids) => {
      setOnlineUsers(ids);
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isCheckingAuth,
        login,
        logout,
        updateProfile,
        onlineUsers,
        socket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
