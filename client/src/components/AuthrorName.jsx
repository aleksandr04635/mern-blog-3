import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthrorName({ post }) {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <Link
      to={
        currentUser && currentUser._id && post.userId._id == currentUser._id
          ? `/dashboard?tab=posts&userId=${currentUser._id}`
          : `/search?userId=${post.userId._id}`
      }
      className="text-slate-800 dark:text-purple-500 dark:hover:text-blue-500 hover:text-blue-800"
    >
      <div className="group flex  items- max-w-full ">
        <div className=" relative w-10 h-10 self-center shadow-md overflow-hidden rounded-full">
          <img
            src={post.userId.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-2 dark:group-hover:border-blue-500
           group-hover:border-blue-800 border-gray-300 dark:border-purple-500`}
          />
        </div>
        <h1 className="text-lg  p-1  text-center font-serif  ">
          {post.userId.username}
        </h1>
      </div>
    </Link>
  );
}
//      key={tag._id}
