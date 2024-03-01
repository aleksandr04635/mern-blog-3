import { Alert, Button, TextInput, Textarea, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import TinyMCEEditor from "../components/TinyMCEEditor";
import { useCreateCommentMutation } from "../redux/comment/commentApiSlice";

export default function CommentingEditor({
  initialContent,
  mode,
  commandReload,
  level,
  idOfParentPostOrComment,
  idOfAncestorPostOrComment, //should be reloaded in edit mode
  onEdit,
  onClose,
}) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState(initialContent || "");
  const [commentError, setCommentError] = useState(null);

  const [createComment, createCommentMutationResult] =
    useCreateCommentMutation();

  //console.log("content in CommentingEditor.jsx", comment);
  // const [comments, setComments] = useState([]);
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 600) {
      return;
    }
    if (mode == "edit") {
      console.log("called to edit from CommentingEditor.jsx", comment);
      onEdit(comment);
      onClose();
      return;
    }
    //if (mode == "create")
    try {
      const resm = await createComment({
        level,
        idOfParentPostOrComment,
        content: comment,
      }).unwrap();
      console.log("resm in CommentingEditor.jsx", resm);
      /*       const reqO = toPost
        ? {
            content: comment,
            postId: idOfParentPostOrComment,
            // userId: currentUser._id,
          }
        : {
            content: comment,
            commentId: idOfParentPostOrComment,
            // userId: currentUser._id,
          }; */
      /*      console.log(" reqO in CommentingEditor.jsx", reqO);
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqO),
      });
      console.log(" res in CommentingEditor.jsx", res); */
      //const data = await res.json();
      // if (resm.ok) {
      setComment("");
      onClose();
      setCommentError(null);
      console.log(
        ` giving command to comment section to REFETCH comments from commentingEditor from: ${
          level == 1 ? "post" : "comment"
        }`,
        idOfParentPostOrComment
      );
      commandReload();
      //setComments([data, ...comments]);
      /*   } else {
        const rese = await resm.json();
        console.log("error of fetching com creat: ", rese);
        setCommentError(rese.message);
      } */
    } catch (err) {
      const errMsg =
        "message" in err
          ? err.message
          : "error" in err
          ? err.error
          : JSON.stringify(err.data);
      console.log(errMsg);
      setCommentError(errMsg);
      //setCommentError(error.message);
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
            toCom={true}
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
              {600 - comment.length ?? 0} characters remaining
            </p>
            <div className="flex justify-between gap-2">
              <Button gradientDuoTone="purpleToBlue" type="submit">
                {mode == "edit" ? "Edit" : "Comment"}
              </Button>{" "}
              <Button
                onClick={onClose}
                outline
                gradientDuoTone="purpleToBlue"
                type="button"
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
