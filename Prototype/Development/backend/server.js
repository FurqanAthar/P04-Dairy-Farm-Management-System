import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import farmRoutes from "./routes/farmRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import customerRoute from "./routes/customerRoute.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use("/farm", farmRoutes);
app.use("/record", recordRoutes);
app.use("/upload", uploadRoutes);
app.use("/customer", customerRoute);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const PORT = process.env.PORT || 8080;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
