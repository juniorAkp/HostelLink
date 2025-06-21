import { Router } from "express";

export const roomsRouter: any = Router();
import {
  createRoom,
  getRoomsByHostelId,
  getRoomById,
  updateRoom,
  deleteRoom,
  getAvailableRooms,
} from "../../controllers/rooms";
import { adminProtect, protect } from "../../middleware/verify";

roomsRouter.post("/create-room/:hostelId", protect, adminProtect, createRoom);
roomsRouter.get("/get-room/:hostelId", getRoomsByHostelId);
roomsRouter.get("/available/:hostelId", getAvailableRooms);
roomsRouter.get("/get-room-id/:roomId", getRoomById);
roomsRouter.put("/update-room/:roomId",protect,adminProtect, updateRoom);
roomsRouter.delete("/delete-room/:roomId",protect,adminProtect, deleteRoom);
