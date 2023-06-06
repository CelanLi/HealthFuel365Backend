import express, { Request, Response } from "express";
import mongoose from "mongoose";
import * as Constants from "./config";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import formData from "express-form-data";
import os from "os";
import path from "path";
import { allowCrossDomain } from "./middleware/middleware";

import productRoutes from "./routes/productRoutes";
mongoose.connect(Constants.mongoURI).catch((err) => {
  // eslint-disable-next-line no-console
  console.log(
    `MongoDB connection error. Please make sure MongoDB is running. ${err}`
  );
});
const app = express();
app.set("secretKey", Constants.JwtSecret);
app.set("port", process.env.PORT || "8081");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const options = {
  uploadDir: os.tmpdir(),
  autoClean: true,
};
app.use(formData.parse(options));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());
app.use(express.json());
app.use("/product", productRoutes);
app.use(allowCrossDomain);
app.get("/", (req: Request, res: Response) => {});

export default app;
