import { Button, Select, TextInput, Spinner, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import PaginationBar from "../components/PaginationBar";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    pageSize: 2,
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(2);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  console.log("totalPosts in state: ", totalPosts);
  console.log("page in state: ", page);
  console.log("pageSize in state: ", pageSize);
  console.log("totalPages in state: ", totalPages);
  console.log("sidebarData: ", sidebarData);

  useEffect(() => {
    console.log("USEEFFECT RUN. location.search: ", location.search);
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const pageSizeFromUrl = urlParams.get("pageSize");

    if (searchTermFromUrl || sortFromUrl || pageSizeFromUrl) {
      console.log(
        "Setting setSidebarData from URL: ",
        searchTermFromUrl,
        sortFromUrl,
        pageSizeFromUrl
      );
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        pageSize: pageSizeFromUrl,
      });
    }

    /*  if (pageSizeFromUrl) {
        //if (searchTermFromUrl || sortFromUrl || pageSizeFromUrl) {
        console.log("Setting pageSize from URL: ", pageSizeFromUrl);
        setSidebarData({
          ...sidebarData,
          searchTerm: searchTermFromUrl,
          sort: sortFromUrl,
          pageSize: pageSizeFromUrl,
        });
        setPageSize(pageSizeFromUrl);
      } else {
        console.log("no pageSizeFromUrl: ");
      }
      if (searchTermFromUrl) {
        console.log("Setting searchTermFromUrl from URL: ", searchTermFromUrl);
        setSidebarData({
          ...sidebarData,
          searchTerm: searchTermFromUrl,
        });
      } else {
        console.log("no searchTermFromUrl: ");
      }
      if (sortFromUrl) {
        console.log("Setting sortFromUrl from URL: ", sortFromUrl);
        setSidebarData({
          ...sidebarData,
          sort: sortFromUrl,
        });
      } else {
        console.log("no sortFromUrl: ");
      } */

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
            `/search?${searchQuery3}`
          );
          navigate(`/search?${searchQuery3}`);
        }
      }
    };
    fetchPosts();
    //console.log("sidebarData: ", sidebarData);
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "pageSize") {
      const pageSize1 = +e.target.value || 2;
      setSidebarData({ ...sidebarData, pageSize: pageSize1 });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("pageSize", sidebarData.pageSize);
    urlParams.set("page", "");
    let searchQuery2 = urlParams.toString();
    console.log("APPLIED QUERRY FROM FORM: ", searchQuery2);
    navigate(`/search?${searchQuery2}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-5  md:border-r md:min-h-screen border-gray-500">
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
            <Select
              onChange={handleChange}
              value={sidebarData.sort || "desc"}
              id="sort"
            >
              <option value="desc">Latest on top</option>
              <option value="asc">Oldest on top</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">pageSize:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.pageSize || 2}
              id="pageSize"
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToBlue">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <div className=" mt-2 px-3 py-1 text-lg">
          <h3 className="text-xl font-semibold  py-1  ">Querry results:</h3>
          <p>Total number of posts: {totalPosts}</p>
          <p>PageSize: {pageSize}</p>
          <p>Total number of pages: {totalPages}</p>
          <p>Page: {page}</p>
          <p className="pt-1 text-sm">
            Note that the number of posts on the topmost page varies depending
            on their total number and querry to ensure that a specific URL will
            correspond to the concrete set of posts in the future, when other
            posts are added
          </p>
        </div>

        <div className="px-3 py-2 flex flex-col gap-2">
          <PaginationBar currentPage={page} totalPages={totalPages} />
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
          <PaginationBar currentPage={page} totalPages={totalPages} />
        </div>
        {errorMessage && (
          <Alert className={`mt-5 text-justify w-60`} color="failure">
            {/* it can be failure or success */}
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}
