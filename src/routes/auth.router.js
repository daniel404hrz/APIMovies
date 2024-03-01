import { Router } from "express";
import { auth } from "../controllers/auth.js";
import { authMiddleware } from "../middlewares/session.js";
// import { loginSuccess } from "../controllers/login.js";

const router = Router();

router.post("/auth/login", auth);
router.get("/login/success", authMiddleware);

export default router;