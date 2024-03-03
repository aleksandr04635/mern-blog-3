import { Alert, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import ModalComponent from "./ModalComponent";
import { useGetCommentsQuery } from "../redux/comment/commentApiSlice";

export default function CommentSection({
  level,
  idOfParentPostOrComment,
  idOfParentPostOrCommentOfCommentThisSectionBelongTo,
  listOfAncestorsOfCommentSection,
  reloadSwitch,
  reloadParentSection,
}) {
  const { currentUser } = useSelector((state) => state.user);
  const [commentsError, setCommentsError] = useState(null);
  //const [comments, setComments] = useState([]);

  //const [cloader, setCloader] = useState(false);
  //const [showModal, setShowModal] = useState(false);
  //const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  //console.log("level  from CommentSection.jsx:", level);
  //{ comments }
  // let comments = [];
  const {
    data: { comments = [] } = {},
    //data: comments = [],
    isLoading,
    isFetching: cloader,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetCommentsQuery({ level, idOfParentPostOrComment });
  if (isLoading) {
    // console.log("isLoading in CommentSection : ", isLoading);
  } else if (isSuccess) {
    //console.log("comments in CommentSection : ", comments);
  } else if (isError) {
    console.log("error in CommentSection : ", error);
    setCommentsError(error);
  }
  if (level == 1) {
    console.log("comments in CommentSection.jsx : ", comments);
  }

  const getComments = async () => {
    refetch();
  };
  /* const getComments = async () => {
    setCloader(true);
    //console.log("getComments started in CommentSection: ");
    try {
      const qs = `/api/comment/get${
        level == 1 ? `Post` : `Comment`
      }Comments/${idOfParentPostOrComment}`;
      //console.log("qs from CommentSection.jsx:", qs);
      const res = await fetch(qs);
      if (res.ok) {
        const data = await res.json();
        //console.log("fetched data from CommentSection.jsx:", data);
        //setComments(data.com2);
        setComments(data.comments);
        setCloader(false);
      }
    } catch (error) {
      setCloader(false);
      console.log(error.message);
      setCommentsError(error.message);
    }
  };*/

  useEffect(() => {
    getComments();
  }, [idOfParentPostOrComment, reloadSwitch]); //reloadSwitch commands a reload of this commentSection from its parent comment component

  const handleLike = async (commentId, type, ac) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      console.log("type, ac from handleLike in CommentSection: ", type, ac);
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
      console.log("res from handleLike in CommentSection: ", res);
      if (res.ok) {
        const data = await res.json();
        //console.log("data from handleLike: ", data);
        refetch();
        /*         setComments(
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
        ); */
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /*   const handleEditInSection = async (comment, editedContent) => {
    refetch();
         setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    ); 
  }; */

  /*   const handleDelete = async (commentId) => {
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
        console.log("data from handleDelete: ", data);

        if (data == "Comment has been deleted") {
          console.log(
            "one comment deleted. Only setComments started in CommentSection from handleDelete "
          );
          refetch();
          // setComments(comments.filter((comment) => comment._id !== commentId));
        } else if (data == "Comment was set to be deleted") {
          console.log(
            " a comment was not deleted but changed in CommentSection from handleDelete "
          );
          getComments();
        } else if (data == "Comment and his parent one were deleted") {
          console.log(
            " reloadParentSection started in CommentSection from handleDelete "
          );
          reloadParentSection();
        }
        //reloadParentSection(); //New, forces to reload the commentSection that inclued the comment, to which this commentSection is
        //in case the deletion triggered the deletion of a comment, that had been flagged to be deleted before
        //getComments(); //New. Not the old version because a comment can be not deleted but changed
        //setComments(comments.filter((comment) => comment._id !== commentId)); //OLD
      }
    } catch (error) {
      setCommentsError(error.message);
      console.log(error.message);
    }
  }; */

  return (
    <div className="w-full ">
      {cloader ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Spinner size="xl" />
        </div>
      ) : (
        /*   <div className="flex flex-col border-l"> */
        <div className="flex flex-col">
          {!comments || comments?.length === 0 ? (
            <></>
          ) : (
            /*  <p className="text-sm my-1">No comments yet</p> */
            <div
              className={`mb-1 w-full border-l  rounded-bl-lg ${
                level % 2 == 0 ? `border-purple-500` : `border-teal-500`
              }`}
            >
              {/* <div>
                section: idOfParentPostOrComment,:
                {level == 1 ? " post " : " comment "}
                {idOfParentPostOrComment}
              </div>
              <div>
                section: idOfParentPostOrCommentOfCommentThisSectionBelongTo:
                {level == 2 ? " post " : " comment "}
                {idOfParentPostOrCommentOfCommentThisSectionBelongTo ||
                  " unknown "}
              </div>
              <div>
                section: listOfAncestorsOfCommentSection:
                {listOfAncestorsOfCommentSection}
              </div> */}
              {comments.length > 2 && (
                <div
                  className={` text-sm pl-2 py-1 flex items-center gap-1 w-full `}
                >
                  <div className=" py-1  ">
                    <p>{comments.length}</p>
                  </div>
                  {comments.length == 1 ? <p>comment:</p> : <p>comments:</p>}
                </div>
              )}
              {/*    {comments &&
                comments.length > 0 && */}
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  level={level}
                  comment={comment}
                  onLike={handleLike}
                  //onEdit={handleEditInSection}
                  /*    onDelete={(commentId) => {
                    setShowModal(true);
                    setCommentToDelete(commentId);
                  }} */
                  idOfGrandparentPostOrCommentToThisComment={
                    idOfParentPostOrCommentOfCommentThisSectionBelongTo
                  }
                  listOfAncestorsOfComment={listOfAncestorsOfCommentSection}
                  reloadParentSection={() => {
                    getComments();
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

      {/*       <ModalComponent
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => handleDelete(commentToDelete)}
        text={"Are you sure you want to delete this comment?"}
      /> */}
    </div>
  );
}
