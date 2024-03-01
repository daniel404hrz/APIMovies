import { Router } from "express";

import { authMiddleware } from "../middlewares/session.js";
import { addRecargo, createRentals,delRenta,getRentas } from "../controllers/renta.controller.js";

const router = Router();
router.post("/renta",authMiddleware,createRentals)
router.get("/rentas",authMiddleware,getRentas )
router.put("/renta/:id" ,authMiddleware,addRecargo)
router.delete("/renta/:id",authMiddleware,delRenta)
export default router;