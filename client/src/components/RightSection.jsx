import React from "react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { assets } from "../assets/assets";
import { IoArrowBack } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";

const RightSection = () => {
  const { selectedUser, showRight, setShowRight, messages } =
    useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  return (
    <div
      className={`flex flex-col ${!showRight ? "max-md:hidden" : ""} flex-1 h-full`}
    >
      <IoArrowBack
        onClick={() => {
          setShowRight(false);
        }}
        className="hidden max-md:block text-2xl text-gray-600 cursor-pointer ml-2 mt-2 "
      />
      <div className="flex flex-col gap-2 w-full items-center p-2">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="profile-pic"
          className=" w-20 h-20 max-lg:w-20 max-lg:h-20  rounded-full object-cover"
        />
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) && (
            <p className="w-2 h-2 rounded-full bg-green-500"></p>
          )}
          {selectedUser.fullName}
        </h1>
        <p className="p-2 text-center">{selectedUser.bio}</p>
      </div>
      <hr className="border-t border-gray-700/50 my-2 w-[90%] mx-auto" />
      <div className="flex flex-col flex-1 p-2 overflow-y-auto ">
        <p className="shrink-0">Media</p>

        <div className="mt-2 flex-1 rounded-md grid grid-cols-2 gap-4 opacity-90">
          {msgImages.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url)}
              className="rounded-md cursor-pointer"
            >
              <img
                src={url}
                alt="Shared media"
                className="h-full w-full  object-contain rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSection;
