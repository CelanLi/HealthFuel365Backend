import express, { Request, Response } from "express";
const app = express();
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});
app.set("port", process.env.PORT || "8081");

export default app;
