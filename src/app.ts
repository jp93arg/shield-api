import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import walletRoutes from "./routes/walletRoutes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", authRoutes);
app.use("/api", walletRoutes);

app.get("/", (_req, res) => {
  res.send("Shield Backend API");
});

export default app;
