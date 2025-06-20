import { Router } from "express";
import { login, register, verifyEmail } from "../../controllers/auth";

const router:any = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-token", verifyEmail);

export default router;