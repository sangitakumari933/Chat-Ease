import { createContext, useEffect, useState } from "react"; 
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";


const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // check if user is authenticated and if so, set the user data 
  //and connect the socket
  
  const checkAuth = async ()=>{
    try {
      const {data} = await axios.get("/api/auth/check");
      console.log("CHECK AUTH RESPONSE:", data);
      if(data.success){
        setAuthUser(data.user);
        console.log(authUser);
        connectSocket(data.user)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  //Login function to handle user authentication and socket connection
  
  const login = async (state, credentials)=>{
    
    try {
      console.log("calling backend");
      const {data} = await axios.post(`/api/auth/${state}`, credentials);
      
      if(data.success){
        setAuthUser(data.userData);
        connectSocket(data.userData);
        toast.success(data.message);
        navigate('/');
      }else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(response);
      toast.error(error.data.message || "Something went wrong")
    }
  }

  //function socket function to handle socket connection and online user updates
  const connectSocket = (userData)=>{
    if(!userData || socket?.connected) return;
    
    const newSocket = io(backendUrl, {
      query:{
        userId: userData._id
      }
    });
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds)=>{
      console.log("Received online users:", userIds);
      setOnlineUsers(userIds);
    })
  }
  
  //update profile function to handle user profile updates
  const updateProfile = async (body)=>{
    try {
      console.log("inside updateprofile");
      const {data} = await axios.put("/api/auth/update-profile", body);
       console.log(data);
      if(data.success){
        setAuthUser(data.user);
        toast.success("Profile update successfully");
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }


useEffect(() => {
    checkAuth();
}, []);


  const value = {
    axios,
    authUser,
    socket,
    login,
    updateProfile,
    onlineUsers,
    setAuthUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}