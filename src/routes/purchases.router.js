import { Router } from "express";
import { createPurchases, getPurchases } from "../controllers/compra.controller.js";
import { authMiddleware } from "../middlewares/session.js";
const router = Router();
router.post("/purchases",authMiddleware,createPurchases)
router.get("/purchases",authMiddleware, getPurchases)



export default router;