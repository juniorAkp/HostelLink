import express from "express";
import { initDb } from "../helpers/initDb";
import router from "../routes/auth";
import { router as hostelRouter } from "../routes/hostels";
import { roomsRouter } from "../routes/rooms";
import { bookingsRouter } from "../routes/bookings";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the HostelLink API" });
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
