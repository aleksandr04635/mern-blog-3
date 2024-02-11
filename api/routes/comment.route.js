import express from "express";
import { connectDB, verifyToken } from "../utils/utils.js";

import Comment from "../models/comment.model.js";

const createComment = async (req, res, next) => {
  connectDB();
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }

    const newComment = new Comment({
      content,
      post: postId,
      userId,
    });
    //console.log("newComment : ", newComment);
    //await newComment.save();
    const sent = await newComment.save();
    const sent2 = await sent.populate("userId", [
      "username",
      "_id",
      "profilePicture",
    ]);
    //console.log("sent2 : ", sent2);
    //res.status(200).json(newComment);
    res.status(200).json(sent2);
  } catch (error) {
    next(error);
  }
};

//for a comment tree a recursive function is needed
//which takes the _Id and returns a comment with a list of _Id's of comments to it, calling itself for each
const getPostComments = async (req, res, next) => {
  connectDB();
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("userId", ["username", "_id", "profilePicture"])
      .sort({
        createdAt: -1,
      });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

const likeComment = async (req, res, next) => {
  connectDB();
  const type = req.body.type;
  const action = req.body.action;
  //console.log("type, action : ", type, action);
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    //excessive clauses are present here, but they can be useful in case of some changes
    if (type == "l" && action == "+") {
      const userIndexInLikes = comment.likes.indexOf(req.user.id);
      if (userIndexInLikes === -1) {
        comment.numberOfLikes += 1;
        comment.likes.push(req.user.id);
      } else {
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndexInLikes, 1);
      }
      const userIndexInDislikes = comment.dislikes.indexOf(req.user.id);
      if (userIndexInDislikes !== -1) {
        comment.numberOfDislikes -= 1;
        comment.dislikes.splice(userIndexInDislikes, 1);
      }
    }
    if (type == "l" && action == "-") {
      const userIndex = comment.likes.indexOf(req.user.id);
      if (userIndex === -1) {
        comment.numberOfLikes += 1;
        comment.likes.push(req.user.id);
      } else {
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndex, 1);
      }
    }
    if (type == "d" && action == "+") {
      const userIndexInDislikes = comment.dislikes.indexOf(req.user.id);
      if (userIndexInDislikes === -1) {
        comment.numberOfDislikes += 1;
        comment.dislikes.push(req.user.id);
      } else {
        comment.numberOfDislikes -= 1;
        comment.dislikes.splice(userIndexInDislikes, 1);
      }
      const userIndexInLikes = comment.likes.indexOf(req.user.id);
      if (userIndexInLikes !== -1) {
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndexInLikes, 1);
      }
    }
    if (type == "d" && action == "-") {
      const userIndexInDislikes = comment.dislikes.indexOf(req.user.id);
      if (userIndexInDislikes === -1) {
        comment.numberOfDislikes += 1;
        comment.dislikes.push(req.user.id);
      } else {
        comment.numberOfDislikes -= 1;
        comment.dislikes.splice(userIndexInDislikes, 1);
      }
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

const editComment = async (req, res, next) => {
  connectDB();
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    ).populate("userId", ["username", "_id", "profilePicture"]);
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  connectDB();
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment")
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment has been deleted");
  } catch (error) {
    next(error);
  }
};

const getcomments = async (req, res, next) => {
  connectDB();
  if (!req.user.isAdmin)
    return next(errorHandler(403, "You are not allowed to get all comments"));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};

const router = express.Router();
router.post("/create", verifyToken, createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);
router.get("/getcomments", verifyToken, getcomments);

export default router;
