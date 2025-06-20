import { sql } from "../../config/db";
import bcrypt from "bcrypt"
interface User {
  username: string;
  email: string;
  hashPwd: string;
  gender: string;
  student_id?: string;
  is_verified?: boolean;
  role?: string; // e.g., 'student', 'teacher', 'admin'
  verification_token?: number;
  verification_token_expiry?: Date; // to store the expiry time of the verification token
  reset_token?: number; // to store the password reset token
  reset_token_expiry?: Date; // to store the expiry time of the reset token
  token?: number;
  date_of_birth?: Date;
  phone_number?: string;
  profile_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export const createUser = async (user: User) => {
  try {
    //check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${user.email} OR username = ${user.username} OR student_id = ${user.student_id}
    `;
    if (existingUser.length > 0) {
      throw new Error("User already exists");
    }
    const result = await sql`
      INSERT INTO users (username, email, password, phone_number, gender,verification_token,verification_token_expiry)
      VALUES (${user.username}, ${user.email}, ${user.hashPwd}, ${user.phone_number}, ${user.gender}, ${user.token}, NOW() + INTERVAL '1 hour')
      RETURNING id, username, email, created_at, updated_at, profile_url, gender,role;
    `;
    return result[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const result = await sql`
      SELECT id, email, username, password FROM users 
      WHERE email = ${email} AND is_verified = true
      LIMIT 1
    `;
    if (result.length === 0) {
      throw new Error("Invalid credentials");
    }
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw new Error("Failed to log in user");
  }
};

export const getUserByToken = async (token: number) => {
  try {
    const result = await sql`
      SELECT * FROM users WHERE verification_token = ${token} AND verification_token_expiry > NOW()
    `;
    if (result.length === 0) {
      throw new Error("Invalid token or token expired");
    }
    return result[0];
  } catch (error) {
    console.error("Error getting user by token:", error);
    throw new Error("Failed to get user by token");
  }
};

export const updateUserVerification = async (userId: number, isVerified: boolean) => {
  try {
    const result = await sql`
      UPDATE users SET is_verified = ${isVerified}, verification_token = NULL, verification_token_expiry = NULL WHERE id = ${userId}
      RETURNING id, username, email, is_verified;
    `;
    if (result.length === 0) {
      throw new Error("User not found");
    }
    return result[0];
  } catch (error) {
    console.error("Error updating user verification:", error);
    throw new Error("Failed to update user verification");
  }
}