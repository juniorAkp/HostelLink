import jwt from "jsonwebtoken";

export function generateAccessToken(userId: string): string{
  // Generate a JWT token with userId as payload
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    subject: "accessToken",
    
    expiresIn:"15m" // Token expires in 15 minutes
  });
}

export function generateRefreshToken(userId: string): string {
  // Generate a JWT token with userId as payload
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    subject: "refreshToken",
    expiresIn: "7d" // Token expires in 7 days
  });
}

export function generateEmailVerificationToken():number {
  // Generate a random number for email verification
  //return a 4 digit code
  return Math.floor(1000 + Math.random() * 9000); 
}