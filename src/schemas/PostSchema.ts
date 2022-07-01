import mongoose from "mongoose";
import { PostType } from "../types/types";

const Schema = mongoose.Schema;

export const postSchema = new Schema<PostType>({
    id: String,
    title: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    bloggerId: {
        type: String,
        required: true
    },
    bloggerName: String
})