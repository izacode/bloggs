import mongoose from "mongoose";
import { BloggerType } from "../types/types";

const Schema = mongoose.Schema;

export const bloggerSchema = new Schema<BloggerType>({
  id: String,
  name: {
    type: String,
    required: true,
  },

  youtubeUrl: {
    type: String,
    required: true,
  },
});
