import moment from "moment";
import { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import CommentSection from "./CommentSection";
import CommentingEditor from "./CommentingEditor";

export default function Comment({
  level,
  comment,
  onLike,
  onEdit,
  onDelete,
  reloadParentSection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);
  const [tocomment, setTocomment] = useState(false);
  const [reloadSwitch, setReloadSwitch] = useState(false); //is changed to force a reload of a commentSection of this comment
  //console.log("comment: ", comment);
  //console.log("level  from Comment.jsx:", level);

  const handleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
      setEditedContent(comment.content);
    } else {
      setIsEditing(false);
    }
  };

  const handleSaveUponEditing = async (content) => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, content);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    /*  <div className="flex p-4 border-b dark:border-gray-600 text-sm"></div> */
    <div
      className={` flex flex-col w-full pt-2 pl-1 sm:pl-2 pb-0 pr-0  border-b  rounded-bl-lg ${
        level % 2 == 0 ? `border-purple-500` : `border-teal-500`
      }`}
    >
      <div>
        <div className="flex flex-row">
          <div className="flex-shrink-0 ">
            <img
              className="w-10 h-10 rounded-full object-cover bg-gray-200"
              /*           src={user.profilePicture}
          alt={user.username} */
              src={comment.userId.profilePicture}
              alt={comment.userId.username}
            />
          </div>
          <div className="flex flex-col grow">
            <div className="flex flex-row justify-between px-2">
              <div className="font-bold  text-xs ">
                {/*     {user ? `${user.username}` : "anonymous user"} */}
                {comment.userId
                  ? `${comment.userId.username}`
                  : "anonymous user"}
              </div>
              <div className="text-gray-500 text-xs">
                {moment(comment.createdAt).fromNow()}
              </div>
            </div>
            {isEditing ? (
              <CommentingEditor
                toPost={false}
                postId={comment._id}
                initialContent={comment.content}
                mode={"edit"}
                onClose={() => {
                  setIsEditing(false);
                }}
                onEdit={(con) => handleSaveUponEditing(con)}
              />
            ) : (
              <>
                {/*  <p className=" text-justify px-2 p-1">{comment.content}</p> */}
                <div
                  className="comment-content px-2 p-1 text-justify text-base mx-auto w-full 
                   rounded-lg bg-slate-50 dark:bg-slate-800"
                  dangerouslySetInnerHTML={{
                    __html: comment && comment.content,
                  }}
                ></div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1">
          {/*  Controls */}
          {/* <div className="flex items-center border-l p-1 text-xs border-t dark:border-gray-700 max-w-fit gap-2"> */}
          <div className="flex items-center p-1 text-xs  dark:border-gray-700 max-w-fit gap-2">
            <button
              type="button"
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
            {currentUser && (
              <>
                <button
                  type="button"
                  onClick={() => setTocomment(!tocomment)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  {tocomment ? "Cancel" : "Comment"}
                </button>
              </>
            )}
            {currentUser &&
              (currentUser._id === comment.userId._id ||
                currentUser.isAdmin) && (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(comment._id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
      <div>
        {tocomment && (
          <CommentingEditor
            toPost={false}
            postId={comment._id}
            mode={"create"}
            commandReload={() => {
              setReloadSwitch(!reloadSwitch);
            }}
            onClose={() => {
              setTocomment(false);
            }}
          />
        )}
        <CommentSection
          level={level + 1}
          reloadSwitch={reloadSwitch}
          key={comment._id}
          toPost={false}
          postId={comment._id}
          reloadParentSection={() => {
            reloadParentSection();
          }}
        />
      </div>
    </div>
  );
}
