import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import urlRoute from "./routes/url.js";

dotenv.config();
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3133;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//MongoDB connection
const snapURL = async () => {
  try {
    await mongoose.connect(process.env.snap_url_MONGODB_URL);
    console.log("Connect to MongoDB successfully");
  } catch (error) {
    console.log("Connection failed");
  }
};

snapURL();
app.use("/", urlRoute);
app.get("/", (req, res) => {
  res.send("Running snap url Server");
});
app.listen(PORT, (error) => {
  if (error) {
    console.log("Failed to connect server");
  } else {
    console.log(`Server started and Server running on ${PORT}`);
  }
});
