import express from "express";
import { connectDB, errorHandler, verifyToken } from "../utils/utils.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Tag from "../models/tag.model.js";

const create = async (req, res, next) => {
  try {
    console.log("req.body from create:", req.body);
    connectDB();
    /*   if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  } */
    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "Please provide all required fields"));
    }
    const slug = req.body.title
      .replace(/[^a-z\-A-Z0-9-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .join("-")
      .toLowerCase(); //remove anything except of letters or numbers
    const { tags, ...rest } = req.body;
    const tagIds = [];
    for (const tag of tags) {
      //console.log("tag from req.body from create:", tag);
      const num = await Tag.find({ slug: tag.slug }).countDocuments();
      const foundTag = await Tag.find({ slug: tag.slug });
      //console.log("found occurences of a tag from req.body from create:", num);
      if (num == 0) {
        const newTag = new Tag({
          slug: tag.slug,
          name: tag.name,
          number_of_posts: 1,
        });
        await newTag.save();
        //console.log("newTag from create:", newTag);
        tagIds.push(newTag._id);
      } else {
        //console.log("foundTag[0] from create:", foundTag[0]);
        tagIds.push(foundTag[0]._id);
        foundTag[0].number_of_posts++;
        await foundTag[0].save();
        //console.log(" tagIds from create:", tagIds);
      }
    }
    //console.log(" tagIds from create3:", tagIds);
    const newPost = new Post({
      ...rest,
      slug,
      userId: req.user.id,
      tags: tagIds,
    });
    console.log("newPost before save from create:", newPost);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

const getposts = async (req, res, next) => {
  try {
    connectDB();
    if (req.headers.referer.indexOf("dashboard?tab=posts") != -1) {
      console.log("from dashboard to getposts:");
    }
    console.log("req.query from getposts:", req.query);
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const sortObj = !!req.query.userId
      ? { importance: -1, createdAt: sortDirection }
      : { createdAt: sortDirection };
    //console.log("sortObj from getposts:", sortObj);
    const pageSize =
      parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
    if (pageSize < 0) {
      return next(errorHandler(400, `The pageSize is wrong`));
    }
    const pageFromQuerry = parseInt(req.query.page);
    //console.log("pageSize:", pageSize);
    //console.log("pageFromQuerry:", pageFromQuerry);
    //console.log("sortDirection:", sortDirection);
    let tagId = 0;
    if (req.query.tag) {
      const foundTag = await Tag.find({ slug: req.query.tag });
      console.log("foundTag from getposts:", foundTag);
      tagId = foundTag[0]._id;
      console.log("tagIg from getposts:", tagId);
    }

    if (req.query.slug || req.query.postId) {
      console.log("from getposts only one document:");
      const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }), // if query has userId then search for { userId: req.query.userId }
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }), // if query has postId then search for specific _id in the DB
        ...(req.query.tag && { tags: tagId }), // my, searches by tags.slug//REDO  ...(req.query.tag && { "tags.slug": req.query.tag })
        // if query has searchTerm
        ...(req.query.searchTerm && {
          $or: [
            //searches in title or in content for req.query.searchTerm
            { title: { $regex: req.query.searchTerm, $options: "i" } },
            { content: { $regex: req.query.searchTerm, $options: "i" } },
          ],
        }),
      })
        .populate("tags")
        .populate("userId", ["username", "_id", "profilePicture"]);
      res.status(200).json({ posts });
      return;
    }

    const totalPosts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }), // if query has userId then search for { userId: req.query.userId }
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }), // if query has postId then search for specific _id in the DB
      ...(req.query.tag && { tags: tagId }), // my, searches by tags.slug  ...(req.query.tag && { "tags.slug": req.query.tag })
      // if query has searchTerm
      ...(req.query.searchTerm && {
        $or: [
          //searches in title or in content for req.query.searchTerm
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    }).countDocuments();
    console.log("totalPosts from getposts:", totalPosts);

    const totalPages = Math.floor(totalPosts / pageSize) || 1;
    console.log("totalPages from getposts:", totalPages);

    let page;
    if (!pageFromQuerry) {
      console.log(
        "no page was querried to totalPosts. pageFromQuerry:",
        pageFromQuerry
      );
      page = totalPages;
    } else {
      console.log(
        "a page was querried to totalPosts. pageFromQuerry:",
        pageFromQuerry
      );
      page = pageFromQuerry;
    }
    if (page > totalPages || page < 1) {
      /*      return next(
        errorHandler(400, `The page number ${page} isn't in the correct range`)
      ); */
      page = totalPages;
    }
    //console.log("page from getposts:", page);

    const numOnTopPage = pageSize + (totalPosts % pageSize);
    //console.log("numOnTopPage from getposts:", numOnTopPage);
    const skip =
      page == totalPages
        ? 0
        : (totalPages - page - 1) * pageSize + numOnTopPage;
    //console.log("skip from getposts:", skip);
    const lim = page == totalPages ? numOnTopPage : pageSize;
    //console.log("lim from getposts:", lim);

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }), // if query has userId then search for { userId: req.query.userId }
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }), // if query has postId then search for specific _id in the DB
      ...(req.query.tag && { tags: tagId }), // my, searches by tags.slug  ...(req.query.tag && { "tags.slug": req.query.tag })
      // if query has searchTerm
      ...(req.query.searchTerm && {
        $or: [
          //searches in title or in content for req.query.searchTerm
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort(sortObj)
      .skip(skip)
      .limit(lim)
      .populate("tags")
      .populate("userId", ["username", "_id", "profilePicture"]);
    //console.log("posts from getposts: ", posts);

    const resObj = {
      totalPosts,
      pageSize,
      totalPages,
      page,
      skip,
      lim,
      sortDirection,
      posts,
    };
    if (req.query.userId) {
      const user = await User.findById(req.query.userId);
      const { password, ...rest } = user._doc;
      resObj.user = rest;
    }
    res.status(200).json(resObj);
  } catch (error) {
    next(error);
  }
};
//res.status(200).json({ totalPosts, page: 0 });

const deletepost = async (req, res, next) => {
  connectDB();
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    console.log(" deletepost: ", req.params.postId);
    const post1 = await Post.findById(req.params.postId);
    //console.log(" updatedPost1 from updatepost:", updatedPost1);
    if (post1.tags && post1.tags?.length > 0) {
      for (const tag of post1.tags) {
        const foundTag = await Tag.findById(tag._id);
        foundTag.number_of_posts--;
        await foundTag.save();
      }
    }

    await Post.findByIdAndDelete(req.params.postId);
    console.log(" The post has been deleted");
    res.status(200).json("The post has been deleted");
  } catch (error) {
    console.log(" The post has not been deleted - error");
    next(error);
  }
};

