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

export default function CommentSection({ lev, toPost, postId, sw }) {
  const { currentUser } = useSelector((state) => state.user);
  const [commentsError, setCommentsError] = useState(null);
  const [comments, setComments] = useState([]);

  const [cloader, setCloader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  //console.log("lev  from CommentSection.jsx:", lev);
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
    <div className="w-full ">
      {cloader ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Spinner size="xl" />
        </div>
      ) : (
        /*   <div className="flex flex-col border-l"> */
        <div className="flex flex-col">
          {comments.length === 0 ? (
            <></>
          ) : (
            /*  <p className="text-sm my-1">No comments yet</p> */
            <div
              className={`mb-1 w-full border-l border-b rounded-bl-lg ${
                lev % 2 == 0 ? `border-fuchsia-500` : `border-teal-500`
              }`}
            >
              {comments.length > 2 && (
                <div
                  className={` text-sm pl-2 py-1 flex items-center gap-1 w-full border-l  ${
                    lev % 2 == 0 ? `border-fuchsia-500` : `border-teal-500`
                  }`}
                >
                  <div className=" py-1  ">
                    <p>{comments.length}</p>
                  </div>
                  {comments.length == 1 ? <p>comment:</p> : <p>comments:</p>}
                </div>
              )}
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  lev={lev}
                  comment={comment}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={(commentId) => {
                    setShowModal(true);
                    setCommentToDelete(commentId);
                  }}
                />
              ))}
            </div>
          )}
          {commentsError && (
            <Alert color="failure" className="mt-3">
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
                Yes, delete
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
