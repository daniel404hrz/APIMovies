import { Router } from "express";
import { createUser, delUser, getUserByID, getUsers } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/session.js";
import { authLogin } from "../middlewares/login.js";

const router = Router();
router.post("/user", createUser)
router.get("/users",authMiddleware, getUsers )
router.get("/user/:id",authLogin,getUserByID)
router.delete("/user/:id",authMiddleware,delUser )
export default router;