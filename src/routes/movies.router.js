import { Router } from "express";
import { postMovie,getMovies,putLike, delMovies , getMovieByID} from "../controllers/movies.controller.js";
const router = Router();
router.post("/movies",postMovie)
router.get("/movies", getMovies)
router.get("/movies/:id", getMovieByID)
// darle like, quitar like
router.put("/movies_like/:id/:true",putLike)
router.delete("/movies/:id",delMovies)
export default router;