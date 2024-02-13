import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostList from "../components/PostList";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col gap-3 p-5 px-3 max-w-6xl mx-auto ">
        <h3 className="text-xl font-semibold ">Welcome to my Blog</h3>
        <Link to={"/about"} className="text-lg text-teal-500 hover:underline">
          Here is the full description of this app and all its features
        </Link>
        <Link to={"/search"} className="text-lg text-teal-500 hover:underline">
          Here you can search in the posts list
        </Link>
        <h3 className="text-stone-800 dark:text-violet-400 text-xl ">
          Here you see the list of all posts:
        </h3>
        <PostList />
      </div>
    </div>
  );
}
