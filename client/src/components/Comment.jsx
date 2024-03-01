import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CommentSection from "./CommentSection";
import CommentingEditor from "./CommentingEditor";
import DateTime from "./DateTime";
import Likes from "./Likes";

export default function Comment({
  level,
  comment,
  onLike,
  onEdit,
  onDelete,
  idOfAncestorPostOrComment,
  reloadParentSection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [tocomment, setTocomment] = useState(false);
  const [reloadSwitch, setReloadSwitch] = useState(false);
  //It is changed from CommentingEditor to force a reload of a commentSection of this comment
  //console.log("level, comment in Comment.jsx: ", level, comment);
  //console.log("isEditing in Comment.jsx: ", isEditing);

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
              src={comment.userId.profilePicture}
              alt={comment.userId.username}
            />
          </div>
          <div className="flex flex-col grow">
            <div className="flex flex-col sm:flex-row justify-between px-2">
              <div className="font-bold  text-xs ">
                {comment.userId
                  ? `${comment.userId.username.split(" ").join("\u00A0")}`
                  : "anonymous user"}
              </div>
              <DateTime
                crTime={comment.createdAt}
                upTime={comment.updatedAt}
                variant={"comment"}
              />
            </div>
            {/*   Edit a comment */}
            {isEditing ? (
              <CommentingEditor
                level={level}
                idOfEditedComment={comment._id}
                idOfParentPostOrCommentOfEditedComment={
                  level == 1 ? comment.post : comment.commentto
                }
                initialContent={comment.content}
                mode={"edit"}
                onClose={() => {
                  setIsEditing(false);
                }}
                onEdit={(con) => handleSaveUponEditing(con)}
              />
            ) : (
              <div
                className="comment-content px-2 p-1 text-justify text-base mx-auto w-full 
                   rounded-lg bg-slate-50 dark:bg-slate-800"
                dangerouslySetInnerHTML={{
                  __html: comment && comment.content,
                }}
              ></div>
            )}
          </div>
        </div>
        {/*  Controls */}
        <div className="flex-1">
          <div className="flex items-center p-1 text-xs  dark:border-gray-700 max-w-fit gap-2">
            <Likes type={"comment"} comment={comment} onLike={onLike} />
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
                    onClick={() => setIsEditing(!isEditing)}
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
        {/*  Create a comment to this one */}
        {tocomment && (
          <CommentingEditor
            level={level + 1}
            idOfPostOrCommentWhichIsCommented={comment._id}
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
          idOfParentPostOrComment={comment._id}
          idOfAncestorPostOrComment={
            level == 1 ? comment.post : comment.commentto
          }
          reloadParentSection={() => {
            reloadParentSection();
          }}
        />
      </div>
    </div>
  );
}
