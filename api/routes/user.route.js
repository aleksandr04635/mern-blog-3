import express from "express";
import bcryptjs from "bcryptjs";
import { connectDB, verifyToken, errorHandler } from "../utils/utils.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { sendVerificationEmail } from "./auth.route.js";

const test = (req, res) => {
  res.json({ message: "API is working!" });
};

const updateUser = async (req, res, next) => {
  connectDB();
  //console.log("req.user from updateUser: ", req.user);
  console.log("req.body from updateUser: ", req.body);
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  let password2;
  if (req.body.hasOwnProperty("password") && req.body.password !== "") {
    /*     console.log("password is: ", req.body.password);
    console.log(
      "req.body.password.length from updateUser: ",
      req.body.password.length
    ); */
    if (req.body.password.length < 6) {
      // console.log("req.body.password.length < 6 ");
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    password2 = bcryptjs.hashSync(req.body.password, 10);
  }
  //console.log("password2: ", password2);
  if (req.body.password === "") {
    delete req.body.password;
  }
  if (req.body.hasOwnProperty("username")) {
    if (req.body.username.length < 6 || req.body.username.length > 25) {
      return next(
        errorHandler(400, "Username must be between 6 and 25 characters")
      );
    }
    /*     if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    } */
    //if (!req.body.username.match(/^[a-zA-Z0-9\_\-\ ]+$/)) {
    //console.log("req.body.username: ", req.body.username);
    if (!req.body.username.match(/^[a-zA-Z0-9\_\-\ \.\@]+$/)) {
      //console.log("NOT MATCH ");
      return next(
        errorHandler(
          400,
          "Username can only contain letters and numbers, -, _ and whitespace"
        )
      );
    }
  }
  try {
    const checkUser2 = await User.findOne({ username: req.body.username });
    if (checkUser2 && req.user.id != checkUser2._id.toString()) {
      return next(errorHandler(404, "Another user with this username exists."));
    }

    const oldUser = await User.findById(req.user.id);
    let changeEmail = false;
    if (req.body.hasOwnProperty("email") && req.body.email != oldUser.email) {
      console.log(
        "changing email from: ",
        oldUser.email,
        " to: ",
        req.body.email
      );
      changeEmail = true;
      sendVerificationEmail(oldUser._id.toString(), req);
      //("You changed your email and it is not now verified. Verification token was send to your email. Go there and click the verification link");
    }
    //console.log("req.body from updateUser2: ", req.body);
    //return next(errorHandler(404, "Stopgap"));
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          //email: oldUser.email,
          description: req.body.description,
          profilePicture: req.body.profilePicture,
          password: password2,
          isEmailVerified: changeEmail ? false : true,
        },
      },
      { new: true }
    );
    console.log("changeEmail from updateUser: ", changeEmail);
    console.log("updatedUser from updateUser: ", updatedUser);
    const { password, ...rest } = updatedUser._doc;
    if (changeEmail == false) {
      return res.status(200).json(rest);
    } else {
      return next(
        errorHandler(
          403,
          "You changed your email and it is now not verified. You better now check if it's really yours one now and if it's not change it to yours before logging out. Verification token was send to your new email. Go there and click the verification link"
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  connectDB();
  console.log("req.query from getUsers: ", req.query);
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 8;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find().sort({ createdAt: sortDirection }); // .skip(startIndex)      .limit(limit);

    const usersPopulated = [];
    for (const user of users) {
      /*  console.log("user from getUsers: ", user);
      console.log(
        "user._doc._id.toString() from getUsers: ",
        user._doc._id.toString()
      ); */
      const posts = await Post.find({
        userId: user._doc._id.toString(),
      }).countDocuments();
      //console.log("posts from getUsers: ", posts);
      const comments = await Comment.find({
        userId: user._doc._id.toString(),
      }).countDocuments();
      const { password, ...rest } = user._doc;
      usersPopulated.push({ ...rest, posts, comments });
    }
    //console.log("usersPopulated from getUsers: ", usersPopulated);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersPopulated,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  connectDB();
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  connectDB();
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    const deletedUser = await User.find({
      username: "Deleted User",
    }); //[0];
    //console.log("deletedUser from deleteUser: ", deletedUser);
    const posts = await Post.find({
      userId: req.params.userId,
    });
    //console.log("posts from deleteUser: ", posts);
    for (const post of posts) {
      post.userId = deletedUser[0]._id.toString();
      await post.save();
    }
    const comments = await Comment.find({
      userId: req.params.userId,
    });
    //console.log("comments from deleteUser: ", comments);
    for (const comment of comments) {
      comment.userId = deletedUser[0]._id.toString();
      await comment.save();
    }

    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, getUsers);
router.get("/:userId", getUser);

export default router;
