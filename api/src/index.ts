import express from "express";
import { initDb } from "../helpers/initDb";
import router from "../routes/auth";
import { router as hostelRouter } from "../routes/hostels";
import { roomsRouter } from "../routes/rooms";
import { bookingsRouter } from "../routes/bookings";
import { arcjetProtect } from "../middleware/arcjet";
import { notificationsRouter } from "../routes/notifications";
import { PaymentsRouter } from "../routes/payments";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(helmet());
app.use(arcjetProtect);

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
app.use("/api/notifications", notificationsRouter);
app.use("/api/payments", PaymentsRouter);

app.listen(PORT, async () => {
  await initDb();
  console.log(`server is running on http://localhost:${PORT}`);
});
