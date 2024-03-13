import { Router } from "express";
import { postMovie,getMovies,putLike, delMovies , getMovieByID} from "../controllers/movies.controller.js";
import { authMiddleware } from "../middlewares/session.js";

const router = Router();
router.post("/movies",authMiddleware,postMovie)
router.get("/movies", getMovies)
router.get("/movies/:id" ,getMovieByID)
// darle like, quitar like
router.put("/movies_like/:movieId/:true/:userId", authMiddleware, putLike)
router.delete("/movies/:id",authMiddleware,delMovies)
export default router;