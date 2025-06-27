import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  createResetToken,
  createToken,
  createUser,
  deletePasswordVerification,
  deleteToken,
  getUserByEmail,
  getUserById,
  getUserByResetToken,
  getUserByToken,
  getUserDetails,
  loginUser,
  updateUserPassword,
  updateUserProfile,
  updateUserVerification,
} from "../models/auth";
import {
  generateAccessToken,
  generateEmailVerificationToken,
  generateRefreshToken,
} from "../lib/generate";
import {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../helpers/sendMails";
import { verifyRefreshToken, verifyToken } from "../middleware/verify";
import cloudinaryConfig from "../config/cloudinary";

export const register = async (req: Request, res: Response) => {
  // get user data from request body
  const { username, email, password, gender } = req.body;
  // validate user data
  if (!username || !email || !password || !gender) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }
  //validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Email is not valid", success: false });
  }
  // validate password length
  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long",
      success: false,
    });
  }
  try {
    // hash password
    const hashPwd = await bcrypt.hash(password, 10);
    // generate email verification token
    const token = generateEmailVerificationToken();
    // store user in database
    const user = await createUser({
      email,
      username,
      hashPwd: hashPwd,
      gender,
      token,
    });
    await sendVerificationEmail(user.email, token);
    return res
      .status(201)
      .json({ message: "User registered successfully", user, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
      success: false,
    });
  }

  try {
    const user = await loginUser(email, password);
    if (!user) {
      return res.status(400).json({
        message: "no user found with this email or password",
        success: false,
      });
    }
    const accessToken = generateAccessToken(user.id.toString(), user.role);
    const refreshToken = generateRefreshToken(user.id.toString(), user.role);
    await createToken(user.id, refreshToken);
    return res.status(200).json({
      message: "Login successful",
      user,
      accessToken,
      refreshToken,
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid credentials") {
        return res.status(400).json({
          message: "Invalid email or password",
          success: false,
        });
      }
    } else {
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    //get token from body
    const { token } = req.body;
    //check if token is provided
    if (!token) {
      return res
        .status(400)
        .json({ message: "Token is required", success: false });
    }
    //get user by token
    const user = await getUserByToken(token);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token or token expired", success: false });
    }
    const updatedUser = await updateUserVerification(user.id, true);
    const accessToken = generateAccessToken(updatedUser.id, updatedUser.role);
    const refreshToken = generateRefreshToken(updatedUser.id, updatedUser.role);
    await createToken(user.id, refreshToken);
    await sendWelcomeEmail(updatedUser.email, updatedUser.username);
    return res.status(200).json({
      message: "Email verified successfully",
      user: updatedUser,
      accessToken,
      refreshToken,
      success: true,
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken: oldRefreshToken } = req.body;
  if (!oldRefreshToken) {
    return res.status(400).json({
      message: "Refresh token is required",
      success: false,
    });
  }
  try {
    const decoded = verifyRefreshToken(oldRefreshToken);
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      "role" in decoded
    ) {
      const newAccessToken = generateAccessToken(
        (decoded as any).userId,
        (decoded as any).role
      );
      const newRefreshToken = generateRefreshToken(
        (decoded as any).userId,
        (decoded as any).role
      );
      await deleteToken((decoded as any).userId, oldRefreshToken);
      await createToken((decoded as any).userId, newRefreshToken);
      return res.status(200).json({
        message: "Access token refreshed successfully",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "Invalid refresh token",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token is required",
      success: false,
    });
  }
  try {
    const decoded = verifyToken(refreshToken);
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded
    ) {
      await deleteToken((decoded as any).userId, refreshToken);
      return res.status(200).json({
        message: "Logged out successfully",
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "Invalid refresh token",
        success: false,
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Email is required",
      success: false,
    });
  }
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    const token = generateEmailVerificationToken();
    await createResetToken(user.id, token);
    await sendPasswordResetEmail(user.email, token);
    return res.status(200).json({
      message: "Password reset email sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({
      message: "Token and new password are required",
      success: false,
    });
  }
  try {
    const user = await getUserByResetToken(token);
    console.log("User found:", user);
    if (!user) {
      return res.status(400).json({
        message: "Invalid token or token expired",
        success: false,
      });
    }
    await updateUserPassword(user.id, password);
    await sendPasswordResetSuccessEmail(user.email);
    await deletePasswordVerification(user.id);
    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { username, phone_number, date_of_birth, gender } = req.body;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
  try {
    const existingUser = await getUserById(userId);
    const imageUrl = req.file
      ? (
          await cloudinaryConfig.uploader.upload(req.file.path, {
            folder: "users",
            resource_type: "image",
          })
        ).secure_url
      : existingUser?.imageUrl || "";
    const updatedUser = await updateUserProfile(userId, {
      username,
      phone_number,
      date_of_birth,
      gender,
      profile_url: imageUrl,
    });
    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
  try {
    const user = await getUserDetails(userId);
    return res.status(200).json({
      message: "User profile retrieved successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
