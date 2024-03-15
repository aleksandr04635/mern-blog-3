import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthrorName({ post }) {
  const { pageSize } = useSelector((state) => state.pageSize);
  const { currentUser } = useSelector((state) => state.user);
  // max-w-full

  return (
    <Link
      to={
        currentUser && currentUser._id && post.userId._id == currentUser._id
          ? `/dashboard?tab=posts&userId=${currentUser._id}&pageSize=${pageSize}`
          : `/search?userId=${post.userId._id}&pageSize=${pageSize}`
      }
      className="inline text-blue-600  hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-blue-500  "
    >
      <div className="items- group  flex w-fit ">
        <div className=" relative h-10 w-10 self-center overflow-hidden rounded-full shadow-md">
          <img
            src={post.userId.profilePicture}
            alt="user"
            className={`h-full w-full rounded-full  border
           border-blue-600  object-cover  group-hover:border-cyan-600 
            dark:border-cyan-400 dark:group-hover:border-blue-500`}
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
