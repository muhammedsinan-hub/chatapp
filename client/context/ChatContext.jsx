import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket } = useContext(AuthContext);

  // Get all users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  // Get messages for selected user
  const getMessages = useCallback(async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error("Failed to load messages");
    }
  }, []);

  // Send message
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData,
      );
      const newMsg = data.newMessage || data.data || data;
      setMessages((prev) => [...prev, newMsg]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Subscribe/Unsubscribe to Socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`).catch(() => {});
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    setMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
