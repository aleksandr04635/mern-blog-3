import {
  Button,
  Select,
  TextInput,
  Modal,
  Spinner,
  Alert,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import PaginationBar from "./PaginationBar";
import { changePageSize } from "../redux/pageSize/pageSizeSlice";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function PostList() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { pageSize: pageSizeStore } = useSelector((state) => state.pageSize);
  //console.log("pageSizeStore in PostList: ", pageSizeStore);

  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(
    pageSizeStore || import.meta.env.VITE_DEFAULT_PAGE_SIZE
  );
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [tagInfo, setTagInfo] = useState("");
  const [userInfo, setUserInfo] = useState({});
  console.log("userInfo in PostList: ", userInfo);
  /*   console.log("totalPosts in state: ", totalPosts);
  console.log("page in state: ", page);
  console.log("pageSize in state: ", pageSize);
  console.log("totalPages in state: ", totalPages); */

  const fetchPostsByQuerryString = async (q) => {
    setLoading(true);
    console.log(
      "fetched by fetchPostsByQuerryString: ",
      `/api/post/getposts?${q}`
    );
    const res = await fetch(`/api/post/getposts?${q}`);
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
      console.log("checking if page and pageSize exist in location.search ");
      const urlParams5 = new URLSearchParams(location.search);
      let pageFromUrl = parseInt(urlParams5.get("page"));
      let pageSizeFromUrl = parseInt(urlParams5.get("pageSize"));
      //console.log("pageFromUrl: ", pageFromUrl);
      //console.log("pageSizeFromUrl: ", pageSizeFromUrl);
      if (
        pageFromUrl &&
        pageFromUrl == data.page &&
        pageSizeFromUrl &&
        pageSizeFromUrl == data.pageSize
      ) {
        console.log(
          "page and pageSize exist in URL and are equal to that in data. SETTING posts and totalposts from data"
        );
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setPageSize(data.pageSize);
        setTotalPages(data.totalPages);
        setPage(data.page);
        if (data.user) {
          setUserInfo(data.user);
        }
      } else {
        console.log(
          "no page or pageSize exist in URL or are not equal to that in data. "
        );
        const urlParams4 = new URLSearchParams(location.search);
        urlParams4.set("page", data.page);
        urlParams4.set("pageSize", data.pageSize);
        let searchQuery3 = urlParams4.toString();
        console.log(
          "in fetchPostsByQuerryString setting searchQuery and navigate to: ",
          `${location.pathname}?${searchQuery3}`
        );
        navigate(`${location.pathname}?${searchQuery3}`);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("USEEFFECT RUN in PostList components. location: ", location);
      let pageSizel;
      if (pageSizeStore) {
        console.log(
          "Setting pageSize to querry function from Store: ",
          pageSizeStore
        );
        pageSizel = pageSizeStore;
      }
      const urlParams = new URLSearchParams(location.search);
      const pageSizeFromUrl = urlParams.get("pageSize");
      if (pageSizeFromUrl && !pageSizeStore) {
        console.log(
          "pageSize from Store not exist. Setting pageSize to state and querry from URL: ",
          pageSizeFromUrl
        );
        setPageSize(pageSizeFromUrl);
        pageSizel = pageSizeFromUrl;
      }
      let urlParams2 = new URLSearchParams(location.search);
      urlParams2.set("pageSize", pageSizel);
      let searchQuery = urlParams2.toString();
      console.log(
        "given command to fetch: ",
        `/api/post/getposts?${searchQuery}`
      );
      fetchPostsByQuerryString(searchQuery);
    };
    fetchPosts();
  }, [location.search]);

  useEffect(() => {
    const ef = async () => {
      console.log(
        "pageSizeStore changed. Setting pageSize from store to: ",
        pageSizeStore
      );
      setPageSize(pageSizeStore);
    };
    ef();
  }, [pageSizeStore]);

  //change pageSize
  const handleChange = (e) => {
    console.log(" pageSize changed to to: ", +e.target.value);
    dispatch(changePageSize(+e.target.value));
    setPageSize(+e.target.value);
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("pageSize", +e.target.value);
    urlParams.set("page", Math.floor(totalPosts / +e.target.value) || 1);
    let searchQuery2 = urlParams.toString();
    console.log(
      "from change pageSize setting searchQuery and navigate to: ",
      `${location.pathname}?${searchQuery2}`
    );
    navigate(`${location.pathname}?${searchQuery2}`);
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    console.log(" from PostList DELETE a post: ", postToDelete);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postToDelete}/${currentUser?._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        const rese = await res.json();
        console.log("error of fetching: ", rese);
        setErrorMessage(rese.message);
        return;
      } else {
        const newTopPage = Math.floor((totalPosts - 1) / pageSize) || 1;
        const urlParams3 = new URLSearchParams(location.search);
        urlParams3.set("page", newTopPage);
        let searchQuery3 = urlParams3.toString();
        console.log(
          " calling fetchPostsQ from  handleDeletePost  with : ",
          searchQuery3
        );
        fetchPostsByQuerryString(searchQuery3);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  function ControlBar() {
    return (
      <div className="flex justify-between items-center gap-2">
        <PaginationBar currentPage={page} totalPages={totalPages} />
        <div className="flex items-center gap-1">
          <label className="text-sm">page size:</label>
          <select
            onChange={handleChange}
            value={pageSize || import.meta.env.VITE_FIREBASE_API_KEY}
            id="pageSize"
            className="px-2 py-0 border rounded-lg border-teal-500   
            dark:bg-slate-900 dark:hover:bg-stone-700 hover:bg-stone-100 
             "
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col  gap-2 ">
      <div className="  text-lg">
        {/*         <h3 className="text-xl font-semibold  py-1  ">Querry results:</h3> */}
        {userInfo.username && (
          <div className=" flex flex-col max-w-full ">
            <div className=" items-center flex max-w-full ">
              <p>Posts by </p>
              <h1 className="text-xl  p-1 my-1 text-center font-serif  ">
                {userInfo.username}
              </h1>
            </div>
            <div className=" items-center flex max-w-full ">
              <div className=" relative w-20 h-20 self-center shadow-md overflow-hidden rounded-full">
                <img
                  src={userInfo.profilePicture}
                  alt="user"
                  className={`rounded-full w-full h-full object-cover border-2 
                    border-gray-300 dark:border-purple-500`}
                />
              </div>
              <p className="pl-3">{userInfo.description}</p>
            </div>
          </div>
        )}
        <p>Total number of posts found: {totalPosts}</p>
        {/*  <p>Page size: {pageSize}</p>
              <p>Total number of pages: {totalPages}</p>
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
          posts.map((post) => (
            <PostCard
              onDelete={(postid) => {
                setShowModal(true);
                setPostToDelete(postid);
              }}
              key={post._id}
              post={post}
            />
          ))}
        <ControlBar />
      </div>
      {errorMessage && (
        <Alert className={`mt-5 text-justify w-60`} color="failure">
          {/* it can be failure or success */}
          {errorMessage}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
