import { Router } from "express";
import { allPayments, paymentById, totalBookingsAmount } from "../../controllers/payments";
import { adminProtect, protect } from "../../middleware/verify";

export const PaymentsRouter: any = Router();

PaymentsRouter.get("/total-amount", protect, adminProtect, totalBookingsAmount);
PaymentsRouter.get("/all-payments", protect, adminProtect, allPayments);
PaymentsRouter.get("/get-payment/:id", protect, adminProtect, paymentById);
