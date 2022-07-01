import mongoose from "mongoose";
import { CommentType } from "../types/types";
const Schema = mongoose.Schema;

const schemaType = {
  type: String,
  required: true,
};

export const commentSchema = new Schema<CommentType>({
  id: schemaType,
  postId: schemaType,
  content: schemaType,
  userId: schemaType,
  userLogin: schemaType,
  addedAt: schemaType,
});
