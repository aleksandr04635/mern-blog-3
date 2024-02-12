import { Button, Select, TextInput, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import PaginationBar from "../components/PaginationBar";

export default function Search() {
  //const pageSize = 2;
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    pageSize: 2,
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  console.log("totalPosts in state: ", totalPosts);
  console.log("page in state: ", page);
  console.log("sidebarData: ", sidebarData);
  // let totalPages = Math.ceil(totalPosts / pageSize);
  let totalPages = Math.floor(totalPosts / pageSize) || 1;

  useEffect(() => {
    console.log("USEEFFECT RUN. location.search: ", location.search);
    const urlParams = new URLSearchParams(location.search);
    let searchTermFromUrl = urlParams.get("searchTerm");
    let sortFromUrl = urlParams.get("sort");
    let pageSizeFromUrl = urlParams.get("pageSize");

    /*     if (searchTermFromUrl || sortFromUrl || pageSizeFromUrl) {
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
    } */

    if (pageSizeFromUrl) {
      console.log("Setting pageSize from URL: ", pageSizeFromUrl);
      setSidebarData({
        ...sidebarData,
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
    }

    let pageFromUrl = urlParams.get("page");
    if (pageFromUrl) {
      console.log("page exists in URL. Setting page from URL: ", pageFromUrl);
      setPage(pageFromUrl);
    } else {
      console.log("no page in URL: ");
    }

    const fetchPosts = async () => {
      setLoading(true);
      let urlParams = new URLSearchParams(location.search);
      let searchQuery = urlParams.toString();
      console.log("fetched: ", `/api/post/getposts?${searchQuery}`);
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);

        //add here error setting
        const rese = await res.json();
        console.log(" rese fetched: ", rese);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        console.log(" data fetched: ", data);
        let urlParams = new URLSearchParams(location.search);
        let pageFromUrl = urlParams.get("page");
        //if (pageFromUrl) {
        if (data.page) {
          console.log("  page exists in data: ", data.page);
          console.log("SETTING posts and totalposts from data: ");
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLoading(false);
        } else {
          // console.log(" no page in URL upon fetch: ", data);
          console.log(" no page exists in data: ", data);
          let pageSizeFromUrl = urlParams.get("pageSize");
          console.log(
            " pageSizeFromUrl then setting totalPages for searchQuery: ",
            //  pageSize
            pageSizeFromUrl
          );
          if (!pageSizeFromUrl) {
            console.log("pageSizeFromUr doesn't exist, so I use 2 instead: ");
            pageSizeFromUrl = 2;
          }
          //totalPages2 = Math.floor(data.totalPosts/ pageSize) || 1;
          //let totalPages2 = Math.ceil(data.totalPosts / pageSize);
          let totalPages2 = Math.floor(data.totalPosts / pageSizeFromUrl) || 1;
          const urlParams2 = new URLSearchParams(location.search);
          urlParams2.set("page", totalPages2);
          let searchQuery3 = urlParams2.toString();
          console.log(" setting searchQuery and navigate: ", searchQuery3);
          navigate(`/search?${searchQuery3}`);
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
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToBlue">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h3 className="text-xl font-semibold  p-2 mt-2 ">Querry results:</h3>
        <div className="p-2">
          <p>Total number of posts: {totalPosts}</p>
          <p>PageSize: {pageSize}</p>
          <p>Total number of pages: {totalPages}</p>
          <p>Page: {page}</p>
          {totalPages > 1 && (
            <PaginationBar currentPage={page} totalPages={totalPages} />
          )}
          <PaginationBar currentPage={15} totalPages={15} />
        </div>
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
        </div>
      </div>
    </div>
  );
}
