import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import TagsTable from "../components/TagsTable";

export default function Home() {
  const [reloadSwitch, setReloadSwitch] = useState(false); //command to reload tags list

  return (
    <div className="flex flex-col justify-center gap-2 lg:flex-row lg:gap-3">
      <div className="flex-0 w-full overflow-hidden lg:w-3/12 lg:py-10 lg:pl-2 ">
        <TagsTable reloadSwitch={reloadSwitch} />
      </div>
      <div className=" flex-0 flex max-w-6xl flex-col gap-3 px-2 py-3 lg:w-9/12  ">
        <h3 className="text-xl font-semibold ">Welcome to my Blog</h3>
        <Link to={"/about"} className=" link-stand text-lg ">
          Here is the full description of this app and all its features
        </Link>
        <Link to={"/search"} className="link-stand text-lg">
          Here you can search in the posts list
        </Link>
        <h3 className="text-xl text-stone-800 dark:text-purple-500 ">
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
