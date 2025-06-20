import jwt from 'jsonwebtoken';
import e, { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
export const verifyToken = (oldToken:string) => {
  const decoded = jwt.verify(oldToken, process.env.ACCESS_TOKEN_SECRET as string);
  if (!decoded) {
    throw new Error("Invalid access token");
  }
  return decoded;
}

export const verifyRefreshToken = (oldToken:string) => {
  const decoded = jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET as string);
  if (!decoded) {
    throw new Error("Invalid refresh token");
  }
  return decoded;
}

//protects routes by verifying the JWT token
export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) { 
      return res.status(401).json({ message: "Invalid token", success: false });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired", success: false });
    }
    return res.status(401).json({ message: error, success: false });
  }
}

//admin middleware to protect admin routes
export const adminProtect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
  try {
    const decoded = verifyToken(token);
    if (typeof decoded !== 'object' || decoded === null || (decoded as jwt.JwtPayload).role !== 'admin') {
      return res.status(403).json({ message: "Forbidden access", success: false });
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) { 
      return res.status(401).json({ message: "Invalid token", success: false });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired", success: false });
    }
    return res.status(401).json({ message: error, success: false });
  }
}