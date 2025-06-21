import express from "express";
import { initDb } from "../helpers/initDb";
import router from "../routes/auth";
import { router as hostelRouter } from "../routes/hostels";
import { roomsRouter } from "../routes/rooms";
import { bookingsRouter } from "../routes/bookings";
import { NextFunction, Request, Response } from "express";
import { aj } from "../config/arcjet";
import { isSpoofedBot } from "@arcjet/inspect";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const arcjetProtect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const decision = await aj.protect(req, { requested: 3 });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return res.status(429).json({ error: "Too Many Requests" });
    } else if (decision.reason.isBot()) {
      return res.status(403).json({ error: "No bots allowed" });
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }
  } else if (decision.results.some(isSpoofedBot)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the HostelLink API", success: true });
});
app.get("/api/bookings/verify-payment", (req, res) => {
  res.json({ message: "Payment verification successful" });
});
app.use("/api/auth", router);
app.use("/api/hostels", hostelRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/bookings", bookingsRouter);

app.listen(PORT, async () => {
  await initDb();
  console.log(`server is running on http://localhost:${PORT}`);
});
