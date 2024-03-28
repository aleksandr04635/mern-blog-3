import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import Tooltip from "./Tooltip";
import TagLinksList from "./TagLinksList";
import InfoString from "./InfoString";
import AuthorName from "./AuthorName";
import Likes from "./Likes";

export default function PostCard({ post, onDelete }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  /*   GOOD        
            <img
              src={post.image}
              alt="post cover"
              className="w-full sm:min-h-full sm:h-[260px] sm:w-[360px] object-cover"
            />
            
             <img
              src={post.image}
              alt="post cover"
              className="w-full  object-cover md:h-[230px] md:max-h-full md:min-h-full md:w-[300px]"
            />

                 <div className="shrink-0 grow-0 rounded-tl-lg rounded-tr-lg  md:rounded-bl-lg md:rounded-tr-none">
          <Link
            to={`/post/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={post.image}
              alt="post cover"
              className="w-full  object-cover  md:max-h-full md:min-h-full md:w-[300px]"
            />
          </Link>
        </div>
         overflow-hidden
grow
md:items-stretch
md:h-full
          */
  return (
    <div
      className="flex w-full flex-col  rounded-lg border border-main-border bg-white/90
     outline-1  outline-main-border hover:outline dark:bg-inherit dark:hover:bg-dark-active-bg/40  md:flex-row  "
    >
      {post.image && (
        <div className="shrink-0 grow-0  overflow-hidden rounded-tl-lg rounded-tr-lg md:w-[300px]  md:rounded-bl-lg md:rounded-tr-none">
          <Link
            to={`/post/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={post.image}
              alt="post cover"
              className="w-full object-cover md:h-full   "
            />
          </Link>
        </div>
      )}
      <div className="flex w-full flex-col  md:py-1 md:pl-2 ">
        <InfoString post={post} />
        <div className="px-2 pb-2 pt-1">
          <span>
            <Link
              to={`/post/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2
                className="mx-auto inline w-fit px-2 text-center text-xl font-semibold text-blue-700 hover:text-cyan-700 
           dark:text-cyan-400 dark:hover:text-blue-500  md:w-full 
           md:text-justify "
              >
                {/*  dark:text-blue-500 dark:hover:text-cyan-500 */}
                {post.title}
              </h2>
            </Link>
          </span>
        </div>
        <div className=" w-fit px-2 md:w-fit ">
          <AuthorName post={post} />
        </div>
        {post.intro && (
          <div className="h-fit w-fit px-2 text-justify ">{post.intro}</div>
        )}
        <TagLinksList post={post} />
        <div className=" flex w-full items-center justify-between px-2">
          <Likes type={"card"} comment={post} />
          {/*  Controls */}
          {currentUser &&
            (post.userId._id == currentUser._id || currentUser.isAdmin) && (
              <div className="flex w-[100px] items-center justify-between gap-2 px-5 text-additional-text dark:text-dark-additional-text">
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
      </div>
    </div>
  );
}
{
  /* Old version  
    
  <div
className="flex flex-col md:flex-row w-full  border border-main-border
outline-main-border  outline-1 hover:outline  rounded-lg  "
>
{post.image && (
  <div className=" grow-0 shrink-0 rounded-tr-lg md:rounded-tr-none rounded-tl-lg  md:rounded-bl-lg overflow-hidden">
    <Link to={`/post/${post.slug}`}>
      <img
        src={post.image}
        alt="post cover"
        className="w-full md:min-h-full md:h-[230px] md:w-[360px] object-cover"
      />
    </Link>
  </div>
)}
<div className="md:pl-2 flex flex-col grow justify-around">
  <InfoString post={post} />
  <Link to={`/post/${post.slug}`}>
    <h2
      className="text-xl text-justify px-2 w-fit mx-auto md:w-full 
     text-stone-800 dark:text-purple-500 dark:hover:text-blue-500 hover:text-blue-800 
     font-semibold "
    >
      {post.title}
    </h2>
  </Link>

</div>
</div>


         <div className=" relative w-full  border outline-main-border border-main-border outline-2 hover:outline h-[400px] overflow-hidden rounded-lg sm:w-[360px] transition-all">
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
