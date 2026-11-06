import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import { useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, setAuthUser } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    login(currState === "Sign Up" ? "signup" : "login", {
      fullName,
      email,
      password,
    });
  };

  const demoLogin = async () => {
    const response = await axios.post("/api/user/login", {
      email: "demo@gmail.com",
      password: "demo12",
    });
    if (response.data.success) {
      setAuthUser(data.userData);
      connectSocket(data.userData);
      toast.success(data.message);
      navigate("/");
    } else {
      alert(response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg relative">
      <img
        src={assets.background_img}
        alt="background"
        className="absolute w-full h-full object-cover inset-0 z-0"
      />
      <div className="absolute w-full h-full bg-gray-100/70"></div>
      <div className="z-10 flex gap-50 lg:gap-60 max-md:flex-col max-md:gap-5">
        <div className="flex flex-col items-center max-md:flex-row">
          <img src={assets.logo} alt="logo" className="w-60 max-md:w-20" />
          <h1 className="text-3xl font-bold  bg-gradient-to-t from-purple-500 to-blue-500 bg-clip-text text-transparent">
            ChatEase
          </h1>
        </div>
        <div className="w-70 bg-gray-100/50 p-5 border border-gray-400 rounded-md space-y-3">
          <h1 className="text-lg font-bold text-gray-700 flex justify-between items-center">
            {currState}
          </h1>
          <form
            onSubmit={(e) => {
              onSubmitHandler(e);
            }}
            className="space-y-3"
          >
            {currState === "Sign Up" && (
              <input
                type="text"
                placeholder="Enter your fullname"
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
                className="outline-none border border-gray-400 p-1 rounded-md text-sm w-full focus:ring-2 focus:ring-indigo-500"
              />
            )}

            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              className="outline-none border border-gray-400 p-1 rounded-md text-sm w-full focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              className="outline-none border border-gray-400 p-1 rounded-md text-sm w-full focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="py-3 px-1 bg-gradient-to-t from-purple-500 to-blue-500 w-full rounded-md text-white font-medium cursor-pointer my-2"
            >
              {currState}
            </button>
          </form>
          <div className="text-sm text-gray-600">
            {currState === "Sign Up" ? (
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setCurrState("Login");
                  }}
                  className="text-blue-400 underline cursor-pointer"
                >
                  Login here
                </span>
              </p>
            ) : (
              <p>
                Create an account?{" "}
                <span
                  onClick={() => {
                    setCurrState("Sign Up");
                  }}
                  className="text-blue-400 underline cursor-pointer"
                >
                  click here
                </span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={demoLogin}
            className="w-full py-2.5 rounded-full border border-gray-400 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
