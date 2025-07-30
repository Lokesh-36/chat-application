import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { uploadBase64ToS3 } from "../lib/s3.js";
import logger from "../lib/logger.js";
import { notifyAdminNewUser } from "../lib/sns.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      logger.warn("Signup failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      logger.warn("Signup failed: Weak password");
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) {
      logger.warn(`Signup failed: Email already exists (${email})`);
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    generateToken(newUser._id, res);

    // ✅ Send SNS email
    await notifyAdminNewUser(fullName, email);

    logger.info(`New user signed up: ${email}`);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    logger.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn(`Login failed: Email not found (${email})`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      logger.warn(`Login failed: Incorrect password (${email})`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    logger.info(`Login successful: ${email}`);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    logger.info(`User logged out`);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Logout error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      logger.warn("Profile update failed: No picture provided");
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const fileName = `profile_${userId}_${Date.now()}.jpg`;
    const uploadedUrl = await uploadBase64ToS3(profilePic, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadedUrl },
      { new: true }
    );

    logger.info(`Profile updated for user: ${updatedUser.email}`);

    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error("Profile update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    logger.error("Auth check error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
