import { Router } from "express";

export const bookingsRouter:any = Router();

import { bookroom, verifyBooking } from "../../controllers/book";
import { protect } from "../../middleware/verify";

bookingsRouter.post("/book-room/:roomId", protect, bookroom);
bookingsRouter.post("/confirm-booking", protect, verifyBooking);