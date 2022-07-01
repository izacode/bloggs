import mongoose from "mongoose";
const Schema = mongoose.Schema;
export const attemptSchema = new Schema({
  ip: { type: String, required: true },
  attemptDate: { type: Date, required: true },
  url: { type: String, required: true },
});
