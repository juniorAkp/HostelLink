import { Router } from "express";
import {
  forgotPassword,
  getUserProfile,
  login,
  logout,
  refreshAccessToken,
  register,
  resetPassword,
  updateProfile,
  verifyEmail,
} from "../../controllers/auth";
import { protect } from "../../middleware/verify";
import multer from "multer";
import { upload } from "../../helpers/multer";

const router: any = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/refresh", refreshAccessToken);
router.post("/logout", protect, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/update-profile", upload.single("image"), protect, updateProfile);
router.get("/profile", protect, getUserProfile);

export default router;
