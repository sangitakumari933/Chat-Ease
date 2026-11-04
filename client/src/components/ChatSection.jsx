import React from "react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { RiGalleryLine } from "react-icons/ri";
import { LuSendHorizontal } from "react-icons/lu";
import { useState } from "react";
import { formatMessageTime } from "../lib/utils";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets";
import { useEffect } from "react";
import { useRef } from "react";
import toast from "react-hot-toast";

const ChatSection = () => {
  const {
    selectedUser,
    sendMessage,
    messages,
    getMessages,
    setShowRight,
    showRight,
  } = useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  //handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  //handle sending an image
  const handleSendImage = (e) => {
    console.log(e.target);
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file");
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const sendImage = async () => {
    const formData = new FormData();

    formData.append("image", selectedImage);

    await sendMessage(formData);

    URL.revokeObjectURL(imagePreview);
    setSelectedImage(null);
    setImagePreview(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, imagePreview]);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  return (
    <div
      className={`flex flex-col px-5 w-1/2 bg-gray-200 ${
        selectedUser && !showRight ? "max-md:w-full" : "max-md:hidden"
      }`}
    >
      {/* HEADER */}
      <div
        onClick={() => setShowRight(true)}
        className="flex items-center gap-4 border-b border-b-white px-2 py-3 shrink-0 cursor-pointer"
      >
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className="w-15 h-15 rounded-full object-cover"
        />

        <p className="font-medium text-gray-800 text-xl flex items-center gap-2">
          {selectedUser?.fullName}

          {onlineUsers.includes(selectedUser?._id) && (
            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 min-h-0 overflow-y-auto p-1">
        {messages.map((msg, index) => {
          const isMyMessage = msg.senderId === authUser?._id;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 my-1 ${
                isMyMessage ? "justify-end" : "justify-start"
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="sent"
                  className="max-w-50 rounded-lg"
                />
              ) : (
                <p
                  className={`text-sm text-gray-500 p-2 rounded-xl wrap-break-words shadow-sm max-w-[80%] ${
                    isMyMessage ? "bg-white" : "bg-green-100"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <p className="text-gray-400 text-xs">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          );
        })}

        {/* SCROLL TARGET */}
        <div ref={messagesEndRef}></div>
      </div>

      {imagePreview && (
        <div className="relative p-3 bg-gray-100 rounded-xl w-fit mb-2">
          <img
            src={imagePreview}
            alt="preview"
            className=" h-36 object-cover rounded-lg"
          />

          <button
            onClick={() => {
              URL.revokeObjectURL(imagePreview);
              setImagePreview(null);
              setSelectedImage(null);
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
          >
            x
          </button>

          <button
            onClick={sendImage}
            className="mt-2 bg-green-500 text-white px-4 py-1 rounded-full text-sm"
          >
            Send Image
          </button>
        </div>
      )}

      {/* INPUT */}
      <div className="flex items-center gap-3 p-3 shrink-0">
        <div className="flex items-center flex-1 bg-gray-100 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="send a message"
            className="flex-1 text-sm p-3 outline-none"
          />

          <input
            onChange={(e) => handleSendImage(e)}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />

          <label htmlFor="image">
            <RiGalleryLine className="w-5 h-5 mr-2 cursor-pointer" />
          </label>
        </div>

        <div
          onClick={handleSendMessage}
          className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center"
        >
          <LuSendHorizontal className="text-white cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
