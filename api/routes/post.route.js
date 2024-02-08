import express from "express";
import { connectDB, errorHandler, verifyToken } from "../utils/utils.js";
import Post from "../models/post.model.js";

const create = async (req, res, next) => {
  connectDB();
  /*   if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  } */
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-z\-A-Z0-9-]/g, ""); //remove anything except of letters or numbers
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

const getposts = async (req, res, next) => {
  connectDB();
  try {
    const startIndex = parseInt(req.query.startIndex) || 0; //by default starts from 0
    const limit = parseInt(req.query.limit) || 9; //by default takes 9
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }), // if query has userId then search for { userId: req.query.userId }
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }), // if query has postId then search for specific _id in the DB
      // if query has searchTerm
      ...(req.query.searchTerm && {
        $or: [
          //searches in title or in content for req.query.searchTerm
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(); // post or Post?

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

const deletepost = async (req, res, next) => {
  connectDB();
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

const updatepost = async (req, res, next) => {
  connectDB();
  /*   console.log("req.user.id: ", req.user.id);
  console.log("req.params.userId: ", req.params.userId);
  console.log(
    "req.user.id !== req.params.userId: ",
    req.user.id == req.params.userId
  );
  console.log("!req.user.isAdmin: ", !req.user.isAdmin); */
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    //console.log("not passed");
    return next(errorHandler(403, "You are not allowed to update this post"));
  }
  try {
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-z\-A-Z0-9-]/g, ""); //remove anything except of letters or numbers
    /*   const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  }); */
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          slug,
          image: req.body.image,
        },
      },
      { new: true } //returns a new post and not old as by default
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);

export default router;
