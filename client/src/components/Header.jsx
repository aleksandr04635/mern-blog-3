import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import MyButton from "./MyButton";

function SearchFormForHeader({ type }) {
  const { pageSize } = useSelector((state) => state.pageSize);
  const navigate = useNavigate();
  const location = useLocation();
  //console.log(" location from SearchForm: ", location);
  const [searchTerm, setSearchTerm] = useState("");
  console.log(" searchTerm from SearchForm: ", searchTerm);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    //console.log("urlParams in header: ", urlParams);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location]);

  const handleSubmit = (e) => {
    if (searchTerm) {
      e.preventDefault();
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("searchTerm", searchTerm);
      urlParams.set("page", "");
      urlParams.set("pageSize", pageSize);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        "w-full overflow-hidden  md:w-[300px] " +
        (type == "wide-scr"
          ? "relative hidden  md:inline "
          : location.pathname !== "/search"
            ? "relative mx-auto mt-1   md:hidden"
            : "hidden")
      }
    >
      <input
        type="text"
        placeholder="Search..."
        /*  rightIcon={AiOutlineSearch} */
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full  rounded-lg border
       border-main-border py-1.5 focus:border-main-border focus:ring-main-border dark:bg-dark-active-bg 
        md:w-[300px]"
      />
      <p
        onClick={handleSubmit}
        className="absolute right-[-21px] top-[10px] h-10 w-12 cursor-pointer border-none text-xl"
      >
        <AiOutlineSearch />
      </p>
    </form>
  );
}

export default function Header() {
  //const path = useLocation().pathname;
  const dispatch = useDispatch();
  const location = useLocation();
  //console.log(" location from Header: ", location);
  const { pageSize } = useSelector((state) => state.pageSize);
  const { currentUser } = useSelector((state) => state.user);
  const [encodedCallbackUrl, setEncodedCallbackUrl] = useState("");
  //console.log(" encodedCallbackUrl from Header2: ", encodedCallbackUrl);

  useEffect(() => {
    let callbackUrl = location.pathname;
    if (location.search) {
      callbackUrl += location.search;
    }
    console.log(" callbackUrl from Header: ", callbackUrl);
    //const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    setEncodedCallbackUrl(encodeURIComponent(callbackUrl));
    //console.log(" encodedCallbackUrl from Header1: ", encodedCallbackUrl);
  }, [location]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //focus:ring-0
  //change={(v) => setSearchTerm(v)}
  return (
    <nav
      className="bg-light-additional-bg/40
      border-b border-layout-border pb-1 pl-1 pr-2 pt-1 dark:border-layout-border
       dark:bg-dark-additional-bg/40
     md:px-5 md:pb-2.5 md:pt-2.5"
    >
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between space-x-1 ">
          {/*  <Link className="" to={`/?pageSize=${pageSize}`}> */}
          {/*   <button
              className=" flex h-[40px] w-[100px] items-center justify-center rounded-[7px]    
            bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 font-semibold
              dark:hover:bg-dark-active-bg     "
            >
              <div
                className="dark:bg-dark-additional-bg mx-auto flex h-[36px] w-[96px] items-center justify-center 
             rounded-[5px] bg-white text-sm text-slate-900 hover:bg-transparent 
             hover:text-white dark:text-white dark:hover:bg-transparent"
              >
                My Blog
              </div>
            </button> */}
          {/*      <button
              className=" flex  w-fit items-center justify-center rounded-[7px] bg-gradient-to-bl
             from-cyan-400   via-blue-500 to-purple-600 p-[2px] font-semibold
              dark:hover:bg-dark-active-bg     "
            >
              <div
                className="flex w-fit items-center justify-center  rounded-[5px]  bg-white px-5 
             py-2 text-sm text-slate-900 hover:bg-transparent hover:text-white 
             dark:bg-dark-additional-bg dark:text-white dark:hover:bg-transparent"
              >
                My Blog
              </div>
            </button>
          </Link> */}
          <Link className="" to={`/?pageSize=${pageSize}`}>
            <MyButton className=" font-semibold">My Blog</MyButton>
          </Link>
          <Link
            className=" link-stand text-base "
            to={`/about`}
            target="_blank"
            rel="noopener noreferrer"
          >
            About this project
          </Link>
          <SearchFormForHeader type="wide-scr" />
          {/*    <button
            className="   flex h-[40px] w-[40px]   items-center   justify-center rounded-full
            bg-gradient-to-bl from-cyan-400 via-blue-500 to-purple-600 p-[2px]
              text-center  dark:hover:bg-dark-active-bg  sm:inline  "
            onClick={() => dispatch(toggleTheme())}
          >
            <div
              className="mx-auto flex h-full w-full items-center justify-center rounded-full
             bg-white text-slate-900 hover:bg-transparent hover:text-white dark:bg-dark-additional-bg
             dark:text-white dark:hover:bg-transparent "
            >
              {theme === "light" ? (
                <FaMoon className="mx-auto " />
              ) : (
                <FaSun className="mx-auto" />
              )}
            </div>
          </button> */}
          <ThemeSwitcher />
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              className="block text-lg"
              label={
                /*       <Avatar alt="user" img={currentUser.profilePicture} rounded /> */
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={currentUser.profilePicture}
                  alt={"user"}
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">{currentUser.username}</span>
                <span className="block truncate text-sm font-medium">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to={"/create-post"}>
                <Dropdown.Item className="text-sm ">
                  Create a post
                </Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link
              className=""
              to={`/sign-in?callbackUrl=${encodedCallbackUrl}`}
            >
              <MyButton>Sign In</MyButton>
            </Link>
            /*   <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link> */
          )}
        </div>
        <SearchFormForHeader type="narrow-scr" />
      </div>
    </nav>
  );
}
