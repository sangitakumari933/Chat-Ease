import React, { useState } from "react";
import { assets } from "../assets/assets";
import UserList from "../components/UserList";
import ChatSection from "../components/ChatSection";
import RightSection from "../components/RightSection";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const ChatList = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="flex items-center justify-center  w-full h-screen relative ">
      <img
        src={assets.background_img}
        alt="background"
        className="absolute w-full h-full object-cover inset-0 z-0"
      />
      <div className="flex z-10 max-lg:w-[90%] w-[80%] h-[90%] border border-gray-400 bg-gray-100/70 rounded-md ">
        <UserList />
        {selectedUser ? (
          <>
            <ChatSection></ChatSection>
            <RightSection></RightSection>
          </>
        ) : (
          <div className="flex max-md:hidden flex-1 flex-col items-center justify-center bg-gray-200">
            <img src={assets.logo} alt="logo" className="w-30 h-30" />
            <p className="text-gray-700 text-lg">
              Select a user to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
