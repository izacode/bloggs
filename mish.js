"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const jsonBodyMiddleware = body_parser_1.default.json();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
//const urlValidator = /^(http(s)?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+\/[/a-zA-Z0-9_-]+$/
const urlValidator = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/;
app.use(jsonBodyMiddleware);
app.use((0, cors_1.default)());
let posts = [
    {
        id: 1,
        title: "lorem",
        shortDescription: "",
        content: "lorem ipsum sens",
        blogId: 1,
    },
    {
        id: 2,
        title: "lorem",
        shortDescription: "",
        content: "lorem ipsum sens",
        blogId: 2,
    },
];
let bloggers = [
    { id: 1, name: "Zahar", youtubeUrl: "https://youtube.com" },
    { id: 2, name: "Matilda", youtubeUrl: "https://youtube.com" },
];
//---------------------------------Bloggers---------------------------------
//Returns all bloggers
app.get("/api/bloggers", (req, res) => {
    res.status(200);
    res.send(bloggers);
});
//Create new blogger
app.post("/api/bloggers", (req, res) => {
    let isValid = true;
    let trobblesOccured = [];
    if (!req.body.name && req.body.name.length < 1) {
        isValid = false;
        trobblesOccured.push({
            message: "name required",
            field: "name",
        });
    }
    if (!urlValidator.test(req.body.youtubeUrl)) {
        isValid = false;
        trobblesOccured.push({
            message: "The field YoutubeUrl must match the regular expression" +
                " '^https://([a-zA-Z0-9_-]+\\\\.)+[a-zA-Z0-9_-]+(\\\\/[a-zA-Z0-9_-]+)*\\\\/?$'.\"",
            field: "youtubeUrl",
        });
    }
    if (isValid) {
        const newBlogger = {
            id: +new Date(),
            name: req.body.name,
            youtubeUrl: req.body.youtubeUrl,
        };
        bloggers.push(newBlogger);
        res.statusCode = 201;
        res.send(newBlogger);
    }
    else {
        res.status(400);
        res.send({
            data: {},
            errorsMessages: trobblesOccured,
            resultCode: 1,
        });
    }
});
//Returns blogger by id
app.get("/api/bloggers/:bloggerId", (req, res) => {
    const id = +req.params.bloggerId;
    const blogger = bloggers.find((b) => b.id === id);
    if (blogger) {
        res.statusCode = 200;
        res.send(blogger);
    }
    else {
        res.status(404);
        res.send({
            data: {},
            errorsMessages: [
                {
                    message: "blogger not found or blogger's id invalid",
                    field: "id",
                },
            ],
            resultCode: 1,
        });
    }
});
//Update existing Blogger by id with InputModel
app.put("/api/bloggers/:bloggerId", (req, res) => {
    let isValid = true;
    let trobblesOccured = [];
    const id = +req.params.bloggerId;
    const blogger = bloggers.find((b) => b.id === id);
    if (!blogger) {
        isValid = false;
        res.status(404);
        res.send({
            data: {},
            errorsMessages: [
                {
                    message: "blogger not found",
                    field: "id",
                },
            ],
            resultCode: 0,
        });
        return;
    }
    if (!urlValidator.test(req.body.youtubeUrl)) {
        isValid = false;
        trobblesOccured.push({
            message: "blogger's youtube URL invalid",
            field: "youtubeUrl",
        });
    }
    if (!id) {
        isValid = false;
        trobblesOccured.push({
            message: "blogger's id is invalid",
            field: "id",
        });
    }
    if (!req.body.name) {
        isValid = false;
        trobblesOccured.push({
            message: "blogger's name is invalid",
            field: "name",
        });
    }
    if (isValid) {
        blogger.name = req.body.name;
        blogger.youtubeUrl = req.body.youtubeUrl;
        res.send(204);
    }
    else {
        res.status(400);
        res.send({
            data: {},
            errorsMessages: trobblesOccured,
            resultCode: 1,
        });
    }
});
//Delete blogger specified by id
app.delete("/api/bloggers/:postId", (req, res) => {
    const id = +req.params.postId;
    const newBloggers = bloggers.filter((b) => b.id != id);
    if (newBloggers.length < bloggers.length) {
        bloggers = newBloggers;
        res.send(204);
    }
    else {
        res.status(404);
        res.send({
            data: {},
            errorsMessages: [
                {
                    message: "blogger not found",
                    field: "id",
                },
            ],
            resultCode: 0,
        });
    }
});
//---------------------------------Posts---------------------------------
//Returns all posts
app.get("/api/posts", (req, res) => {
    const postsWithNames = [];
    posts.forEach((p) => {
        var _a;
        postsWithNames.push(Object.assign(Object.assign({}, p), { bloggerName: (_a = bloggers.find((b) => b.id === p.blogId)) === null || _a === void 0 ? void 0 : _a.name }));
    });
    res.status(200);
    res.send(postsWithNames);
});
//Create new post
app.post("/api/posts", (req, res) => {
    const blogger = bloggers.find((b) => b.id === req.body.blogId);
    let isValid = true;
    let trobblesOccured = [];
    if (!req.body.title) {
        isValid = false;
        trobblesOccured.push({
            message: "title required",
            field: "title",
        });
    }
    if (!req.body.shortDescription) {
        isValid = false;
        trobblesOccured.push({
            message: "shortDescription required",
            field: "shortDescription",
        });
    }
    if (!req.body.content) {
        isValid = false;
        trobblesOccured.push({
            message: "content required",
            field: "content",
        });
    }
    if (!blogger) {
        isValid = false;
        trobblesOccured.push({
            message: "blogger not found",
            field: "blogger",
        });
    }
    if (isValid) {
        const newPost = {
            id: +new Date(),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
        };
        posts.push(newPost);
        res.status(200).send(newPost);
    }
    else {
        res.status(400).send({
            data: {},
            errorsMessages: trobblesOccured,
            resultCode: 1,
        });
    }
});
//Return post by id
app.get("/api/posts/:postId", (req, res) => {
    var _a;
    const id = +req.params.postId;
    const post = posts.find((p) => p.id === id);
    if (post) {
        res.send(Object.assign(Object.assign({}, post), { bloggerName: (_a = bloggers.find((b) => b.id === id)) === null || _a === void 0 ? void 0 : _a.name }));
    }
    else {
        res.status(404).send({
            data: {},
            errorsMessages: [
                {
                    message: "post not found",
                    field: "id",
                },
            ],
            resultCode: 1,
        });
    }
});
//Update existing post by id with InputModel
app.put("/api/posts/:postsId", (req, res) => {
    const id = +req.params.postsId;
    const post = posts.find((p) => p.id === id);
    let isValid = true;
    let trobblesOccured = [];
    if (!post) {
        isValid = false;
        res.status(404);
        res.send({
            data: {},
            errorsMessages: [
                {
                    message: "post not found",
                    field: "id",
                },
            ],
            resultCode: 0,
        });
        return;
    }
    if (!req.body.title) {
        isValid = false;
        trobblesOccured.push({
            message: "title required",
            field: "title",
        });
    }
    if (!req.body.shortDescription) {
        isValid = false;
        trobblesOccured.push({
            message: "shortDescription required",
            field: "shortDescription",
        });
    }
    if (!req.body.content) {
        isValid = false;
        trobblesOccured.push({
            message: "content required",
            field: "content",
        });
    }
    if (isValid) {
        post.title = req.body.title;
        post.shortDescription = req.body.shortDescription;
        post.content = req.body.content;
        res.status(200).send(post);
    }
    else {
        res.status(400);
        res.send({
            data: {},
            errorsMessages: trobblesOccured,
            resultCode: 1,
        });
    }
});
//Delete post specified by id
app.delete("/api/posts/:postId", (req, res) => {
    const id = +req.params.postId;
    const newPosts = posts.filter((p) => p.id != id);
    if (newPosts.length < posts.length) {
        posts = newPosts;
        res.send(204);
    }
    else {
        res.status(404);
        res.send({
            data: {},
            errorsMessages: [
                {
                    message: "post not found or post's id invalid",
                    field: "id",
                },
            ],
            resultCode: 1,
        });
    }
});
//Home
app.get("/*", (req, res) => {
    res.send({
        "/api/bloggers": "GET, POST",
        "/api/bloggers/:postId": "GET, PUT, DELETE",
        "/api/posts": "GET, POST",
        "/api/posts/:postId": "GET, PUT, DELETE",
    });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=mish.js.map