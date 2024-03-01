import { Alert, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { formatISO9075 } from "date-fns";
import TagLinksList from "../components/TagLinksList";
import CommentSection from "../components/CommentSection";
import CommentingEditor from "../components/CommentingEditor";
import InfoString from "../components/InfoString";
import AuthrorName from "../components/AuthrorName";
import ModalComponent from "../components/ModalComponent";
import { useDeletePostMutation } from "../redux/apiSlice";
import Likes from "../components/Likes";

export default function PostPage() {
  const navigate = useNavigate();
  const { postSlug } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [post, setPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tocomment, setTocomment] = useState(false);
  const [reloadSwitch, setReloadSwitch] = useState(false); //triggers the reload of comments section upon adding a new comment

  //console.log("loading: ", loading);
  //console.log("post: ", post);
  // console.log("error: ", error);
  //console.log(" currentUser : ", currentUser);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");
        console.log(
          "fetching in PostPage: ",
          `/api/post/getposts?slug=${postSlug}`
        );
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        console.log("fetched data in PostPage: ", data);

        if (!res.ok) {
          //const data = await res.json();
          //if (!res.ok) {
          //setPublishError(data.message);
          setError(data.message);
          console.log("!res.ok ", error);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setLoading(false);
          //console.log("res.ok ");
          //console.log("data.posts.length: ", data.posts.length);
          if (data.posts.length == 0) {
            setError("No posts found");
            console.log("No posts found");
            return;
          }
          //console.log("res.ok.data.posts[0]: ", data.posts[0]);
          setPost(data.posts[0]);
          setError("");
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  const onLike = async (id, type, ac) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      console.log("type, ac from onLike in PostPage: ", type, ac);
      const res = await fetch(`/api/post/likePost/${post._id}`, {
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
        //console.log("data from onLike: ", data);
        setPost({
          ...post,
          likes: data.likes,
          numberOfLikes: data.likes.length,
          dislikes: data.dislikes,
          numberOfDislikes: data.dislikes.length,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [deletePost, deletePostMutationResult] = useDeletePostMutation();
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      /*  const res = await fetch(
        `/api/post/deletepost/${post._id}/${currentUser?._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        navigate(`/dashboard?tab=posts&userId=${currentUser._id}`);
      } */

      const res = await deletePost({
        postId: post._id,
        userId: currentUser?._id,
      }).unwrap();
      console.log("res  in PostEditor : ", res);
    } catch (err) {
      const errMsg =
        "message" in err
          ? err.message
          : "error" in err
          ? err.error
          : JSON.stringify(err.data);
      console.log(errMsg);
      setError(errMsg);
    }
  };

  useEffect(() => {
    /*  if (isSuccessPost) {
      returnData;
      console.log("returnData  in PostEditor : ", returnData);
      navigate(`/`);} */
    console.log(
      "returnData from deletePostMutationResult in PostPage : ",
      deletePostMutationResult
    );
    if (
      deletePostMutationResult.status == "fulfilled" &&
      deletePostMutationResult.isSuccess == true
    ) {
      navigate(`/dashboard?tab=posts&userId=${currentUser._id}`);
    }
    if (deletePostMutationResult.isError == true) {
      setError(deletePostMutationResult.error.message);
    }
  }, [deletePostMutationResult]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="px-1 sm:p-3   max-w-6xl mx-auto min-h-screen">
      {post && (
        <div className="flex flex-col max-w-3xl w-full mx-auto    ">
          {post && post.image && (
            <img
              src={post && post.image}
              alt={post && post.title}
              className=" p-3    object-contain "
            />
          )}

          <InfoString className="" post={post} />
          {/*           <div className="flex justify-between p-3 border-b border-slate-500  w-full text-xs">
            <span>{formatISO9075(new Date(post.createdAt))}</span>
                     <span>{new Date(post.createdAt).toUTCString()}</span> 
            {post && <span>importance: {post.importance}</span>}
            <span className="italic">
              {post && (post.content.length / 1000).toFixed(0)} mins read
            </span>
          </div> */}
          <div className="mx-auto pt-2">
            {post && post.userId.username && <AuthrorName post={post} />}
          </div>

          <h1 className="text-3xl  p-1 text-center font-serif  lg:text-2xl">
            {post && post.title}
          </h1>
          <div className=" p-2  text-base post-content ">
            {post && post.intro}
          </div>
          <div
            className="p-2   post-content"
            dangerouslySetInnerHTML={{ __html: post && post.content }}
          ></div>
          <TagLinksList post={post} />
          {/*               <div className="flex  w-full items-center mt-2  font-semibold">
            <span>Tags: </span>
            <TagLinksList post={post} />
          </div> */}
          <div className="flex flex-col border-l-0  border-teal-500 sm:flex-row items-center justify-between w-full">
            {/* Likes sm:w-[150px] flex-col sm: */}
            <div className="flex flex-row items-center justify-between w-full">
              <Likes type={"post"} comment={post} onLike={onLike} />
              {/*   <div className="flex flex-row h-[50px] w-full p-2 text-lg items-center dark:border-gray-700  gap-2">
                <button
                  type="button"
                  disabled={!currentUser}
                  onClick={() =>
                    onLike(
                      "l",
                      post.likes.includes(currentUser._id) ? "-" : "+"
                    )
                  }
                  className={`text-gray-400 hover:text-blue-500 ${
                    currentUser &&
                    post.likes.includes(currentUser._id) &&
                    "!text-blue-500"
                  }`}
                >
                  <FaThumbsUp className="text-lg" />
                </button>
                <p className="text-gray-400">
                  {post.numberOfLikes > 0 &&
                    post.numberOfLikes +
                      " " +
                      (post.numberOfLikes === 1 ? "like" : "likes")}
                </p>
                <button
                  type="button"
                  disabled={!currentUser}
                  onClick={() =>
                    onLike(
                      "d",
                      post.dislikes.includes(currentUser._id) ? "-" : "+"
                    )
                  }
                  className={`text-gray-400 hover:text-blue-500 ${
                    currentUser &&
                    post.dislikes.includes(currentUser._id) &&
                    "!text-blue-500"
                  }`}
                >
                  <FaThumbsDown className="text-lg" />
                </button>
                <p className="text-gray-400">
                  {post.numberOfDislikes > 0 &&
                    post.numberOfDislikes +
                      " " +
                      (post.numberOfDislikes === 1 ? "dislike" : "dislikes")}
                </p>
              </div> */}

              <Button
                onClick={() => setTocomment(!tocomment)}
                outline
                gradientDuoTone="purpleToBlue"
                type="submit"
                className="flex-none w-[150px] mx-1"
              >
                {tocomment ? "Cancel" : "Comment"}
              </Button>
            </div>
            {currentUser &&
              (post.userId._id == currentUser._id || currentUser.isAdmin) && (
                <div className="flex justify-between sm:justify-end gap-2 w-full items-center  ">
                  <Button
                    outline
                    gradientDuoTone="purpleToBlue"
                    className="w-[150px] "
                    onClick={() => {
                      navigate(`/update-post/${post._id}`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    outline
                    gradientDuoTone="pinkToOrange"
                    className="w-[150px] mx-1"
                    onClick={() => {
                      setShowModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              )}
          </div>
          {tocomment && (
            <CommentingEditor
              toPost={true}
              idOfParentPostOrComment={post._id}
              commandReload={() => {
                setReloadSwitch(!reloadSwitch);
              }}
              mode="create"
              onClose={() => {
                setTocomment(false);
              }}
            />
          )}
          <CommentSection
            key={post._id}
            level={1}
            reloadSwitch={reloadSwitch}
            idOfParentPostOrComment={post._id}
            reloadParentSection={() => {
              console.log("reloaded post's comments");
            }}
          />
          <ModalComponent
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleDeletePost}
            text={"Are you sure you want to delete this post?"}
          />
        </div>
      )}
      {error && (
        <Alert color="failure" className={`mt-5 text-justify `}>
          {error}
        </Alert>
      )}
    </main>
  );
}