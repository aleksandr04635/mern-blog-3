import { Link } from "react-router-dom";
import PostList from "../components/PostList";
import TagsTable from "../components/TagsTable";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const { pageSize } = useSelector((state) => state.pageSize);
  //const [reloadSwitch, setReloadSwitch] = useState(false); //command to reload tags list

  return (
    <div className="flex flex-col justify-center gap-2 lg:flex-row lg:gap-3">
      <Helmet>
        <title>My Blog - Main page</title>
        <meta name="description" content="My Blog - Main page" />
      </Helmet>
      <div className="flex-0 w-full overflow-hidden lg:w-3/12 lg:py-10 lg:pl-2 ">
        <TagsTable /* reloadSwitch={reloadSwitch} */ />
      </div>
      <div className=" flex-0 flex max-w-6xl flex-col gap-3 px-2 py-3 lg:w-9/12  ">
        <h1 className="text-xl font-semibold ">Welcome to my Blog</h1>
        <Link to={"/about"} className=" link-stand text-lg ">
          Here is the full description of this app and all its features
        </Link>
        <Link
          to={`/search?pageSize=${pageSize}`}
          className="link-stand text-lg"
        >
          Here you can search in the posts list
        </Link>
        <h3 className="text-base  dark:text-white ">
          Here you see the list of all posts:
        </h3>
        <PostList
        /*  deleteSignal={() => {
            setReloadSwitch(!reloadSwitch);
          }} */
        />
      </div>
    </div>
  );
}
