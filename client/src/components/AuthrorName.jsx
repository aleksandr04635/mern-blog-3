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
      className="text-slate-800 hover:text-blue-800 dark:text-purple-500 dark:hover:text-blue-500"
    >
      <div className="items- group  flex max-w-full ">
        <div className=" relative h-10 w-10 self-center overflow-hidden rounded-full shadow-md">
          <img
            src={post.userId.profilePicture}
            alt="user"
            className={`h-full w-full rounded-full border-2 border-gray-300 object-cover
           group-hover:border-blue-800 dark:border-purple-500 dark:group-hover:border-blue-500`}
          />
        </div>
        <h1 className="p-1  text-center  text-lg  ">
          {post.userId.username.split(" ").join("\u00A0")}
        </h1>
      </div>
    </Link>
  );
}
//      key={tag._id}
//font-serif