const updatepost = async (req, res, next) => {
  connectDB();
  //console.log("req.body: ", req.body);
  /*   console.log("req.user.id: ", req.user.id);
  console.log("req.params.userId: ", req.params.userId);
  console.log("!req.user.isAdmin: ", !req.user.isAdmin); */
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    //console.log("not passed");
    return next(errorHandler(403, "You are not allowed to update this post"));
  }
  try {
    const slug = req.body.title
      .replace(/[^a-z\-A-Z0-9-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .join("-")
      .toLowerCase(); //remove anything except of letters or numbers//remove anything except of letters or numbers
    /*   const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  }); */
    const updatedPost1 = await Post.findById(req.params.postId);
    console.log(" updatedPost1 from updatepost:", updatedPost1);
    if (updatedPost1.tags && updatedPost1.tags?.length > 0) {
      for (const tag of updatedPost1.tags) {
        const foundTag = await Tag.findById(tag._id);
        foundTag.number_of_posts--;
        await foundTag.save();
      }
    }
    const { tags, ...rest } = req.body;
    //console.log("tags from req.body from updatepost:", tags);
    const tagIds = [];
    for (const tag of tags) {
      //console.log("tag from req.body from create:", tag);
      const num = await Tag.find({ slug: tag.slug }).countDocuments();
      const foundTag = await Tag.find({ slug: tag.slug });
      //console.log("found occurences of a tag from req.body from create:", num);
      if (foundTag.length == 0) {
        //num
        const newTag = new Tag({
          slug: tag.slug,
          name: tag.name,
          number_of_posts: 1,
        });
        await newTag.save();
        //console.log("newTag from create:", newTag);
        tagIds.push(newTag._id);
      } else {
        //console.log("foundTag[0] from create:", foundTag[0]);
        tagIds.push(foundTag[0]._id);
        foundTag[0].number_of_posts++;
        await foundTag[0].save();
        //console.log(" tagIds from create:", tagIds);
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          tags: tagIds,
          intro: req.body.intro,
          importance: req.body.importance,
          slug,
          image: req.body.image,
        },
      },
      { new: true } //returns a new post and not old as by default
    );
    res.status(200).json(updatedPost);
    console.log("updatedPost: ", updatedPost);
  } catch (error) {
    next(error);
  }
};

const likePost = async (req, res, next) => {
  connectDB();
  const type = req.body.type;
  const action = req.body.action;
  //console.log("type, action from likePost: ", type, action);
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }
    //excessive clauses are present here, but they can be useful in case of some changes
    if (type == "l" && action == "+") {
      const userIndexInLikes = post.likes.indexOf(req.user.id);
      if (userIndexInLikes === -1) {
        post.numberOfLikes += 1;
        post.likes.push(req.user.id);
      } else {
        //nw
        post.numberOfLikes -= 1;
        post.likes.splice(userIndexInLikes, 1);
      }
      const userIndexInDislikes = post.dislikes.indexOf(req.user.id);
      if (userIndexInDislikes !== -1) {
        post.numberOfDislikes -= 1;
        post.dislikes.splice(userIndexInDislikes, 1);
      }
    }
    if (type == "l" && action == "-") {
      const userIndex = post.likes.indexOf(req.user.id);
      if (userIndex === -1) {
        //nw
        post.numberOfLikes += 1;
        post.likes.push(req.user.id);
      } else {
        post.numberOfLikes -= 1;
        post.likes.splice(userIndex, 1);
      }
    }
    if (type == "d" && action == "+") {
      const userIndexInDislikes = post.dislikes.indexOf(req.user.id);
      if (userIndexInDislikes === -1) {
        post.numberOfDislikes += 1;
        post.dislikes.push(req.user.id);
      } else {
        //nw
        post.numberOfDislikes -= 1;
        post.dislikes.splice(userIndexInDislikes, 1);
      }
      const userIndexInLikes = post.likes.indexOf(req.user.id);
      if (userIndexInLikes !== -1) {
        post.numberOfLikes -= 1;
        post.likes.splice(userIndexInLikes, 1);
      }
    }
    if (type == "d" && action == "-") {
      const userIndexInDislikes = post.dislikes.indexOf(req.user.id);
      if (userIndexInDislikes === -1) {
        //nw
        post.numberOfDislikes += 1;
        post.dislikes.push(req.user.id);
      } else {
        post.numberOfDislikes -= 1;
        post.dislikes.splice(userIndexInDislikes, 1);
      }
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

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

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);
router.put("/likePost/:postId", verifyToken, likePost);
//router.get("/counttags", countTags);

export default router;
