import { Link } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import { useSelector } from "react-redux";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { formatISO9075 } from "date-fns";
import { useNavigate } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import Tooltip from "./Tooltip";

export default function PostCard({ post, onDelete }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // overflow-hidden
  return (
    <div
      className="flex flex-col sm:flex-row w-full  border border-teal-500
     outline-teal-500  outline-1 hover:outline  rounded-lg  "
    >
      {post.image && (
        <div className=" grow-0 shrink-0 ">
          <Link to={`/post/${post.slug}`}>
            <img
              src={post.image}
              alt="post cover"
              className=" h-[260px] sm:w-[360px] object-cover"
            />
          </Link>
        </div>
      )}
      {/*  className="max-h-[260px] w-[360px] min-w-full sm:min-w-[360px]  object-cover " */}
      <div className="sm:pl-2 flex flex-col grow justify-around">
        <div className="flex justify-between pt-1 px-2  border-slate-500  w-full text-sm">
          <span>{formatISO9075(new Date(post.createdAt))}</span>
          {/*         <span>{new Date(post.createdAt).toUTCString()}</span> */}
          {post && <span>importance: {post.importance}</span>}
          <span className="italic">
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        <Link to={`/post/${post.slug}`}>
          <h2
            className="text-2xl text-justify px-2
           text-stone-800 dark:text-violet-400 dark:hover:text-blue-400 hover:text-blue-800 
           font-semibold "
          >
            {post.title}
          </h2>
          {/*           line-clamp-2
<h2
            className="text-xl px-2
           text-stone-800 dark:text-violet-400 dark:hover:text-blue-400 hover:text-blue-800 
           py-1 font-semibold line-clamp-2"
          >
            {post.title}
          </h2> */}
        </Link>
        <div className="px-2  ">
          {/* <span> By </span> */}
          <Link
            to={
              currentUser &&
              currentUser._id &&
              post.userId._id == currentUser._id
                ? `/dashboard?tab=posts&userId=${currentUser._id}`
                : `/search?userId=${post.userId._id}`
            }
            className="text-slate-800 dark:text-purple-400 dark:hover:text-blue-400 hover:text-blue-800"
          >
            <div className="group flex max-w-full ">
              <div className=" relative w-10 h-10 self-center shadow-md overflow-hidden rounded-full">
                <img
                  src={post.userId.profilePicture}
                  alt="user"
                  className={`rounded-full w-full h-full object-cover border-2 dark:group-hover:border-blue-400
                   group-hover:border-blue-800 border-gray-300 dark:border-purple-500`}
                />
              </div>
              <h1 className="text-xl  p-1 my-1 text-center font-serif  ">
                {post.userId.username}
              </h1>
            </div>
          </Link>
        </div>
        {post.intro && <div className="px-2 text-justify ">{post.intro}</div>}
        <div className="flex flex-wrap gap-1 px-2 py-1 ">
          {post.tags?.map((t, i) => (
            <Link
              key={i}
              to={`/search?tag=${t.slug}`}
              className="dark:hover:bg-stone-700 hover:bg-stone-200 text-sm border rounded-md  px-2 py-1"
            >
              {t.name}
            </Link>
          ))}
        </div>
        <div className=" px-2 flex items-center justify-between w-full">
          {/*  Likes */}
          <Tooltip
            message="You can upvote a post only after reading it"
            style="warning"
            position="bottom"
          >
            <div className=" group flex  items-center    text-lg  dark:border-gray-700  gap-2">
              <button
                type="button"
                className={`text-gray-500 cursor-default ${
                  currentUser &&
                  post.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-base" />
              </button>
              <p className="text-gray-500">
                {post.numberOfLikes > 0 && post.numberOfLikes}
              </p>
              <p className="text-gray-500">|</p>
              <button
                type="button"
                className={`text-gray-500 cursor-default ${
                  currentUser &&
                  post.dislikes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsDown className="text-base" />
              </button>
              <p className="text-gray-500">
                {post.numberOfDislikes > 0 && post.numberOfDislikes}
              </p>
              {/* <div className=" scale-0 group-hover:scale-100 text-sm text-orange-500 absolute z-50 bottom-[1px] left-[90px]"> */}
              {/*              <div
                className="hidden group-hover:block text-sm w-[280px]
             text-orange-500 absolute z-50 bottom-[1px] left-[90px]"
              >
                You can upvote a post only after reading it
              </div> */}
            </div>
          </Tooltip>
          {/*  Controls */}
          {currentUser &&
            (post.userId._id == currentUser._id || currentUser.isAdmin) && (
              <div className="flex items-center justify-between px-5 w-[100px] gap-2 text-gray-500">
                <Tooltip message="Edit">
                  <div
                    onClick={() => {
                      navigate(`/update-post/${post._id}`);
                    }}
                    className="cursor-pointer border-none   text-xl "
                  >
                    <BiEdit />
                  </div>
                </Tooltip>
                <Tooltip message="Delete">
                  <div
                    onClick={() => onDelete(post._id)}
                    className="cursor-pointer border-none  text-xl "
                  >
                    <MdDelete />
                  </div>
                </Tooltip>
              </div>
            )}
        </div>
        {/* <div className="flex justify-around gap-2 w-full max-w-2xl mx-auto mb-4">
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
                onClick={() => onDelete(post._id)}
              >
                Delete
              </Button> </div> */}
      </div>
    </div>
  );
}
{
  /* Old version    
         <div className=" relative w-full  border outline-teal-500 border-teal-500 outline-2 hover:outline h-[400px] overflow-hidden rounded-lg sm:w-[360px] transition-all">
        <Link to={`/post/${post.slug}`}>
          {post.image && (
            <img
              src={post.image}
              alt="post cover"
              className="h-[260px] w-full  object-cover  z-20"
            />
          )}
          <h2 className="text-2xl px-2 py-1font-semibold line-clamp-2">
            {post.title}
          </h2>
        </Link>
        <div className="px-2  ">
          <span> By </span>
          <Link
            to={
              currentUser && currentUser._id && post.userId._id == currentUser._id
                ? "/dashboard?tab=posts"
                : `/search?userId=${post.userId._id}`
            }
            className="text-blue-500"
          >
            <span className="text-lg   font-serif  ">{post.userId.username}</span>
          </Link>
        </div>
        <div className="flex flex-wrap gap-1 px-2 py-1 ">
          {post.tags?.map((t, i) => (
            <Link
              key={i}
              to={`/search?tag=${t.slug}`}
              className=" border rounded  px-2 py-1"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </div> */
}
