import { Router } from "express";
import { createUser } from "../controllers/users.controller.js";

const router = Router();
router.post("/user", createUser)
router.get("/users", )

router.put("/user/:id",)
router.delete("/user/:id",)
export default router;