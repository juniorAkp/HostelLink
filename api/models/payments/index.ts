import { sql } from "../../config/db";

// to calculate total amount for all bookings
export const getTotalBookingsAmount = async () => {
  try {
    const result = await sql`
      SELECT SUM(p.amount) AS total_amount
      FROM payments p
      JOIN users u ON p.user_id = u.id
    `;
    return result[0]?.total_amount || 0;
  } catch (error) {
    console.error("Error fetching total bookings amount:", error);
    throw new Error("Could not fetch total bookings amount");
  }
};

//get all payments
export const getAllPayments = async () => {
  try {
    const payments = await sql`
      SELECT p.id, p.amount, u.email AS user_name
      FROM payments p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC;
    `;
    return payments;
  } catch (error) {
    console.error("Error fetching all payments:", error);
    throw new Error("Could not fetch all payments");
  }
};

//get payment by id
export const getPaymentById = async (paymentId: string) => {
  try {
    const payment = await sql`
      SELECT p.id, p.amount, p.status, p.transaction_id, p.booking_id, p.created_at, u.email, u.id AS user_details
      FROM payments p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ${paymentId};
    `;
    return payment.length > 0 ? payment[0] : null;
  } catch (error) {
    console.error("Error fetching payment by ID:", error);
    throw new Error("Could not fetch payment");
  }
}