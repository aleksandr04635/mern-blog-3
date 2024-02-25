import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import TagsTable from "../components/TagsTable";

export default function Home() {
  const [reloadSwitch, setReloadSwitch] = useState(false); //command to reload tags list

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
      <div className="w-full sm:w-3/12 flex-0 sm:py-10 sm:pl-2 overflow-hidden ">
        <TagsTable reloadSwitch={reloadSwitch} />
      </div>
      <div className=" sm:w-9/12 flex-0 flex flex-col gap-3 py-3 px-2 max-w-6xl  ">
        <h3 className="text-xl font-semibold ">Welcome to my Blog</h3>
        <Link to={"/about"} className="text-lg text-blue-500 hover:underline">
          Here is the full description of this app and all its features
        </Link>
        <Link to={"/search"} className="text-lg text-blue-500 hover:underline">
          Here you can search in the posts list
        </Link>
        <h3 className="text-stone-800 dark:text-purple-500 text-xl ">
          Here you see the list of all posts:
        </h3>
        <PostList
          deleteSignal={() => {
            setReloadSwitch(!reloadSwitch);
          }}
        />
      </div>
    </div>
  );
}
