import { Alert, Button, TextInput, Textarea, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import TinyMCEEditor from "../components/TinyMCEEditor";
import {
  useCreateCommentMutation,
  useUpdateCommentMutation,
} from "../redux/comment/commentApiSlice";

export default function CommentingEditor({
  initialContent,
  mode,
  //commandReload,
  level,
  idOfEditedComment,
  idOfPostOrCommentWhichIsCommented,
  idOfParentPostOrCommentOfEditedComment, //should be reloaded in edit mode
  //onEdit,
  onClose,
}) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState(initialContent || "");
  const [commentError, setCommentError] = useState(null);

  const [createComment, createCommentMutationResult] =
    useCreateCommentMutation();
  const [updateComment, updateCommentMutationResult] =
    useUpdateCommentMutation();
  //console.log("commentError in CommentingEditor.jsx", commentError);
  //console.log("content in CommentingEditor.jsx", comment);
  // const [comments, setComments] = useState([]);
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 600) {
      return;
    }
    try {
      let res;
      if (mode == "edit") {
        console.log("called to edit from CommentingEditor.jsx", comment);
        res = await updateComment({
          level,
          idOfEditedComment,
          content: comment,
          idOfParentPostOrCommentOfEditedComment, //should be reloaded in edit mode,
        }).unwrap();
        //onEdit(comment);//IMPORTANT
        // onClose();
        //return;
      } else {
        //if (mode == "create")
        console.log("called to create from CommentingEditor.jsx", comment);
        res = await createComment({
          level,
          idOfPostOrCommentWhichIsCommented,
          content: comment,
        }).unwrap();
      }
      console.log("res in CommentingEditor.jsx:", res);
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
      if (res) {
        setComment("");
        setCommentError(null);
        onClose();
      }

      /*       console.log(
        ` giving command to comment section to REFETCH comments from commentingEditor from: ${
          level == 1 ? "post" : "comment"
        }`,
        idOfParentPostOrComment
      );
      commandReload(); //IMPORTANT*/
      //setComments([data, ...comments]);
      /*   } else {
        const rese = await resm.json();
        console.log("error of fetching com creat: ", rese);
        setCommentError(rese.message);
      } */
    } catch (err) {
      const errMsg =
        "data" in err
          ? "message" in err.data
            ? err.data.message
            : JSON.stringify(err.data)
          : "message" in err
          ? err.message
          : "error" in err
          ? err.error
          : JSON.stringify(err);
      console.log("errMsg in CommentingEditor.jsx: ", errMsg);
      setCommentError(errMsg);
      //setCommentError(error.message);
    }
  };

  /*   useEffect(() => {
    console.log(
      "returnData from updateCommentMutationResult in PostPage : ",
      updateCommentMutationResult
    );
    if (
      updateCommentMutationResult.status == "fulfilled" &&
      updateCommentMutationResult.isSuccess == true
    ) {
      //navigate(`/dashboard?tab=posts&userId=${currentUser._id}`);
    }
    if (updateCommentMutationResult.isError == true) {
      setCommentError(updateCommentMutationResult.error.message);
    }
  }, [updateCommentMutationResult]); */

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
