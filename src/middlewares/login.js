import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const authLogin = async (req, res, next) => {
    console.log(req.cookies.localSession);
    try {
      if (!req.cookies || !req.cookies.localSession) {
        // No hay cookie, solo llama a next
        
        return next();
      }
  
      const dataToken = await verifyToken(req.cookies.localSession);
  
      if (!dataToken || !dataToken.id) {
        return res.status(401).json({
          error: "ERROR_ID_TOKEN",
        });
      }
  
      // Si hay cookie, establece req.params.id y luego llama a next
      req.params.id = dataToken.id;
      return next()
    } catch (error) {
        res.status(401).json({
          error: "NOT_SESSION",
        });
      }
    };