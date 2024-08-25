import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    shortId: { type: String, unique: true },
    alias: { type: String, unique: true },
    redirectURL: { type: String, required: true },
    visitHistory: [{ timestamp: { type: Number } }],
  },
  { timestamps: true }
);

export default mongoose.model("url", urlSchema);
