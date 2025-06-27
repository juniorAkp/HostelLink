import { Router } from "express";

export const bookingsRouter:any = Router();

import { bookroom, getAdminBookings, getUserBookings, verifyBooking } from "../../controllers/book";
import { protect, adminProtect } from "../../middleware/verify";

bookingsRouter.post("/book-room/:roomId", protect, bookroom);
bookingsRouter.post("/confirm-booking", protect, verifyBooking);
bookingsRouter.get("/my-bookings", protect, getUserBookings);
bookingsRouter.get("/all-bookings", protect, adminProtect, getAdminBookings);