import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";

export const register = async (req, res) => {
  const { email, name, password, bio } = req.body;
  try {
    if (!email || !name || !password || !bio) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User Already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      newUser,
      token,
    });
  } catch (error) {
    console.log("Error in register controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "LoggedIn Successfully",
      token,
    });
  } catch (error) {
    console.log("Error in Login controller", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user;
    const { profilePic, bio, name } = req.body;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, name },
        { pin: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, name, bio },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in update profile: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not Found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in checkAuth controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
