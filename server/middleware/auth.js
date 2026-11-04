import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const isAunthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.json({
        success: false,
        message: "User not Authenticated",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.json({
      message: error.message,
      success: false, 
    });
  }
};
