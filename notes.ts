// const checkBloggerID = (id:number, bloggers: BloggerType[], res: Response, next: NextFunction) => {
//     const bloggerID = id;
//     const blogger = bloggers.find((b) => b.id === bloggerID);
//     if(!bloggerID || !blogger){
//       return res.status(404).json({
//         status: "fail",
//         message: "Invalid ID  or blogger doesn't exists",
//       });
//     }
//     next()
// }
