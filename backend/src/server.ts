import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/auth";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Mount routes
app.use("/api/auth", authRouter);

mongoose.connect(process.env.MONGO_URI || "")
  .then(() => console.log("Mongo connected"))
  .catch(err => console.log(err));

app.listen(8080, () => {
  console.log("API running on 8080");
});