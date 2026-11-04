import express from "express"
import { checkAuth, login, logoutUser, signUp, updateProfile } from "../controllers/usercontroller.js";
import { isAunthenticated } from "../middleware/auth.js";
import console from "console";
const userRouter = express.Router();

console.log("router");
userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.put('/update-profile', isAunthenticated, updateProfile);
userRouter.get('/check', isAunthenticated, checkAuth);
userRouter.post("/logout", logoutUser);

export default userRouter;