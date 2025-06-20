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
      SELECT * FROM users
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
    const {
      password: _,
      verification_token,
      verification_token_expiry,
      reset_token,
      reset_token_expiry,
      updated_at,
      ...userWithoutSensitiveData
    } = user;

    return userWithoutSensitiveData;
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
      RETURNING id, username, email, is_verified, role;
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

export const getUserByEmail = async (email: string) => {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email} 
    `;
    if (result.length === 0) {
      throw new Error("User not found");
    }
    return result[0];
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw new Error("Failed to get user by email");
  }
};

export const createToken = async (userId: number, token: string) => {
  try {
    //check if token already exists for user
    const existingToken = await sql`
      SELECT id FROM tokens WHERE user_id = ${userId} AND token = ${token}
    `;
    if (existingToken.length > 0) {
      throw new Error("Token already exists");
    }
    const result = await sql`
      INSERT INTO tokens (user_id, token) 
      VALUES (${userId}, ${token})
      RETURNING id, user_id, token;
    `;
    return result[0];
  } catch (error) {
    console.error("Error creating token:", error);
    throw new Error("Failed to create token");
  }
}
export const createResetToken = async (userId: number, resetToken: number) => { 
  try {
    //check if reset token already exists for user
    const existingToken = await sql`
      SELECT id FROM users WHERE id = ${userId} AND reset_token = ${resetToken}
    `;
    if (existingToken.length > 0) {
      throw new Error("Reset token already exists");
    }
    const result = await sql`
      UPDATE users SET reset_token = ${resetToken}, reset_token_expiry = NOW() + INTERVAL '1 hour' WHERE id = ${userId}
      RETURNING id, username, email, reset_token, reset_token_expiry;
    `;
    if (result.length === 0) {
      throw new Error("User not found");
    }
    return result[0];
  } catch (error) {
    console.error("Error creating reset token:", error);
    throw new Error("Failed to create reset token");
  }
}
export const deleteToken = async (userId: number, token: string) => {
  try {
    const result = await sql`
      DELETE FROM tokens WHERE user_id = ${userId} AND token = ${token}
      RETURNING id;
    `;
    if (result.length === 0) {
      throw new Error("Token not found");
    }
    return result[0];
  } catch (error) {
    console.error("Error deleting token:", error);
    throw new Error("Failed to delete token");
  }
}

export const getUserByResetToken = async (resetToken: number) => {
  try {
    const result = await sql`
      SELECT * FROM users WHERE reset_token = ${resetToken} AND reset_token_expiry > NOW()
    `;
    if (result.length === 0) {
      throw new Error("Invalid reset token or token expired");
    }
    return result[0];
  } catch (error) {
    console.error("Error getting user by reset token:", error);
    throw new Error("Failed to get user by reset token");
  }
}

export const updateUserPassword = async (userId: number, newPassword: string) => {
  try {
    const hashPwd = await bcrypt.hash(newPassword, 10);
    const result = await sql`
      UPDATE users SET password = ${hashPwd}, reset_token = NULL, reset_token_expiry = NULL WHERE id = ${userId}
      RETURNING id, username, email, is_verified, role;
    `;
    if (result.length === 0) {
      throw new Error("User not found");
    }
    return result[0];
  } catch (error) {
    console.error("Error updating user password:", error);
    throw new Error("Failed to update user password");
  }
}

export const deletePasswordVerification = async (userId: number) => {
  try {
    const result = await sql`
      UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = ${userId}
      RETURNING id, username, email, is_verified, role;
    `;
    if (result.length === 0) {
      throw new Error("User not found");
    }
    return result[0];
  } catch (error) {
    console.error("Error deleting password verification:", error);
    throw new Error("Failed to delete password verification");
  }
}

export const getUserById = async (userId: number) => { 
  try {
    const result = await sql`
      SELECT id, username, email, student_id, date_of_birth, phone_number, gender, profile_url, is_verified, role, created_at
      FROM users WHERE id = ${userId}
    `;
    if (result.length === 0) {
      throw new Error("User not found");
    }
    return result[0];
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw new Error("Failed to get user by ID");
  }
};

export const updateUserProfile = async (
  userId: number,
  profileData: Partial<User>
) => {
  try {
    const {
      username,
      phone_number,
      date_of_birth,
      gender,
      profile_url,
    } = profileData;

    const result = await sql`
      UPDATE users 
      SET 
        username = ${username},
        phone_number = ${phone_number},
        date_of_birth = ${date_of_birth},
        gender = ${gender},
        profile_url = ${profile_url},
        updated_at = NOW()
      WHERE id = ${userId}
      RETURNING 
        id,
        username,
        email,
        student_id,
        date_of_birth,
        phone_number,
        gender,
        profile_url,
        is_verified,
        last_login,
        ghana_card_number,
        role,
        created_at
    `;

    if (result.length === 0) {
      throw new Error("User not found");
    }
    return result[0];
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
};
