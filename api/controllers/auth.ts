import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  createUser,
  getUserByToken,
  loginUser,
  updateUserVerification,
} from "../models/auth";
import {
  generateAccessToken,
  generateEmailVerificationToken,
  generateRefreshToken,
} from "../lib/generate";
import { sendVerificationEmail, sendWelcomeEmail } from "../helpers/sendMails";

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
  // get user data from request body
  const { email, password } = req.body;
  // validate user data
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required", success: false });
  }
  try {
    // check if user exists in database
    const user = await loginUser(email, password);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }
    // compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.hashPwd);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }
    // generate access token
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    return res.status(200).json({
      message: "Login successful",
      user,
      accessToken,
      refreshToken,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
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
        .status(400)
        .json({ message: "Invalid token or token expired", success: false });
    }
    //update user is_verified to true

    const updatedUser = await updateUserVerification(user.id, true);
    const accessToken = generateAccessToken(updatedUser.id);
    const refreshToken = generateRefreshToken(updatedUser.id);
    await sendWelcomeEmail(updatedUser.email, updatedUser.username);
    return res
      .status(200)
      .json({
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
