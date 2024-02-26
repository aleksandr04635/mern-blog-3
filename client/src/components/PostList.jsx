import { Button, Select, TextInput, Spinner, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import PaginationBar from "./PaginationBar";
import PageSizeControl from "./PageSizeControl";
import { changePageSize } from "../redux/pageSize/pageSizeSlice";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import ModalComponent from "./ModalComponent";

export default function PostList({ deleteSignal }) {
  const navigate = useNavigate();
  const location = useLocation();
  // const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { pageSize: pageSizeStore } = useSelector((state) => state.pageSize);
  //console.log("pageSizeStore in PostList: ", pageSizeStore);

  /*   console.log(
    "useSelector((state) => state.pageSize) in PostList: ",
    useSelector((state) => state.pageSize)
  ); */
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  /*   const [pageSize, setPageSize] = useState(
    pageSizeStore || import.meta.env.VITE_DEFAULT_PAGE_SIZE
  ); */
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [tagInfo, setTagInfo] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [usersPage, setUsersPage] = useState(false);
  console.log("usersPage in PostList: ", usersPage);
  //console.log("userInfo in PostList: ", userInfo);
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
      //console.log("checking if page and pageSize exist in location.search ");
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
        //setPageSize(data.pageSize);
        setTotalPages(data.totalPages);
        setPage(data.page);
        setUsersPage(false);
        if (data.user) {
          setUserInfo(data.user);
          setUsersPage(true);
        }
      } else {
        console.log(
          "no page or pageSize exist in URL or are not equal to that in data. "
        );
        const urlParams4 = new URLSearchParams(location.search);
        urlParams4.set("pageSize", data.pageSize);
        urlParams4.set("page", data.page);
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
      const urlParams = new URLSearchParams(location.search);
      const pageSizeFromUrl = urlParams.get("pageSize");
      console.log(
        "pageSizeFromUrl , pageSizeStore: ",
        pageSizeFromUrl,
        pageSizeStore
      );
      if (parseInt(pageSizeFromUrl) != pageSizeStore) {
        urlParams.set("pageSize", pageSizeStore);
        urlParams.set("page", 0);
        let searchQuery = urlParams.toString();
        console.log(
          "in useEffect navigate to: ",
          `${location.pathname}?${searchQuery}`
        );
        navigate(`${location.pathname}?${searchQuery}`);
      }
      let searchQuery = urlParams.toString();
      console.log(
        "given command to fetch: ",
        `/api/post/getposts?${searchQuery}`
      );
      fetchPostsByQuerryString(searchQuery);
    };
    fetchPosts();
  }, [location, pageSizeStore]);

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
      //const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        const rese = await res.json();
        console.log("error of fetching: ", rese);
        setErrorMessage(rese.message);
        return;
      } else {
        const newTopPage = Math.floor((totalPosts - 1) / pageSizeStore) || 1;
        const urlParams3 = new URLSearchParams(location.search);
        urlParams3.set("page", newTopPage);
        let searchQuery3 = urlParams3.toString();
        console.log(
          " calling fetchPostsQ from  handleDeletePost  with : ",
          searchQuery3
        );
        fetchPostsByQuerryString(searchQuery3);
        deleteSignal(); //signals to the parent component
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  function ControlBar() {
    return (
      <div className="flex justify-between items-center gap-2">
        <PaginationBar currentPage={page} totalPages={totalPages} />
        <PageSizeControl />
      </div>
    );
  }

  return (
    <div className="flex flex-col  gap-2 ">
      <div className="  text-lg">
        {/*         <h3 className="text-xl font-semibold  py-1  ">Querry results:</h3> */}
        {usersPage && userInfo.username && (
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
      <ModalComponent
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeletePost}
        text={" Are you sure you want to delete this post?"}
      />
    </div>
  );
}
