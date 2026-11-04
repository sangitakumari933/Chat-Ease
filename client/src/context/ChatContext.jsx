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
      setUsers(data.users);
      console.log("fetched new user list");
      console.log(data.users);

    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to get messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/get-messages/${userId}`);
      console.log(data);
      if (data.success) {
        setMessages(data.messages);
        setRefreshUser(!refreshUser);
        console.log("message", data.messages);
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
      console.log(data);
      if (data.success) {
        setRefreshUser(!refreshUser);
        setMessages((prevMessage) => [...prevMessage, data.newMessage]);
        console.log("success");
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
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/message/mark/${newMessage._id}`);
      } else {
        console.log("pipi");
        console.log(refreshUser)
        setRefreshUser(refreshUser=>!refreshUser);
         console.log(refreshUser)
         console.log("dono")
        // setUnseenMessages((prevUnseenMessages)=>({
        //   ...prevUnseenMessages, [newMessage.senderId] :
        //   prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
        // })
        // )
      }
      //setRefreshUser(!refreshUser);
    });
  };

  //function to unsubscribe from messages
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
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
    setShowRight
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
