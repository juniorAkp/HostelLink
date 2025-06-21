
import { Request, Response } from "express";
import { getHostelByIdFromDb } from "../models/hostels";
import { addRoomToHostel, deleteRoomfromDb, getAvailableRoomsfromDb, getRoomByIdfromDb, getRoomsByHostelIdfromDb, updateRoomfromDb } from "../models/room";

export const createRoom = async (req: Request, res: Response) => {
  let { number, amenities, roomGender, capacity, roomPrice } = req.body;
  const { hostelId } = req.params;

  if (!hostelId || !number || !amenities || !roomGender || !capacity || !roomPrice) {
    return res.status(400).json({
      message: "Hostel ID and room data are required",
      success: false,
    });
  }
  //convert amenities to an array if it's a string
  if (typeof amenities === 'string') {
    amenities = amenities.split(',').map(item => item.trim());
  }
  // Validate roomGender and capacity
  const validRoomGenders = ['male', 'female'];
  if (typeof roomGender !== 'string' || typeof capacity !== 'number') {
    return res.status(400).json({
      message: "Invalid room gender or capacity",
      success: false,
    });
  }

  if (!validRoomGenders.includes(roomGender)) {
    return res.status(400).json({
      message: "Invalid room gender",
      success: false,
    });
  }

  try {
    const hostel = await getHostelByIdFromDb(hostelId);
    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
        success: false,
      });
    }
    const newRoom = await addRoomToHostel(hostelId, {
      roomNumber: number,
      amenities,
      roomGender,
      capacity: capacity,
      roomPrice,
    });
    return res.status(201).json({
      message: "Room added successfully",
      room: newRoom,
      success: true,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getRoomsByHostelId = async(req: Request, res: Response) => {
  const { hostelId } = req.params;

  if (!hostelId) {
    return res.status(400).json({
      message: "Hostel ID is required",
      success: false,
    });
  }
  try {
    const rooms = await getRoomsByHostelIdfromDb(hostelId);
    return res.status(200).json({
      rooms,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export const getRoomById = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({
      message: "Room ID is required",
      success: false,
    });
  }
  try {
    const room = await getRoomByIdfromDb(roomId);
    if (!room) {
      return res.status(404).json({
        message: "Room not found",
        success: false,
      });
    }
    return res.status(200).json({
      room,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const {number, capacity, amenities, roomGender, roomPrice, isBookable } = req.body;

  if (!roomId) {
    return res.status(400).json({
      message: "Room ID is required",
      success: false,
    });
  }
  try {
    const room = await updateRoomfromDb(roomId, {
      roomNumber:number,
      amenities,
      roomGender,
      capacity,
      roomPrice,
      isBookable
    });
    return res.status(200).json({
      message: "Room updated successfully",
      room,
      success: true,
    });
  } catch (error) {
    console.error("Error updating room:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({
      message: "Room ID is required",
      success: false,
    });
  }
  try {
    await deleteRoomfromDb(roomId);
    return res.status(200).json({
      message: "Room deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getAvailableRooms = async (req: Request, res: Response) => {
  const { hostelId } = req.params;

  if (!hostelId) {
    return res.status(400).json({
      message: "Hostel ID is required",
      success: false,
    });
  }
  try {
    const rooms = await getAvailableRoomsfromDb(hostelId);
    return res.status(200).json({
      rooms,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

