import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { formatISO9075 } from "date-fns";

export default function PostCard({ post }) {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="flex flex-col sm:flex-row w-full  border outline-teal-500 border-teal-500 outline-2 hover:outline overflow-hidden rounded-lg  ">
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
      <div className="sm:pl-2 flex flex-col justify-around">
        <span className="pt-1 text-sm px-2">
          {formatISO9075(new Date(post.createdAt))}
        </span>
        <Link to={`/post/${post.slug}`}>
          <h2
            className="text-xl text-justify px-2
           text-stone-800 dark:text-violet-400 dark:hover:text-blue-400 hover:text-blue-800 
           py-1 font-semibold "
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
                ? "/dashboard?tab=posts"
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
              className="dark:hover:bg-stone-700 hover:bg-stone-200 text-sm border rounded  px-2 py-1"
            >
              {t.name}
            </Link>
          ))}
        </div>
        {/*  Likes */}
        <div className="flex h-[50px] w-full p-2 text-lg  dark:border-gray-700  gap-2">
          <button
            type="button"
            className={`text-gray-400 cursor-default ${
              currentUser &&
              post.likes.includes(currentUser._id) &&
              "!text-blue-500"
            }`}
          >
            <FaThumbsUp className="text-lg" />
          </button>
          <p className="text-gray-400">
            {post.numberOfLikes > 0 && post.numberOfLikes}
          </p>
          <p className="text-gray-400">|</p>
          <button
            type="button"
            className={`text-gray-400 cursor-default ${
              currentUser &&
              post.dislikes.includes(currentUser._id) &&
              "!text-blue-500"
            }`}
          >
            <FaThumbsDown className="text-lg" />
          </button>
          <p className="text-gray-400">
            {post.numberOfDislikes > 0 && post.numberOfDislikes}
          </p>
        </div>
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
