import express from "express";
const app = express();
import dotenv from 'dotenv';
import morgan from "morgan";
dotenv.config();

//middlewares

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ''); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

export default app
