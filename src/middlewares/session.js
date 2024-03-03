import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  update,
  remove,
} from "firebase/database";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const authMiddleware = async (req, res, next) => {
  try {
    if (!req.cookies || !req.cookies.localSession) {
      return res.status(401).json({
        error: "Necesita iniciar sesión",
      });
    }

    const dataToken = await verifyToken(req.cookies.localSession);

    if (!dataToken || !dataToken.id) {
      return res.status(401).json({
        error: "ERROR_ID_TOKEN",
      });
    }

    // Obtén los detalles del usuario desde la base de datos de Firebase
    const userRef = ref(db, `usuarios/${dataToken.id}`);

    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists()) {
      return res.status(401).json({
        error: "Usuario no encontrado",
      });
    }

    const userJson = userSnapshot.val();
    req.user = userJson;
    next();
  } catch (error) {
    res.status(401).json({
      error: "NOT_SESSION",
    });
  }
};
