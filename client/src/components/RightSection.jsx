import React from "react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { assets } from "../assets/assets";
import { IoArrowBack } from "react-icons/io5";

const RightSection = () => {
  const { selectedUser, showRight, setSelectedUser, setShowRight } =
    useContext(ChatContext);
  return (
    <div
      className={`flex flex-col ${!showRight ? "max-md:hidden" : ""} flex-1 max-h-screen`}
    >
      <IoArrowBack
        onClick={() => {
          (setShowRight(false));
        }}
        className="hidden max-md:block text-2xl cursor-pointer ml-2 mt-2 "
      />
      <div className="flex flex-col gap-2 w-full  items-center p-2">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="profile-pic"
          className=" w-20 h-20 max-lg:w-20 max-lg:h-20  rounded-full object-cover"
        />
        <p className="text-center font-medium">{selectedUser.fullName}</p>
        <p className="p-2 text-center">{selectedUser.bio}</p>
      </div>
      <hr className="border-t border-gray-700/50 my-2 w-[90%] mx-auto" />
    </div>
  );
};

export default RightSection;
