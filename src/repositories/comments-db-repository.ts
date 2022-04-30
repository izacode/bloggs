import { commentsCollection } from "./dbmongo"
import { CommentType } from "../types/types"

export const commentsRepository = {
    async createComment(newComment:CommentType){
        const createdComment = await commentsCollection.insertOne(newComment)
        return createdComment
    }
}