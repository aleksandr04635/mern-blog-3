import mongoose from "mongoose";
const Schema = mongoose.Schema;
const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    commentto: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
//const User = mongoose.models.user || mongoose.model("user", userSchema)
export default Comment;
