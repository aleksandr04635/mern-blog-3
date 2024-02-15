//UNUSED
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
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function CommentWithCommentSection({ toPost, postId, sw }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [commentsError, setCommentsError] = useState(null);
  const [comments, setComments] = useState([]);
  const [tocomment, setTocomment] = useState(false);
  const [cloader, setCloader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  //console.log("toPost, postId  from CommentSection.jsx:", toPost, postId);

  useEffect(() => {
    const getComments = async () => {
      setCloader(true);
      try {
        const qs = `/api/comment/get${
          toPost ? `Post` : `Comment`
        }Comments/${postId}`;
        console.log("qs from CommentSection.jsx:", qs);
        const res = await fetch(qs);
        if (res.ok) {
          const data = await res.json();
          console.log("fetched data from CommentSection.jsx:", data);
          //setComments(data.com2);
          setComments(data.comments);
          setCloader(false);
        }
      } catch (error) {
        setCloader(false);
        console.log(error.message);
        setCommentsError(error.message);
      }
    };
    getComments();
  }, [postId, sw]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
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
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setTocomment(false);
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  const handleLike = async (commentId, type, ac) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      //console.log("type, ac from handleLike: ", type, ac);
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: type,
          action: ac,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        //console.log("data from handleLike: ", data);
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                  dislikes: data.dislikes,
                  numberOfDislikes: data.dislikes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {tocomment ? (
        <div>
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
              className="border border-teal-500 rounded-md p-3"
            >
              <Textarea
                placeholder="Add a comment..."
                rows="3"
                maxLength="200"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
              <div className="flex justify-between items-center mt-5">
                <p className="text-gray-500 text-xs">
                  {200 - comment.length} characters remaining
                </p>
                <div className="flex justify-between gap-2">
                  <Button gradientDuoTone="purpleToBlue" type="submit">
                    Submit
                  </Button>{" "}
                  <Button
                    onClick={() => setTocomment(false)}
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
      ) : (
        <Button
          className="mx-auto"
          onClick={() => setTocomment(true)}
          outline
          gradientDuoTone="purpleToBlue"
          type="submit"
        >
          Comment
        </Button>
      )}
      {cloader ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="flex flex-col">
          {comments.length === 0 ? (
            <p className="text-sm my-5">No comments yet</p>
          ) : (
            <>
              <div className="text-sm my-5 flex items-center gap-1">
                <div className=" py-1  ">
                  <p>{comments.length}</p>
                </div>
                {comments.length == 1 ? <p>comment:</p> : <p>comments:</p>}
              </div>
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={(commentId) => {
                    setShowModal(true);
                    setCommentToDelete(commentId);
                  }}
                />
              ))}
            </>
          )}
          {commentsError && (
            <Alert color="failure" className="mt-5">
              {commentsError}
            </Alert>
          )}
        </div>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
