import { Router } from "express";
import { authUser } from "../middlewares/Auth.js";
import { getMessages, getUserForSideBar, markMessageSeen, sendMessage } from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.route("/users").get(authUser, getUserForSideBar);
messageRouter.route("/:id").get(authUser, getMessages);
messageRouter.route("/mark/:id").get(authUser, markMessageSeen); 
messageRouter.route("/send/:id").get(authUser, sendMessage); 

export default messageRouter;
