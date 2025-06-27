//get user bookings
import { sql } from "../../config/db";

export const getUserBookingsfromDb = async (userId: number) => {
  try {
    const bookings = await sql`
    SELECT b.id, b.start_date, b.end_date, b.status, b.total_amount, r.room_number, h.name AS hostel_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN hostels h ON b.hostel_id = h.id
    WHERE b.user_id = ${userId}
    ORDER BY b.created_at DESC;
    `;
    return bookings;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw new Error("Could not fetch user bookings");
  }
};

export const getBookingByIdfromDb = async (bookingId: number) => {
  try {
    const booking = await sql`
    SELECT b.id, b.start_date, b.end_date, b.status, b.total_amount, r.room_number, h.name AS hostel_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN hostels h ON b.hostel_id = h.id
    WHERE b.id = ${bookingId};
    `;
    return booking.length > 0 ? booking[0] : null;
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    throw new Error("Could not fetch booking");
  }
};

//admin functions to get all bookings and include search functionality by user name or user id

export const getAllAdminBookingsfromDb = async (searchTerm?: string) => {
    try {
      const bookings = await sql`
      SELECT b.id, b.start_date, b.end_date, b.total_amount, b.created_at, b.status, b.total_amount, r.room_number, h.name AS hostel_name, u.id AS user_id, u.username AS user_name
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN hostels h ON b.hostel_id = h.id
      JOIN users u ON b.user_id = u.id
      WHERE u.email ILIKE ${searchTerm ? "%" + searchTerm + "%" : "%%"} OR u.id::text ILIKE ${searchTerm ? "%" + searchTerm + "%" : "%%"}
      ORDER BY b.created_at DESC;
      `;
      return bookings;
    } catch (error) {
      console.error("Error fetching admin bookings with search term:", error);
      throw new Error("Could not fetch admin bookings with search term");
    }
};
