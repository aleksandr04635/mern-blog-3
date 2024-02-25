import express from "express";
import { connectDB, errorHandler, verifyToken } from "../utils/utils.js";
import Tag from "../models/tag.model.js";

import Post from "../models/post.model.js";
import User from "../models/user.model.js";

/* const countTags = async (req, res, next) => {
  //console.log("called countTags :");
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
          tagData.push({ name: tag.name, slug: tag.slug, count: 1 });
        }
      });
    });
    tagData.sort((a, b) => b.count - a.count);
    //console.log("tagData", tagData);
    res.status(200).json(tagData);
  } catch (error) {
    next(error);
  }
}; */

const getAllTags = async (req, res, next) => {
  //console.log("getAllTags querried");
  connectDB();
  try {
    const tags = await Tag.find({ number_of_posts: { $gte: 1 } }).sort({
      number_of_posts: -1,
    });
    res.status(200).json({ tags });
  } catch (error) {
    next(error);
  }
};

/* const createTag = async (req, res, next) => {
  console.log("req.body from createTag:", req.body);
  connectDB();
  try {

    if (!req.body.name || !req.body.slug) {
      return next(errorHandler(400, "Please provide all required fields"));
    }
        const newTag = new Tag({
      ...req.body,
    });
    const savedTag = await newTag.save();
    res.status(201).json({ tag: savedTag });
  } catch (error) {
    next(error);
  }
}; */

const router = express.Router();
router.get("/get-all-tags", getAllTags);
router.post("/create-tag", verifyToken, createTag);

export default router;
