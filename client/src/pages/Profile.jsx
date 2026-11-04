import React from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Profile = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName);
  const [bio, setBio] = useState(authUser?.bio);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate("/");
    };
  };

  return (
    <div className="flex items-center justify-center h-screen relative">
      <img
        src={assets.background_img}
        alt="background"
        className="absolute w-full h-full object-cover inset-0 z-0 opacity-40"
      />
      <div className="flex max-sm:flex-col-reverse items-center w-5/6 max-w-2xl backdrop-blur-2xl border-2 border-gray-300 ">
        <form
          onSubmit={onSubmitHandler}
          className="flex w-full flex-col gap-5 p-5 flex-1"
        >
          <h3>Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md outline-none focus:ring-2 focus:ring-violet-500"
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
            className="p-2 border border-gray-500 rounded-md outline-none focus:ring-2  focus:ring-violet-500"
            rows={4}
          ></textarea>
          <button
            type="submit"
            className="py-3 px-1 bg-gradient-to-t from-purple-500 to-blue-500 w-full rounded-md text-white font-medium cursor-pointer my-2"
          >
            Save
          </button>
        </form>
        <img
          className="max-w-44 h-44 max-sm:w-20 max-sm:h-20 object-cover mt-2 rounded-full mx-10 "
          src={authUser?.profilePic || assets.avatar_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default Profile;
