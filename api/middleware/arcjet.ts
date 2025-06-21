import { NextFunction, Request, Response } from "express";
import { aj } from "../config/arcjet";
import { isSpoofedBot } from "@arcjet/inspect";
export const arcjetProtect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (process.env.NODE_ENV === "development") {
      return next(); 
    }
    const decision = await aj.protect(req, { requested: 3 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
        return;
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "No bots allowed" });
        return;
      }
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    if (decision.results.some((result) => isSpoofedBot(result))) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  } catch (error) {
    console.error("ArcJet protection error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
