import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import {
    ref,
   
    get,
    
  } from "firebase/database";
dotenv.config();
const { JWT_SECRET } = process.env;

const tokenSign = async (id) => {
  const sign = jwt.sign(
    {
      id: id,

    },
    JWT_SECRET,
    {
      expiresIn: "23h",
    }
  );
  return sign;
};

export const auth = async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        res.status(400).json('Falta datos');
        return;
      }
      
      const userRef = ref(db, `usuarios/${id}`);
      
      const userSnapshot = await get(userRef);
  
      if (!userSnapshot.exists()) {
        res.status(404).json('USER_NO_REGISTRADO');
        return;
      }
  
      const user = userSnapshot.val();
      const token = await tokenSign(id);
      const expirationTime = 24 * 60 * 60 * 1000;
  
      res.cookie('localSession', token, {
        expires: new Date(Date.now() + expirationTime),
        httpOnly: false,
      });
  
      res.json({
        token: token,
        user,
      });
    } catch (error) {
      res.status(400).send('Authentication error');
    }
  };