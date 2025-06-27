import { Response, Request } from "express";
import { getAllPayments, getPaymentById, getTotalBookingsAmount } from "../models/payments";

export const totalBookingsAmount = async (req: Request, res: Response) => { 
  try {
    const totalAmount = await getTotalBookingsAmount();
    if (totalAmount === 0) {
      return res.status(404).json({ message: "total amount is zero", success: false });
    }
    return res.status(200).json({ totalAmount, success: true });
  } catch (error) {
    console.error("Error fetching total bookings amount:", error);
    return res.status(500).json({ message: "Could not fetch total bookings amount", success: false });
  }
}

export const allPayments = async (req: Request, res: Response) => { 
  try {
    const payments = await getAllPayments();
    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No payments found", success: false });
    }
    return res.status(200).json({ payments, success: true });
  } catch (error) {
    console.error("Error fetching all payments:", error);
    return res.status(500).json({ message: "Could not fetch all payments", success: false });
  }
}

export const paymentById = async (req: Request, res: Response) => {
  const paymentId = req.params.id as unknown as string;
  if (!paymentId) {
    return res.status(400).json({ message: "Payment ID is required", success: false });
  }
  try {
    const payment = await getPaymentById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found", success: false });
    }
    return res.status(200).json({ payment, success: true });
  } catch (error) {
    console.error("Error fetching payment by ID:", error);
    return res.status(500).json({ message: "Could not fetch payment", success: false });
  }
}