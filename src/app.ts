import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import walletRoutes from "./routes/walletRoutes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", walletRoutes);

app.get("/", (_req, res) => {
  res.send("Shield Backend API");
});

export default app;
