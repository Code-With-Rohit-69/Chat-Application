import { Router } from "express";
import {
  checkAuth,
  login,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import { authUser } from "../middlewares/Auth.js";

const userRouter = Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/update-Profile").post(authUser, updateProfile);
userRouter.route("/check-user").get(authUser, checkAuth);

export default userRouter;
