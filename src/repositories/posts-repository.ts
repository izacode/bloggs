// import { BloggerType, ErrorType, PostType } from "../types/types";
// import { posts, bloggers } from "./db";

// export let error: ErrorType = {
//   data: {},
//   errorMessage: {},
//   resultCode: 0,
// };

// export const postsHandlers = {
//   getAllPosts() {
//     const postsWithBloggerNames: PostType[] = posts.map((p: PostType) =>
//       Object.assign(p, { bloggerName: bloggers.find((b: BloggerType) => b.id === p.bloggerId)?.name })
//     );
//     return postsWithBloggerNames;
//   },

//   createPost(title: string, shortDescription: string, content: string, bloggerId: number) {
//     const newPost: PostType = {
//       id: Number(posts.length + 1),
//       title,
//       shortDescription,
//       content: "Lorem ipsum dolor ",
//       bloggerId,
//     };

//     posts.push(newPost);
//     const postsWithBloggerNames: PostType[] = posts.map((p: PostType) =>
//       Object.assign(p, { bloggerName: bloggers.find((b: BloggerType) => b.id === p.bloggerId)?.name })
//     );
//     return postsWithBloggerNames.find((p: PostType) => p.id === newPost.id);
//   },

//   getPost(postID: number) {
//     const post = posts.find((p) => p.id === postID);
//     return post;
//   },

//   updatePost(postID: number, title: string, shortDescription: string, content: string, bloggerId: number) {
//     const postWithBloggerName = posts
//       .map((p: PostType) => Object.assign(p, { bloggerName: bloggers.find((b: BloggerType) => b.id === p.bloggerId)?.name }))
//       .find((p: PostType) => p.id === postID);

//     if (postID > posts.length || isNaN(postID)) {
//       error.data = {
//         id: postID,
//       };
//       error.errorMessage = {
//         message: "Invalid ID",
//         field: "id",
//       };
//       error.resultCode = 0;
//       return error;
//     } else if (postWithBloggerName !== undefined) {
//       const updatedPost: PostType = {
//         id: postID,
//         title,
//         shortDescription,
//         content,
//         bloggerId,
//       };
//       const postIndex = posts.findIndex((p: PostType) => p.id === postID);
//       posts.splice(postIndex, 1, updatedPost);
//       return updatedPost;
//     }
//   },
//   deletePost(postID: number) {
//     if (postID > posts.length || isNaN(postID)) {
//       console.log("Inside delete if");
//       error.data = {
//         id: postID,
//       };
//       error.errorMessage = {
//         message: "Invalid ID",
//         field: "id",
//       };
//       error.resultCode = 0;
//       return error;
//     } else {
//       const post = posts.find((p: PostType) => p.id === postID);
//       const postIndex = posts.findIndex((p: PostType) => p.id === postID);
//       posts.splice(postIndex, 1);
//       return post;
//     }
//   },
// };
