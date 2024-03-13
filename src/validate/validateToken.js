import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const { JWT_SECRET } = process.env;
export const validateToken = async (req, res, next) => {
  try {
    const accesToken = req.cookies.localSession;
    
   
    if (!accesToken) res.status(403).json({ error: "Access denied" });
    else
      jwt.verify(accesToken, JWT_SECRET, (err, user) => {
        if (err)
          res
            .status(403)
            .json({ error: "Access denied, token expired or incorrect" });
        else next();
      });
  } catch (error) {
    res.send("Access denied");
  }
};