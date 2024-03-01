import { Router } from "express";

import { authMiddleware } from "../middlewares/session.js";
import { createRentals,getRentas } from "../controllers/renta.controller.js";

const router = Router();
router.post("/renta",createRentals)
router.get("/rentas",authMiddleware,getRentas )
router.get("/renta/:id" ,authMiddleware,)
router.delete("/renta/:id",authMiddleware,)
export default router;