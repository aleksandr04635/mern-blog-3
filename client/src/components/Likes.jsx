import moment from "moment";
import { formatISO9075 } from "date-fns";
import { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import CommentSection from "./CommentSection";
import CommentingEditor from "./CommentingEditor";
import DateTime from "./DateTime";
import Tooltip from "./Tooltip";

export default function Likes({ type, comment, onLike = () => {} }) {
  const [isEditing, setIsEditing] = useState(false);
  console.log("isEditing in Comment.jsx: ", isEditing);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);
  const [tocomment, setTocomment] = useState(false);
  const [reloadSwitch, setReloadSwitch] = useState(false);
  //It is changed from CommentingEditor to force a reload of a commentSection of this comment

  return (
    <Tooltip
      message={
        type == "card"
          ? "You can upvote a post only after reading it"
          : !currentUser
          ? "You can upvote only being signed in"
          : ""
      }
      style="warning"
      position="bottom"
    >
      <div
        className={`
    dark:border-gray-700 flex items-center 
    gap-2 ${
      type == "post"
        ? "h-[50px] w-full p-2 text-lg"
        : type == "card"
        ? "text-sm"
        : "p-1 text-xs max-w-fit"
    }`}
      >
        <button
          type="button"
          disabled={!currentUser || type == "card"}
          onClick={() =>
            onLike(
              comment._id,
              "l",
              comment.likes.includes(currentUser._id) ? "-" : "+"
            )
          }
          className={`text-gray-400 hover:text-blue-500 ${
            currentUser &&
            comment.likes.includes(currentUser._id) &&
            "!text-blue-500"
          }`}
        >
          <FaThumbsUp className="text-sm" />
        </button>
        <p className="text-gray-400">
          {comment.numberOfLikes > 0 &&
            comment.numberOfLikes +
              " " +
              (comment.numberOfLikes === 1 ? "like" : "likes")}
        </p>
        <button
          type="button"
          disabled={!currentUser || type == "card"}
          onClick={() =>
            onLike(
              comment._id,
              "d",
              comment.dislikes.includes(currentUser._id) ? "-" : "+"
            )
          }
          className={`text-gray-400 hover:text-blue-500 ${
            currentUser &&
            comment.dislikes.includes(currentUser._id) &&
            "!text-blue-500"
          }`}
        >
          <FaThumbsDown className="text-sm" />
        </button>
        <p className="text-gray-400">
          {comment.numberOfDislikes > 0 &&
            comment.numberOfDislikes +
              " " +
              (comment.numberOfDislikes === 1 ? "dislike" : "dislikes")}
        </p>
      </div>
    </Tooltip>
  );
}
