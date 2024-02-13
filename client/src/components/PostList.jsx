import { Button, Select, TextInput, Spinner, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import PaginationBar from "./PaginationBar";

export default function PostList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [errorMessage, setErrorMessage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(
    import.meta.env.VITE_FIREBASE_API_KEY
  );
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  console.log("totalPosts in state: ", totalPosts);
  console.log("page in state: ", page);
  console.log("pageSize in state: ", pageSize);
  console.log("totalPages in state: ", totalPages);

  useEffect(() => {
    console.log("USEEFFECT RUN in PostList components. location: ", location);
    const urlParams = new URLSearchParams(location.search);
    const pageSizeFromUrl = urlParams.get("pageSize");
    if (pageSizeFromUrl) {
      console.log("Setting pageSize from URL: ", pageSizeFromUrl);
      setPageSize(pageSizeFromUrl);
    }

    const fetchPosts = async () => {
      setLoading(true);
      let urlParams2 = new URLSearchParams(location.search);
      let searchQuery = urlParams2.toString();
      console.log("fetched: ", `/api/post/getposts?${searchQuery}`);
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        const rese = await res.json();
        console.log("error of fetching: ", rese);
        setErrorMessage(rese.message);
        return;
      }
      if (res.ok) {
        setLoading(false);
        setErrorMessage(null);
        const data = await res.json();
        console.log(" data fetched: ", data);
        console.log("checking if page exists in location.search ");
        const urlParams5 = new URLSearchParams(location.search);
        let pageFromUrl = parseInt(urlParams5.get("page"));
        console.log("pageFromUrl: ", pageFromUrl);
        if (pageFromUrl && pageFromUrl == data.page) {
          console.log(
            "page exists in URL and is equal to that in data. SETTING posts and totalposts from data"
          );
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setPageSize(data.pageSize);
          setTotalPages(data.totalPages);
          setPage(data.page);
        } else {
          console.log(
            "no page exists in URL or is not equal to that in data. "
          );
          const urlParams4 = new URLSearchParams(location.search);
          urlParams4.set("page", data.page);
          let searchQuery3 = urlParams4.toString();
          console.log(
            " setting searchQuery and navigate to: ",
            `${location.pathname}?${searchQuery3}`
          );
          navigate(`${location.pathname}?${searchQuery3}`);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    console.log(" pageSize changed to to: ", +e.target.value);
    setPageSize(+e.target.value);
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("pageSize", +e.target.value);
    urlParams.set("page", Math.floor(totalPosts / +e.target.value) || 1);
    let searchQuery2 = urlParams.toString();
    console.log(
      " setting searchQuery and navigate to: ",
      `${location.pathname}?${searchQuery2}`
    );
    navigate(`${location.pathname}?${searchQuery2}`);
  };

  function ControlBar() {
    return (
      <div className="flex justify-between items-center gap-2">
        <PaginationBar currentPage={page} totalPages={totalPages} />
        <div className="flex items-center gap-1">
          <label className="text-sm">page size:</label>
          <Select
            onChange={handleChange}
            value={pageSize || import.meta.env.VITE_FIREBASE_API_KEY}
            id="pageSize"
            className=""
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col  gap-2 ">
      <div className="  text-lg">
        {/*         <h3 className="text-xl font-semibold  py-1  ">Querry results:</h3> */}
        <p>Total number of posts found: {totalPosts}</p>
        <p>Page size: {pageSize}</p>
        {/*         <p>Total number of pages: {totalPages}</p>
        <p>Page: {page}</p> */}
        <p className="pt-1 text-justify text-sm">
          Note that the number of posts on the topmost page varies depending on
          their total number and querry to ensure that a specific URL will
          correspond to the concrete set of posts in the future, when other
          posts are added
        </p>
      </div>

      <div className=" flex flex-col gap-2">
        <ControlBar />
        {!loading && posts.length === 0 && (
          <p className="text-xl text-gray-500">No posts found.</p>
        )}
        {/* <div className="flex justify-center items-center min-h-screen"> */}
        {loading && (
          <div className="flex justify-center items-center ">
            <Spinner size="xl" />
            <p className="text-xl text-gray-500">Loading...</p>
          </div>
        )}
        {!loading &&
          posts &&
          posts.map((post) => <PostCard key={post._id} post={post} />)}
        <ControlBar />
      </div>
      {errorMessage && (
        <Alert className={`mt-5 text-justify w-60`} color="failure">
          {/* it can be failure or success */}
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}
