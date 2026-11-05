import React from "react";
import { assets } from "../assets/assets";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";

const UserList = () => {
  const navigate = useNavigate();
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);
  const { onlineUsers, authUser, axios, setAuthUser } = useContext(AuthContext);
  const [input, setInput] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase()),
      )
    : users;

  const logout = async () => {
    try {
      const response = await axios.post("/api/auth/logout");

      if (response.data.success) {
        console.log("logout");
        setAuthUser(null);
        // Update your authentication state here.
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsers(authUser?._id);
    
  }, [onlineUsers]);

  return (
    <div
      className={`flex flex-col max-md:w-full z-10 ${!selectedUser ? "md:w-1/2" : "md:w-1/4"} ${selectedUser ? "max-md:hidden" : ""} h-[90%]  `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={assets.logo} alt="" className="w-20 h-20" />
          <h1 className="max-lg:text-lg   text-2xl font-bold text-gray-700">
            ChatEase
          </h1>
        </div>
        <div className="relative py-1">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-2xl font-bold hover:text-gray-800 mr-3 cursor-pointer"
          >
            ⋮
          </button>

          {showMenu && (
            <>
              {/* Close menu when clicking outside */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              ></div>

              <div className="absolute top-full right-0 z-20 w-36 p-4 rounded-md bg-gray-200 border border-gray-400 shadow-lg">
                <p
                  onClick={() => {
                    navigate("/profile");
                    setShowMenu(false);
                  }}
                  className="cursor-pointer text-sm text-gray-700"
                >
                  Edit Profile
                </p>

                <hr className="my-2 border-t border-gray-400" />

                <p
                  onClick={() => {
                    setShowMenu(false);
                    logout();
                  }}
                  className="cursor-pointer text-sm text-gray-700"
                >
                  Logout
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center w-[90%] m-auto gap-2 border border-gray-500 rounded-2xl px-2 py-1">
        <IoIosSearch size={"20"} className="text-gray-500" />
        <input
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Search User..."
          className="outline-none"
        />
      </div>
      <div className="mt-2 mx-2 flex-1 overflow-y-auto">
        {filteredUsers.map((user) => (
          <div
            onClick={() => {
              setSelectedUser(user); setUnseenMessages((prev=>({...prev, [user._id]:0})))
            }}
            key={user._id}
            className="flex items-center px-2 py-2 hover:bg-gray-200 rounded-md relative"
          >
            <img
              src={user.profilePic || assets.avatar_icon}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="text-gray-800 font-bold">{user.fullName}</p>
              {onlineUsers.includes(user._id) ? (
                <p className="text-green-500 text-sm">online</p>
              ) : (
                <p className="text-nuetral-400 text-sm">offline</p>
              )}
            </div>
            {unseenMessages[user._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs bg-green-500/50 h-5 w-5 flex items-center justify-center text-white rounded-full">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
