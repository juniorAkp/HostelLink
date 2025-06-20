import { Router } from "express";
import { forgotPassword, login, logout, refreshAccessToken, register, resetPassword, updateProfile, verifyEmail } from "../../controllers/auth";
import { protect, verifyToken } from "../../middleware/verify";

const router:any = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/refresh",refreshAccessToken)
router.post("/logout",protect, logout);
router.post("/forgot-password", protect, forgotPassword);
router.post("/reset-password", protect, resetPassword);
router.post("/update-profile", protect, updateProfile);

  
export default router;