import { Router } from "express";
import {
  createHostel,
  deleteHostel,
  getHostelById,
  getHostels,
  updateHostel,
} from "../../controllers/hostel";
import { upload } from "../../helpers/multer";
import { adminProtect, protect } from "../../middleware/verify";
export const router: any = Router();

router.post(
  "/create-hostel",
  upload.single("image"),
  protect,
  adminProtect,
  createHostel
);
router.get("/get-hostels", getHostels);
router.get("/get-hostel/:hostelId", getHostelById);
router.put(
  "/update-hostel/:hostelId",
  upload.single("image"),
  protect,
  adminProtect,
  updateHostel
);
router.delete("/delete-hostel/:hostelId", protect, adminProtect, deleteHostel);
