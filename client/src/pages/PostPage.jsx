import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";
import { Modal, Table } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function PostPage() {
  const { postSlug } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  console.log("post: ", post);
  //console.log(" currentUser : ", currentUser);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  const onLike = async (type, ac) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      console.log("type, ac from onLike: ", type, ac);
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

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${post._id}/${currentUser?._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        navigate(`/dashboard?tab=posts`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="p-3   max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col max-w-2xl w-full mx-auto items-center   ">
        {post && post.image && (
          <img
            src={post && post.image}
            alt={post && post.title}
            className="mt-2 p-3    object-contain "
          />
        )}
        <div className="flex justify-between p-3 border-b border-slate-500  w-full text-xs">
          <span>{post && new Date(post.updatedAt).toUTCString()}</span>
          <span className="italic">
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        <div className="flex max-w-2xl w-full items-center mt-2  font-semibold">
          <div className="flex flex-wrap items-center space-x-2 ">
            <span>Tags: </span>
            {post.tags?.map((t, i) => (
              <Link
                key={i}
                to={`/search?tag=${t.slug}`}
                className=" border rounded my-1 px-2 py-1"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </div>

        {post && post.userId.username && (
          <Link
            to={
              currentUser && post.userId._id == currentUser._id
                ? "/dashboard?tab=posts"
                : `/search?userId=${post.userId._id}`
            }
            className="text-gray-500"
          >
            <div className="flex max-w-full ">
              <div className="relative w-10 h-10 self-center shadow-md overflow-hidden rounded-full">
                <img
                  src={post.userId.profilePicture}
                  alt="user"
                  className={`rounded-full w-full h-full object-cover border-2 border-[lightgray] `}
                />
              </div>
              <h1 className="text-xl  p-1 my-1 text-center font-serif  ">
                {post.userId.username}
              </h1>
            </div>
          </Link>
        )}
        <h1 className="text-3xl  p-1 text-center font-serif  lg:text-3xl">
          {post && post.title}
        </h1>
        <div className=" p-2  text-lg max-w-2xl mx-auto w-full post-content ">
          {post && post.intro}
        </div>
        <div
          className="p-2 max-w-2xl mx-auto w-full post-content"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>
        {/* Likes */}
        <div className="flex h-[50px] w-full p-2 text-lg  dark:border-gray-700  gap-2">
          <button
            type="button"
            onClick={() =>
              onLike("l", post.likes.includes(currentUser._id) ? "-" : "+")
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
            onClick={() =>
              onLike("d", post.dislikes.includes(currentUser._id) ? "-" : "+")
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
        </div>
        {currentUser &&
          (post.userId._id == currentUser._id || currentUser.isAdmin) && (
            <div className="flex justify-around gap-2 w-full max-w-2xl mx-auto mb-4">
              <Button
                outline
                gradientDuoTone="purpleToBlue"
                className="w-[150px]"
                onClick={() => {
                  navigate(`/update-post/${post._id}`);
                }}
              >
                Edit
              </Button>
              <Button
                outline
                gradientDuoTone="pinkToOrange"
                className="w-[150px]"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Delete
              </Button>
            </div>
          )}
        <CommentSection postId={post._id} />

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
                Are you sure you want to delete this post?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeletePost}>
                  Delete
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </main>
  );
}
