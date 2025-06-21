import { sql } from "../../config/db";

interface Room {
  roomNumber: string;
  amenities: string[];
  roomGender: string;
  capacity: number;
  roomPrice: number;
  isBookable?: boolean;
}

export const addRoomToHostel = async (hostelId: string, roomData: Room) => {
  try {
    const { roomNumber, amenities, roomGender, capacity, roomPrice } = roomData;
    const result = await sql`
      INSERT INTO rooms (hostel_id, room_number, amenities, gender, capacity, price, created_at)
      VALUES (${hostelId}, ${roomNumber}, ${amenities}, ${roomGender}, ${capacity}, ${roomPrice}, Now())
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error("Error adding room to hostel:", error);
    throw new Error("Unable to add room");
  }
};

export const getRoomsByHostelIdfromDb = async (hostelId: string) => {
  try {
    const result = await sql`
      SELECT * FROM rooms WHERE hostel_id = ${hostelId};
    `;
    return result;
  } catch (error) {
    console.error("Error fetching rooms by hostel ID:", error);
    throw new Error("Unable to fetch rooms");
  }
};

export const getRoomByIdfromDb = async (roomId: string) => {
  try {
    const result = await sql`
      SELECT * FROM rooms WHERE id = ${roomId};
    `;
    return result[0];
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    throw new Error("Unable to fetch room");
  }
};

export const updateRoomfromDb = async (roomId: string, updates: Partial<Room>) => {
  const { roomNumber, amenities, roomGender, capacity, roomPrice, isBookable } = updates;
  try {
    const existingRoom = await sql`
      SELECT * FROM rooms WHERE id = ${roomId};
    `;
    if (!existingRoom[0]) {
      throw new Error("Room not found");
    }
    let newAmenities = existingRoom[0].amenities;
    if (amenities && Array.isArray(amenities)) {
      const existingAmenities = Array.isArray(existingRoom[0].amenities)
      ? existingRoom[0].amenities
      : [];
      newAmenities = Array.from(new Set([...existingAmenities, ...amenities]));
    }

    const result = await sql`
      UPDATE rooms
      SET
      room_number = COALESCE(${roomNumber}, room_number),
      amenities = COALESCE(${newAmenities}, amenities),
      gender = COALESCE(${roomGender}, gender),
      capacity = COALESCE(${capacity}, capacity),
      price = COALESCE(${roomPrice}, price),
      is_bookable = COALESCE(${isBookable}, is_bookable)
      WHERE id = ${roomId}
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error("Error updating room:", error);
    throw new Error("Unable to update room");
  }
};

export const deleteRoomfromDb = async (roomId: string) => {
  try {
    await sql`
      DELETE FROM rooms WHERE id = ${roomId};
    `;
  } catch (error) {
    console.error("Error deleting room:", error);
    throw new Error("Unable to delete room");
  }
};

export const getAvailableRoomsfromDb = async (hostelId: string) => {
  try {
    const result = await sql`
      SELECT * FROM rooms WHERE hostel_id = ${hostelId} AND is_bookable = true;
    `;
    return result;
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    throw new Error("Unable to fetch available rooms");
  }
};
