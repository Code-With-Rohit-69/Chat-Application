import cloudinary from "../config/cloudinary.js";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";
import { io, userSocketMap } from "../server.js";

export const getUserForSideBar = async (req, res) => {
  try {
    const userId = req.user;
    const filteredUser = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    const unseenMessages = {};

    const promises = filteredUser.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    return res
      .status(200)
      .json({ success: true, user: filteredUser, unseenMessages });
  } catch (error) {
    console.log(`Error in getUserForSideBar Controller ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;

    const userId = req.user;

    const messages = await Message.find({
      $or: [
        {
          senderId: userId,
          receiverId: selectedUserId,
        },
        {
          senderId: selectedUserId,
          receiverId: userId,
        },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: userId },
      { seen: true }
    );

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log(`Error in getMessages Controller ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const markMessageSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(`Error in markMessageSeen Controller ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  const { text, image } = req.body;
  try {
    const { id: receiverId } = req.params;
    const userId = req.user;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      receiverId,
      senderId: req.userId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json({ success: true, newMessage });
  } catch (error) {
    console.log(`Error in sendMessage Controller ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
