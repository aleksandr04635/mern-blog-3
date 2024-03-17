import { Alert, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TagLinksList from "../components/TagLinksList";
import CommentSection from "../components/CommentSection";
import CommentingEditor from "../components/CommentingEditor";
import InfoString from "../components/InfoString";
import AuthorName from "../components/AuthorName";
import ModalComponent from "../components/ModalComponent";
import { useDeletePostMutation } from "../redux/apiSlice";
import Likes from "../components/Likes";
import { Helmet } from "react-helmet-async";
import Loading from "../components/Loading";

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
          `/api/post/getposts?slug=${postSlug}`,
        );
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        console.log("fetched data in PostPage: ", data);
        if (!res.ok) {
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
      console.log("res from handleDeletePost in PostEditor : ", res);
      navigate(`/dashboard?tab=posts&userId=${currentUser._id}`);
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
      console.log(errMsg);
      setError(errMsg);
    }
  };
  /* 
  useEffect(() => {
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
  }, [deletePostMutationResult]); */

  if (loading) return <Loading />;
  {
    /* <div className="flex min-h-screen items-center justify-center">
        <Spinner size="xl" />
      </div> */
  }
  {
    /* <Loading /> */
  }
  return (
    <main className="mx-auto min-h-screen   max-w-6xl px-1 sm:p-3">
      <Helmet defaultTitle="My Blog" titleTemplate="%s | My Blog">
        <title>{post.title}</title>
        <meta
          name="description"
          content={post.title + " by " + post.userId.username + " | My Blog"}
        />
        <meta property="og:image" content="post.image" />
      </Helmet>
      {post && (
        <div className="mx-auto flex w-full max-w-3xl flex-col    ">
          {post && post.image && (
            <img
              src={post && post.image}
              alt={post && post.title}
              className=" object-contain    p-3 "
            />
          )}
          <InfoString className="" post={post} />
          <div className="mx-auto pt-2">
            {post && post.userId.username && <AuthorName post={post} />}
          </div>

          <h1 className="p-1  text-center font-serif text-3xl  lg:text-2xl">
            {post && post.title}
          </h1>
          <div className=" post-content  p-2 text-base ">
            {post && post.intro}
          </div>
          <div
            className="post-content   p-2"
            dangerouslySetInnerHTML={{ __html: post && post.content }}
          ></div>
          <TagLinksList post={post} />
          <div className="flex w-full flex-col  items-center justify-between border-l-0 border-main-border sm:flex-row">
            <div className="flex w-full flex-row items-center justify-between">
              <Likes type={"post"} comment={post} onLike={onLike} />
              <Button
                onClick={() => setTocomment(!tocomment)}
                outline
                gradientDuoTone="purpleToBlue"
                type="submit"
                className="mx-1 w-[150px] flex-none"
              >
                {tocomment ? "Cancel" : "Comment"}
              </Button>
            </div>
            {currentUser &&
              (post.userId._id == currentUser._id || currentUser.isAdmin) && (
                <div className="flex w-full items-center justify-between gap-2 sm:justify-end  ">
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
                    className="mx-1 w-[150px]"
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
              level={1}
              idOfPostOrCommentWhichIsCommented={post._id}
              commandReload={() => {
                setReloadSwitch(!reloadSwitch);
              }}
              mode="create"
              onClose={() => {
                setTocomment(false);
              }}
            />
          )}
          {/*   <div>
            post._id:
            {post._id}
          </div> */}
          <CommentSection
            key={post._id}
            level={1}
            /* reloadSwitch={reloadSwitch} */
            idOfParentPostOrComment={post._id}
            /*  listOfAncestorsOfCommentSection={[post._id]} */
            listOfAncestorsOfCommentSection={post._id}
            /*   reloadParentSection={() => {
              console.log("reloaded post's comments");
            }} */
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
//toPost={true}
