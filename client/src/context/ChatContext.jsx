import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [unseenMessages, setUnseenMessages] = useState({});
  const { socket, axios } = useContext(AuthContext);
  const [refreshUser, setRefreshUser] = useState(false);
  const [showRight, setShowRight] = useState(false);

  //function to get all user for sidebar
  const getUsers = async () => {
    try {
      console.log("getUsers");
      const { data } = await axios.get("/api/messages/users");
      if(data.success){
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to get messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/get-messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to send message to selected user
  const sendMessage = async (messageData) => {
    try {
      console.log("sending image");

      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData,
      );
      if (data.success) {
        setMessages((prevMessage) => [...prevMessage, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to subscribe to messages for selected user
  const subscribeToMessages = async () => {
    if (!socket) return;
    socket.on("newMessage", async (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        console.log("hello");
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        const res = await axios.put(`/api/messages/mark/${newMessage._id}`);
        console.log(res);
      } else {
        setUnseenMessages((prevUnseenMessages)=>({
          ...prevUnseenMessages, [newMessage.senderId]:prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
        }))
      }
    });
  };

  //function to unsubscribe from messages
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages(); 
    console.log("unseen:", unseenMessages);
    return () => {
      unsubscribeFromMessages();
    };
  }, [socket, selectedUser]);

  const value = {
    getUsers,
    users,
    selectedUser,
    messages,
    getMessages,
    setSelectedUser,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    refreshUser,
    showRight,
    setShowRight,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
