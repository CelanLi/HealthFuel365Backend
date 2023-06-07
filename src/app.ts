import express, { Request, Response } from "express";
import mongoose from "mongoose";
import * as Constants from "./config";
import productRoutes from "./routes/productRoutes";
import { allowCrossDomain } from "./middleware/middleware";
mongoose.connect(Constants.mongoURI).catch((err) => {
  // eslint-disable-next-line no-console
  console.log(
    `MongoDB connection error. Please make sure MongoDB is running. ${err}`
  );
});
const app = express();

// allow requests from different domains
app.use(allowCrossDomain);
app.use(express.json());
app.use("/product", productRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});
app.set("port", process.env.PORT || "8081");

export default app;
