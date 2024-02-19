import {
  Alert,
  Button,
  Modal,
  TextInput,
  Textarea,
  Spinner,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import TinyMCEEditor from "../components/TinyMCEEditor";

export default function CommentingEditor({
  initialContent,
  mode,
  commandReload,
  toPost,
  postId,
  onEdit,
  onClose,
}) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState(initialContent || "");
  const [commentError, setCommentError] = useState(null);

  //console.log("content in CommentingEditor.jsx", comment);
  // const [comments, setComments] = useState([]);
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 400) {
      return;
    }
    if (mode == "edit") {
      console.log("called to edit from CommentingEditor.jsx", comment);
      onEdit(comment);
      onClose();
      return;
    }
    try {
      const reqO = toPost
        ? {
            content: comment,
            postId,
            userId: currentUser._id,
          }
        : {
            content: comment,
            commentId: postId,
            userId: currentUser._id,
          };
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqO),
      });
      //const data = await res.json();
      if (res.ok) {
        setComment("");
        onClose();
        setCommentError(null);
        console.log(
          ` giving command to comment section to REFETCH comments from editor from: `,
          postId
        );
        commandReload();
        //setComments([data, ...comments]);
      } else {
        const rese = await res.json();
        console.log("error of fetching com creat: ", rese);
        setCommentError(rese.message);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  return (
    <div className="w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>You are signed in as: </p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            {currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className=" border border-teal-500 rounded-md p-3"
        >
          <TinyMCEEditor
            value2={comment}
            onChange={(value3) => {
              setComment(value3);
            }}
          />
          {/*           <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          /> */}
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {400 - comment.length ?? 0} characters remaining
            </p>
            <div className="flex justify-between gap-2">
              <Button gradientDuoTone="purpleToBlue" type="submit">
                {mode == "edit" ? "Edit" : "Comment"}
              </Button>{" "}
              <Button
                onClick={onClose}
                outline
                gradientDuoTone="purpleToBlue"
                type="submit"
              >
                Cancel
              </Button>
            </div>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
    </div>
  );
}
