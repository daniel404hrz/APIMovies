import express from "express";
import dotenv from 'dotenv';
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import movieRouters from "./routes/movies.router.js";
import userRouters from "./routes/user.router.js"
import purchaseRouters from "./routes/purchases.router.js"
import authRouter from "./routes/auth.router.js"
import rentaRouter from "./routes/rentas.router.js"
dotenv.config();

const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(movieRouters);
app.use(userRouters)
app.use(purchaseRouters)
app.use(rentaRouter)
app.use(authRouter)

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});


export default app;
