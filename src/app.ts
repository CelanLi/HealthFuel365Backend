import express, { Request, Response } from "express";
import cors from 'cors';
import mongoose from "mongoose";
import * as Constants from "./config";
import productRoutes from "./routes/productRoutes";
import productDetailRoutes from "./routes/productDetailRoutes";
import shoppingCartRoutes from "./routes/shoppingCartRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import alternativeRoutes from "./routes/alternativeRoutes";
import adminRoutes from "./routes/adminRoutes";
import recommendationRoutes from "./routes/recommendationRoutes";
import { allowCrossDomain } from "./middleware/middleware";
mongoose.connect(Constants.mongoURI).catch((err) => {
  // eslint-disable-next-line no-console
  console.log(
    `MongoDB connection error. Please make sure MongoDB is running. ${err}`
  );
});
const app = express();
const bodyParser = require('body-parser');

// allow Cross-origin resource sharing
app.use(cors({
  origin: 'http://localhost:3000', // set the domain names that are allowed to be accessed
  credentials: true, // allow cookies sent through the request
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // HTTP requests allowed
  allowedHeaders: ['Content-Type', 'Authorization'] // headers allowed
}));

// allow requests from different domains
app.use(allowCrossDomain);
// app.use(express.json());
// the max size of request is limited in 1mb
app.use(express.json({limit : "1mb"}));
app.use("/product", productRoutes);
app.use("/product/detail", productDetailRoutes);
app.use("/shoppingcart", shoppingCartRoutes);
app.use("/user",userRoutes);
app.use("/alternative", alternativeRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/recommendation", recommendationRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});
app.set("port", process.env.PORT || "8081");

export default app;
