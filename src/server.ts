import app from "./app";
import sequelize from "../config/db";

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.error("❌ DB connection failed:", err));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
