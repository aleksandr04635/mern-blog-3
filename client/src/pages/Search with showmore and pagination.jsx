import { Button, Select, TextInput, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import PaginationBar from "../components/PaginationBar";

export default function Search() {
  const pageSize = 2;
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  console.log("page: ", page);
  //console.log(sidebarData);
  let totalPages = Math.ceil(totalPosts / pageSize);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const pageFromUrl = urlParams.get("page");
    if (pageFromUrl) {
      console.log("page in URL: ", pageFromUrl);
      setPage(pageFromUrl);
    }
    console.log("pageFromUrl: ", pageFromUrl);
    console.log("location.search: ", location.search);

    if (searchTermFromUrl || sortFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      console.log("fetched: ", `/api/post/getposts?${searchQuery}`);
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        //add here error setting
        return;
      }
      if (res.ok) {
        const data = await res.json();
        console.log(" data fetched: ", data);
        if (pageFromUrl) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLoading(false);
        } else {
          totalPages = Math.ceil(data.totalPosts / pageSize);
          setPage(totalPages);
          const urlParams = new URLSearchParams(location.search);
          urlParams.set("page", totalPages);
          const searchQuery = urlParams.toString();
          navigate(`/search?${searchQuery}`);
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLoading(false);
        }
        // if (data.posts.length === 9) {//old
        if (data.posts.length === pageSize) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      //if (data.posts.length === 9) {//old
      if (data.posts.length === pageSize) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex   items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToBlue">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          Posts results:
        </h1>
        <p>Total number of posts: {totalPosts}</p>
        <p>Total number of pages: {totalPages}</p>
        <p>Page: {page}</p>
        {totalPages > 1 && (
          <PaginationBar currentPage={page} totalPages={totalPages} />
        )}
        <PaginationBar currentPage={15} totalPages={15} />
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && (
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="xl" />
              <p className="text-xl text-gray-500">Loading...</p>
            </div>
          )}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
