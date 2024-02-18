import express from "express";
import { connectDB, errorHandler, verifyToken } from "../utils/utils.js";
import Post from "../models/post.model.js";

const create = async (req, res, next) => {
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
  try {
    connectDB();
    if (req.headers.referer.indexOf("dashboard?tab=posts") != -1) {
      console.log("from dashboard to getposts:");
    }
    console.log("req.query from getposts:", req.query);
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const pageSize =
      parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
    const pageFromQuerry = parseInt(req.query.page);
    //console.log("pageSize:", pageSize);
    //console.log("pageFromQuerry:", pageFromQuerry);
    //console.log("sortDirection:", sortDirection);

    if (req.query.slug || req.query.postId) {
      console.log("from getposts only one document:");
      const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }), // if query has userId then search for { userId: req.query.userId }
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }), // if query has postId then search for specific _id in the DB
        ...(req.query.tag && { "tags.slug": req.query.tag }), // my, searches by tags.slug
        // if query has searchTerm
        ...(req.query.searchTerm && {
          $or: [
            //searches in title or in content for req.query.searchTerm
            { title: { $regex: req.query.searchTerm, $options: "i" } },
            { content: { $regex: req.query.searchTerm, $options: "i" } },
          ],
        }),
      })
        .sort({ createdAt: sortDirection })
        .populate("userId", ["username", "_id", "profilePicture"]);
      res.status(200).json({ posts });
      return;
    }

    const totalPosts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }), // if query has userId then search for { userId: req.query.userId }
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }), // if query has postId then search for specific _id in the DB
      ...(req.query.tag && { "tags.slug": req.query.tag }), // my, searches by tags.slug
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
        "no page querried to totalPosts. pageFromQuerry:",
        pageFromQuerry
      );
      page = totalPages;
    } else {
      console.log(
        "a page querried to totalPosts. pageFromQuerry:",
        pageFromQuerry
      );
      page = pageFromQuerry;
    }
    console.log("page from getposts:", page);

    if (page > totalPages || page < 0) {
      return next(
        errorHandler(400, `The page number ${page} isn't in the correct range`)
      );
    }
    if (pageSize < 0) {
      return next(errorHandler(400, `The pageSize is wrong`));
    }

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
      ...(req.query.tag && { "tags.slug": req.query.tag }), // my, searches by tags.slug
      // if query has searchTerm
      ...(req.query.searchTerm && {
        $or: [
          //searches in title or in content for req.query.searchTerm
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(lim)
      .populate("userId", ["username", "_id", "profilePicture"]);
    //console.log("posts from getposts: ", posts);

    res.status(200).json({
      totalPosts,
      pageSize,
      totalPages,
      page,
      skip,
      lim,
      sortDirection,
      posts,
    });
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
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          tags: req.body.tags,
          intro: req.body.intro,
          importance: req.body.importance,
          slug,
          image: req.body.image,
        },
      },
      { new: true } //returns a new post and not old as by default
    );
    res.status(200).json(updatedPost);
    //console.log("updatedPost: ", updatedPost);
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

const countTags = async (req, res, next) => {
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
    // console.log("tagData", tagData);
    res.status(200).json(tagData);
  } catch (error) {
    next(error);
  }
};

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);
router.put("/likePost/:postId", verifyToken, likePost);
router.get("/counttags", countTags);

export default router;
