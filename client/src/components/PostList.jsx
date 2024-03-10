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
import { useDeletePostMutation } from "../redux/apiSlice";
import Loading from "./Loading";
import ControlBar from "./ControlBar";

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
  const [isUsersPage, setIsUsersPage] = useState(false);
  //console.log("isUsersPage in PostList: ", isUsersPage);
  //console.log("userInfo in PostList: ", userInfo);
  /*   console.log("totalPosts in state: ", totalPosts);
  console.log("page in state: ", page);
  console.log("pageSize in state: ", pageSize);
  console.log("totalPages in state: ", totalPages); */

  const fetchPostsByQuerryString = async (q) => {
    setLoading(true);
    console.log(
      "fetched by fetchPostsByQuerryString: ",
      `/api/post/getposts?${q}`,
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
      console.log(
        " data fetched by fetchPostsByQuerryString in PostList.jsx: ",
        data,
      );
      //console.log("checking if page and pageSize exist in location.search ");
      const urlParams5 = new URLSearchParams(location.search);
      let pageFromUrl = parseInt(urlParams5.get("page"));
      let pageSizeFromUrl = parseInt(urlParams5.get("pageSize"));
      //console.log("pageFromUrl: ", pageFromUrl);
      //console.log("pageSizeFromUrl: ", pageSizeFromUrl);
      /*    if (
        pageFromUrl &&
        pageFromUrl == data.page &&
        pageSizeFromUrl &&
        pageSizeFromUrl == data.pageSize
      ) {
        console.log(
          "page and pageSize exist in URL and are equal to that in data. SETTING posts and totalposts from data",
        ); */
      setPosts(data.posts);
      setTotalPosts(data.totalPosts);
      //setPageSize(data.pageSize);
      setTotalPages(data.totalPages);
      setPage(data.page);
      setIsUsersPage(false);
      if (data.user) {
        setUserInfo(data.user);
        setIsUsersPage(true);
      }
      /* } else {
        console.log(
          "no page or pageSize exist in URL or are not equal to that in data. ",
        );
        const urlParams4 = new URLSearchParams(location.search);
        urlParams4.set("pageSize", data.pageSize);
        urlParams4.set("page", data.page);
        let searchQuery3 = urlParams4.toString();
        console.log(
          "in fetchPostsByQuerryString setting searchQuery and navigate to: ",
          `${location.pathname}?${searchQuery3}`,
        );
        navigate(`${location.pathname}?${searchQuery3}`);
      } */
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
        pageSizeStore,
      );
      if (parseInt(pageSizeFromUrl) != pageSizeStore) {
        urlParams.set("pageSize", pageSizeStore);
        urlParams.set("page", "");
        let searchQuery = urlParams.toString();
        console.log(
          "in useEffect NAVIGATE to: ",
          `${location.pathname}?${searchQuery}`,
        );
        navigate(`${location.pathname}?${searchQuery}`);
        return;
      }
      let searchQuery = urlParams.toString();
      console.log(
        "given command to fetch: ",
        `/api/post/getposts?${searchQuery}`,
      );
      fetchPostsByQuerryString(searchQuery);
    };
    fetchPosts();
  }, [location, pageSizeStore]);

  /*   const handleDeletePostOLD = async () => {
    setShowModal(false);
    console.log(" from PostList DELETE a post: ", postToDelete);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postToDelete}/${currentUser?._id}`,
        {
          method: "DELETE",
        },
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
          searchQuery3,
        );
        fetchPostsByQuerryString(searchQuery3);
        deleteSignal(); //signals to the parent component
      }
    } catch (error) {
      console.log(error.message);
    }
  }; */

  //NEW
  const [deletePost, deletePostMutationResult] = useDeletePostMutation();
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await deletePost({
        postId: postToDelete,
        userId: currentUser?._id,
      }).unwrap();
      console.log("res from deletePost in PostList.jsx : ", res);
      if (res) {
        const newTopPage = Math.floor((totalPosts - 1) / pageSizeStore) || 1;
        const urlParams3 = new URLSearchParams(location.search);
        urlParams3.set("page", newTopPage);
        let searchQuery3 = urlParams3.toString();
        console.log(
          "in handleDeletePost setting searchQuery and navigate to: ",
          `${location.pathname}?${searchQuery3}`,
        );
        navigate(`${location.pathname}?${searchQuery3}`);
      }
    } catch (err) {
      const errMsg =
        "data" in err
          ? "message" in err.data
            ? err.data.message
            : JSON.stringify(err.data)
          : "message" in err
            ? err.message
            : "error" in err
              ? err.error
              : JSON.stringify(err);
      console.log(errMsg);
      setErrorMessage(errMsg);
    }
  };

  /* useEffect(() => {
    console.log(
      "returnData in useEffect from deletePost in PostList.jsx : ",
      deletePostMutationResult,
    );
    if (
      deletePostMutationResult.status == "fulfilled" &&
      deletePostMutationResult.isSuccess == true
    ) {
      const newTopPage = Math.floor((totalPosts - 1) / pageSizeStore) || 1;
      const urlParams3 = new URLSearchParams(location.search);
      urlParams3.set("page", newTopPage);
      let searchQuery3 = urlParams3.toString();
      console.log(
        " calling fetchPostsQ from  handleDeletePost  with : ",
        searchQuery3,
      );
      fetchPostsByQuerryString(searchQuery3);
    }
    if (deletePostMutationResult.isError == true) {
      setErrorMessage(deletePostMutationResult.error.message);
    }
  }, [deletePostMutationResult]); */

  return (
    <div className="flex flex-col  gap-2 ">
      <div className="  text-lg">
        {/*         <h3 className="text-xl font-semibold  py-1  ">Querry results:</h3> */}
        {isUsersPage && userInfo.username && (
          <div className=" flex max-w-full flex-col ">
            <div className=" flex max-w-full items-center ">
              <p>Posts by </p>
              <h1 className="my-1  p-1 text-center font-serif text-xl  ">
                {userInfo.username}
              </h1>
            </div>
            <div className=" flex max-w-full items-center ">
              <div className=" relative h-20 w-20 self-center overflow-hidden rounded-full shadow-md">
                <img
                  src={userInfo.profilePicture}
                  alt="user"
                  className={`h-full w-full rounded-full border-2 border-gray-300 
                    object-cover dark:border-secondary-border`}
                />
              </div>
              <p className="pl-3">{userInfo.description}</p>
            </div>
          </div>
        )}

        <p className="text-base">Total number of posts found: {totalPosts}</p>
        {/*  <p>Page size: {pageSize}</p>
              <p>Total number of pages: {totalPages}</p>
        <p>Page: {page}</p> */}
        <p className="pt-1 text-justify text-sm">
          Note that the number of posts on the topmost page varies depending on
          total number of posts corresponding to a query in order to ensure that
          a specific URL will correspond to the concrete set of posts in the
          future, when other posts are added
        </p>
      </div>

      <div className=" flex flex-col gap-2">
        <ControlBar page={page} totalPages={totalPages} />
        {!loading && posts.length === 0 && (
          <p className="text-xl text-gray-500">No posts found.</p>
        )}
        {/* <div className="flex justify-center items-center min-h-screen"> */}
        {loading && (
          <Loading />
          /*         <div className="flex items-center justify-center ">
            <Spinner className="fill-main-border" size="xl" />
            <p className="text-main-border pl-3 text-xl">Loading...</p>
          </div> */
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
        <ControlBar page={page} totalPages={totalPages} />
      </div>
      {errorMessage && (
        <Alert className={`mt-5 w-60 text-justify`} color="failure">
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
