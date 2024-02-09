import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostCard({ post }) {
  const { currentUser } = useSelector((state) => state.user);
  return (
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
            currentUser._id && post.userId._id == currentUser._id
              ? "/dashboard?tab=posts"
              : `/search?userId=${post.userId._id}`
          }
          className="text-blue-500"
        >
          <span className="text-lg   font-serif  ">{post.userId.username}</span>
        </Link>
      </div>
    </div>
  );
}
