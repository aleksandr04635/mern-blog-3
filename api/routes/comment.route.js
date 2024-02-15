import express from "express";
import { connectDB, verifyToken, errorHandler } from "../utils/utils.js";

import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

const createComment = async (req, res, next) => {
  connectDB();
  try {
    console.log("req.body to newComment : ", req.body);
    const { content, postId, commentId, userId } = req.body;
    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }
    console.log("postId exist newComment : ", postId);
    let comObj;
    if (postId) {
      comObj = {
        content,
        post: postId,
        userId,
      };
    }
    if (commentId) {
      comObj = {
        content,
        commentto: commentId,
        userId,
      };
    }
    const newComment = new Comment(comObj);
    //console.log("newComment : ", newComment);
    const nc = await newComment.save();
    console.log("newComment : ", nc);
    //console.log("newComment post : ", nc.post._id.toString());

    // const commentedPost = await Post.findById(postId);
    //console.log("commentedPost : ", commentedPost);
    // commentedPost.comments.push(nc._id);
    // await commentedPost.save();
    //console.log("commentedPost2 : ", commentedPost);
    const sent2 = await nc.populate("userId", [
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

const getPostComments = async (req, res, next) => {
  connectDB();
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("userId", ["username", "_id", "profilePicture"])
      .sort({
        createdAt: -1,
      });
    // virtual WORKS
    //const post = await Post.findById(req.params.postId).populate("comments");
    //console.log("comments to commented Post from a virtual: ", post.comments);
    /*     const commentedPost = await Post.findById(req.params.postId)
      .populate({
        path: "comments",
        populate: { path: "userId", select: " -password" },
      })
      .sort({
        createdAt: -1,
      }); */
    //  .populate("userId", ["username", "_id", "profilePicture"]);
    //console.log("commentedPost : ", commentedPost);

    //console.log("commentedPost : ", commentedPost);
    //console.log("comIndexInPosts : ", comIndexInPosts);
    // commentedPost.comments.splice(comIndexInPosts, 1);
    //res.status(200).json({ comments, com2: commentedPost.comments });
    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

//for a comment tree a recursive function is needed
//which takes the _Id and returns a comment with a list of _Id's of comments to it, calling itself for each
const getCommentComments = async (req, res, next) => {
  connectDB();
  try {
    const comments = await Comment.find({ commentto: req.params.commentId })
      .populate("userId", ["username", "_id", "profilePicture"])
      .sort({
        createdAt: -1,
      });

    res.status(200).json({ comments });
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
        //n
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
        //n
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
        //n
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
        //n
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
    if (comment.userId._id.toString() !== req.user.id && !req.user.isAdmin) {
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
    if (comment.userId._id.toString() !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment")
      );
    }
    //console.log("comment to delete in deleteComment: ", comment);

    //comments to this comment
    const comments = await Comment.find({ commentto: req.params.commentId });
    console.log("comments to this comment in deleteComment: ", comments);
    if (comments.length !== 0) {
      //only edit comment
      /*       const editedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,        {          content: req.body.content,        },
        { new: true }
      ).populate("userId", ["username", "_id", "profilePicture"]);
      res.status(200).json(editedComment); */
      comment.deleted = true;
      comment.content =
        "This comment is deleted by its author and will be completely deleted then all the comments to it will be deleted";
      await comment.save();
      console.log("only edited a comment in deleteComment: ", comment);
      res.status(200).json("Comment has been set to be deleted");
      return;
    }

    //if this comment is to a comment and not to a post
    if (comment.commentto) {
      //comment to which this one is commented
      /*       console.log(
        "Id of comment to which this one is commented in deleteComment: ",
        comment.commentto.toString()
      ); */
      const commentTo = await Comment.findById(comment.commentto.toString());
      console.log("commentTo found in deleteComment: ", commentTo);
      if (commentTo.deleted) {
        console.log("commentTo has deleted status in deleteComment: ");
        const commentsTocommentTo = await Comment.find({
          commentto: comment.commentto.toString(),
        });
        console.log(
          "comments to a comment this comment is to in deleteComment: ",
          commentsTocommentTo
        );
        if (commentsTocommentTo.length < 2) {
          console.log(
            "deleting commentTo that has deleted status in deleteComment: "
          );
          //delete commentTo
          await Comment.findByIdAndDelete(comment.commentto.toString());
        }
      }
    }
    console.log("finally delete the comment in deleteComment: ");
    await Comment.findByIdAndDelete(req.params.commentId); //old

    /*     const commentedPost = await Post.findById(comment.post._id.toString());
    const comIndexInPosts = commentedPost.comments.indexOf(
      req.params.commentId
    ); */
    //console.log("commentedPost : ", commentedPost);
    //console.log("comIndexInPosts : ", comIndexInPosts);
    // commentedPost.comments.splice(comIndexInPosts, 1);
    // console.log("commentedPost : ", commentedPost);
    //await commentedPost.save();
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
router.get("/getCommentComments/:commentId", getCommentComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);
router.get("/getcomments", verifyToken, getcomments);

export default router;
