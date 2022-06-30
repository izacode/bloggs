import { MongoClient } from "mongodb";
import { settings } from "../settings/settings";
import { BloggerType, CommentType, PostType, UserType, UserAccountDBType, AttemptType } from "../types/types";
import mongoose from "mongoose";

// const mongoUri = process.env.mongoURI || "mongodb://localhost:27017";
// const mongoUri = "mongodb://localhost:27017";
const mongoUri = "mongodb+srv://thug:test1234@clusterblogg.gub0i.mongodb.net";
// const mongoUri = `mongodb+srv://thug:${settings.MONGO_PASSWORD}@clusterblogg.gub0i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// const client = new MongoClient(mongoUri);
// export let db = client.db("bloggz");
// export const postsCollection = db.collection<PostType>("posts");
// export const bloggersCollection = db.collection<BloggerType>("bloggers");
// export const usersCollection = db.collection<UserType>("users");
// export const commentsCollection = db.collection<CommentType>("comments");
// export const usersAccountCollection = db.collection<UserAccountDBType>("usersAccount");
// export const registrationIpCollection = db.collection<AttemptType>("ips");

// =======================Connection to MongoDB via Mongoose====================================

export async function runDb() {
  try {
    await mongoose.connect(mongoUri + "/" + "bloggz");
    console.log("Connected successfully to MongoDB via Mongoose");
  } catch {
    console.log(`Failed to connect to DB`);
  }
}

// =======================Connection to MongoDB directly=========================================

// export async function runDb() {
//   try {
//     // Connect the client to the server
//     await client.connect();
//     // Establish and verify connection
//     await client.db("bloggz").command({ ping: 1 });
//     console.log("Connected successfully to mongo server");
//   } catch {
//     // Ensures that the client will close when you  finish/error
//     await client.close();
//   }
// }

// new MongoClient(mongoUri).db("bloggz").collection<BloggerType>("bloggers");
