import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/utils.js";
import cloudinary from "../config/cloudinary.js";

export const signUp = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  console.log("SIGNUP REQUEST RECEIVED");
  try {
    if (!fullName || !email || !password) {
      console.log(fullName);
      console.log(email);
      console.log(password);

      return res.json({ success: false, message: "Missing Details" });
    }
    const user = await User.findOne({ email });

    console.log("Checking user...");
    if (user)
      return res.json({ success: false, message: "Account already exists" });

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);
    console.log(newUser);

    const userData = {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      bio: newUser.bio,
      profilePic: newUser.profilePic,
    };

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Account created succesully",
        userData: userData,
        success: true,
      });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are required.",
        success: false,
      });
    }
    console.log(1);
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(401).json({
        message: "User does not exist with this email",
        success: false,
      });
    }
    console.log(2);

    const isMatch = await bcryptjs.compare(password, userData.password);
    console.log(3);
    console.log(isMatch);
    if (!isMatch) {
      return res.json({
        message: "Invalid credentials",
        success: false,
      });
    }

    console.log(3);

    const token = generateToken(userData._id);
    console.log(3);

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login succesully",
        userData,
        success: true,
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

//controller to check if user is authenticated or not

export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

//controller to update the user profile details
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    console.log("update happening");

    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true },
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName, profilePic: upload.secure_url },
        { new: true },
      );
    }
    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
