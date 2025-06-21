// Book controller
import { Request, Response } from "express";
import { sql } from "../config/db";
import { getRoomByIdfromDb, updateRoomAvailability } from "../models/room";
import { Paystack } from "paystack-sdk";

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

export const bookroom = async (req: Request, res: Response) => {
  const { startDate, endDate, email } = req.body;
  const { roomId } = req.params;

  if (!startDate || !endDate || !roomId || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    // a transaction to book a room, pay for it and update notification
    const room = await getRoomByIdfromDb(roomId);
    console.log("Room details:", room);

    let booking: any = null;
    let payment: any = null;
    let notification: any = null;

    const totalAmount = ((room.price) * 100 + 25 * 100);
    try {
      await sql`BEGIN`
        .then(async () => {
          [booking] = await sql`
          INSERT INTO bookings (user_id, room_id, hostel_id, start_date, end_date, total_amount, created_at)
          VALUES (${req.user?.userId}, ${roomId}, ${
            room.hostel_id
          }, ${startDate}, ${endDate}, ${
            room.price 
          }, NOW()) RETURNING id, user_id`;

          [payment] = await sql`
          INSERT INTO payments (user_id, booking_id, amount, created_at)
          VALUES (${booking.user_id}, ${booking.id}, ${
            totalAmount
          }, NOW()) RETURNING id, user_id`;

          // create notification
          [notification] = await sql`
          INSERT INTO notifications (user_id, message, created_at)
          VALUES (${booking.user_id}, 'Your booking has been confirmed', NOW()) RETURNING id`;

          // Commit the transaction
          await sql`COMMIT`;
        })
        .catch(async (error) => {
          console.error("Error in booking transaction:", error);
          await sql`ROLLBACK`;
          throw new Error("Booking transaction failed");
        });
      console.log("totalAmount:", totalAmount); // Convert to kobo for Paystack
      const payOrders = await paystack.transaction.initialize({
        amount: totalAmount.toString(),
        email: email,
        reference: `TXN-${Date.now()}`,
        callback_url: "https://dcit208.com/payment-success",
        metadata: {
          bookingId: booking.id,
          userId: req.user?.userId,
          roomId: roomId,
        },
      });
      return res.status(200).json({
        message: "Room booked successfully",
        success: true,
        paymentUrl: payOrders.data?.authorization_url,
        reference: payOrders.data?.reference,
      });
    } catch (error) {
      // Rollback the transaction if any error occurs
      await sql`ROLLBACK`;
      console.error("Error in booking process:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    await sql`ROLLBACK`;
    console.error("Error fetching room details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyBooking = async (req: Request, res: Response) => {
  const { transactionId } = req.body;
  if (!transactionId) {
    return res.status(400).json({ message: "Transaction ID is required" });
  }
  try {
    const response = await paystack.transaction.verify(transactionId);

    if (!response.data || response.data.status !== "success") {
      return res.status(400).json({ message: "transaction failed" });
    }
    const [payments] = await sql`
      SELECT * FROM payments WHERE transaction_id = ${transactionId}
    `;
    if (payments) {
      return res.status(202).json({ message: "Payment already processed" });
    }
    //Begin transaction
    await sql`BEGIN`
      .then(async () => {
        await sql`
        UPDATE payments SET status = 'paid', transaction_id = ${transactionId}
        where booking_id = ${response.data.metadata?.bookingId}
      `;
        await sql`
        UPDATE bookings SET status = 'completed' WHERE id = ${response.data.metadata?.bookingId}
      `;
        await sql`
        UPDATE rooms SET rooms_available = rooms_available - 1 WHERE id = ${response.data.metadata?.roomId}
      `;
        await updateRoomAvailability(response.data.metadata?.roomId as string);
        await sql`
        INSERT INTO notifications (user_id, message, created_at)
        VALUES (${response.data.metadata?.userId}, 'Your booking has been completed', NOW())
      `;
        await sql`COMMIT`;
      })
      .catch(async (error) => {
        console.error("Error in confirming booking:", error);
        await sql`ROLLBACK`;
        res.status(500).json({ message: "Internal server error" });
      });
    return res
      .status(200)
      .json({ message: "Booking verified successfully", success: true });
  } catch (error) {
    console.error("Error verifying booking:", error);
    await sql`ROLLBACK`;
    res.status(500).json({ message: "Internal server error" });
  }
};
