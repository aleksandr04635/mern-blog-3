import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthrorName({ post }) {
  const { pageSize } = useSelector((state) => state.pageSize);
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Link
      to={
        currentUser && currentUser._id && post.userId._id == currentUser._id
          ? `/dashboard?tab=posts&userId=${currentUser._id}&pageSize=${pageSize}`
          : `/search?userId=${post.userId._id}&pageSize=${pageSize}`
      }
      className="text-blue-600 hover:text-cyan-600 dark:text-blue-500 dark:hover:text-cyan-500"
    >
      <div className="items- group  flex max-w-full ">
        <div className=" relative h-10 w-10 self-center overflow-hidden rounded-full shadow-md">
          <img
            src={post.userId.profilePicture}
            alt="user"
            className={`h-full w-full rounded-full  border
           border-blue-500  object-cover  group-hover:border-cyan-500 
            dark:border-blue-500 dark:group-hover:border-cyan-500`}
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
