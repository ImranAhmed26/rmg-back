import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";
import requestInfoRouter from "./routes/requestInfo.js";

// Configuration
dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;
const DB_URI = process.env.MONGO_URI;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "5mb" }));

// Route
app.all("/", (req, res) => {
  res.send({ message: "Welcome" });
});

app.use("/api/v1/user", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/requests", requestInfoRouter);

app.all("*", (req, res) => res.status(404).send({ message: "Could not find any resource!" }));

// Connect
const connect = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`DB Connected successfully`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

app.listen(PORT, () => {
  console.log(`server connected to port ${PORT} successfully`);
  connect();
});
