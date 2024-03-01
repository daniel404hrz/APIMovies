import { Router } from "express";
import { createUser, delUser, getUsers } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/session.js";

const router = Router();
router.post("/user", createUser)
router.get("/users",authMiddleware, getUsers )
router.get("/user:id",authMiddleware,)
router.delete("/user/:id",authMiddleware,delUser )
export default router;