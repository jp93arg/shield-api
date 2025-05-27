import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";


dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", authRoutes);

app.get("/", (_req, res) => {
  res.send("Shield Backend API");
});

export default app;
