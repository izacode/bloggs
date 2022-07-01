import mongoose from "mongoose";
import { attemptSchema } from "../schemas/AttemptSchema";
import { bloggerSchema } from "../schemas/BloggerSchema";
import { commentSchema } from "../schemas/CommentSchema";
import { postSchema } from "../schemas/PostSchema";
import { userAccountDBSchema } from "../schemas/UserSchema";

export const PostModel = mongoose.model("Post", postSchema);
export const UserAccountDBModel = mongoose.model("UserAccounDB", userAccountDBSchema);
export const BloggerModel = mongoose.model("Blogger", bloggerSchema);
export const CommentModel = mongoose.model("Comment",commentSchema)
export const AttemptModel = mongoose.model("Attempt",attemptSchema)