import express from "express";
import dotenv from 'dotenv';
import morgan from "morgan";
import movieRouters from "./routes/movies.router.js";
import userRouters from "./routes/user.router.js"
dotenv.config();

const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));


app.use(movieRouters);
app.use(userRouters)
// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});


export default app;
