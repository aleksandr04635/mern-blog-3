import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import tagRoutes from "./routes/tag.route.js";
import commentRoutes from "./routes/comment.route.js";
import imageRoutes from "./routes/image.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import bcryptjs from "bcryptjs";

import dotenv from "dotenv";
dotenv.config();

//console.log(bcryptjs.hashSync("", 10));

//console.log(!!undefined);
/* const totalPosts = 6;
const pageSize = 3;
let totalPages = Math.floor(totalPosts / pageSize) || 1;
console.log("totalPages :", totalPages); */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      "database is connected successfully to " + process.env.MONGO_URL
    );
  } catch (err) {
    console.log(err);
  }
};
//connectDB();//for vercel deploy

/* import Post from "./models/post.model.js";
const countTags = async (req, res) => {
  connectDB();
  try {
    const posts = await Post.find();
    const tagData = [];
    posts.forEach((p) => {
      p.tags.forEach((tag) => {
        let found = false;
        tagData.forEach((td) => {
          if (td.slug == tag.slug) {
            td.count++;
            found = true;
          }
        });
        if (found == false) {
          tagData.push({ slug: tag.slug, count: 1 });
        }
      });
    });
    tagData.sort((a, b) => b.count - a.count);
    console.log("tagData", tagData);
    //res.status(200).json("The post has been deleted");
  } catch (error) {
    console.log(error);
  }
};
countTags();
 */
/* mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  }); */

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/api/test", (req, res) => {
  res.json({ message: "API works" });
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/tag", tagRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/image", imageRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port " + process.env.PORT || 3000);
});
