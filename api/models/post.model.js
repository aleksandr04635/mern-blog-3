import mongoose from "mongoose";

const Schema = mongoose.Schema;
const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    intro: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      /* default:
        "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png", */
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    importance: {
      type: Number,
      default: 1,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Array,
      default: [],
    },
    numberOfDislikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});
//const post = await Post.findOne().populate('comments');
//https://mongoosejs.com/docs/populate.html#deep-populate

const Post = mongoose.model("Post", postSchema);

export default Post;

//tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],

/* https://mongoosejs.com/docs/schematypes.html#arrays
const ToySchema = new Schema({ name: String });
const ToyBoxSchema = new Schema({
  toys: [ToySchema],
  buffers: [Buffer],
  strings: [String],
  numbers: [Number]
  // ... etc
});

Arrays are special because they implicitly have a default value of [] (empty array).

const ToyBox = mongoose.model('ToyBox', ToyBoxSchema);
console.log((new ToyBox()).toys); // []

To overwrite this default, you need to set the default value to undefined

const ToyBoxSchema = new Schema({
  toys: {
    type: [ToySchema],
    default: undefined
  }
}); */
