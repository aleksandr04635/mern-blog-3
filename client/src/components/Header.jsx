import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

function SearchForm({ type, searchTerm, change, handleSubmit }) {
  const location = useLocation();
  console.log(" location from SearchForm: ", location);

  return (
    <form
      onSubmit={handleSubmit}
      className={
        "w-full sm:w-[300px] " +
        (type == "wide"
          ? "relative hidden sm:inline"
          : location.pathname !== "/search"
            ? "relative  mx-auto mt-1 sm:hidden"
            : "hidden")
      }
    >
      <input
        type="text"
        placeholder="Search..."
        /*  rightIcon={AiOutlineSearch} */
        value={searchTerm}
        onChange={(e) => change(e.target.value)}
        className="border-main-border focus:border-main-border focus:ring-main-border
       w-full rounded-lg border py-1.5 dark:bg-dark-active-bg sm:w-[300px]"
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
  const { pageSize } = useSelector((state) => state.pageSize);
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  //console.log(" currentUser from header: ", currentUser)
  console.log(" searchTerm from header: ", searchTerm);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    //console.log("urlParams in header: ", urlParams);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
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
    <Navbar className="border-b border-gray-500 pb-1 pl-1 pr-2 pt-1 dark:border-gray-500 sm:pb-2.5 sm:pt-2.5">
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between ">
          {/* <Navbar className="m-auto max-w-6xl max-w-[1200px]  border border-gray-400  rounded"></Navbar> */}
          {/*  <Link className="" to={`/`}>
            <Button
              outline
              gradientDuoTone="purpleToBlue"
              className=" font-semibold w-[100px] focus:ring-0 "
            >
              <h2> My Blog</h2>
            </Button>
          </Link> */}
          <Link className="" to={`/?pageSize=${pageSize}`}>
            {/*   <button
              className=" flex h-[40px] w-[100px] items-center justify-center rounded-[7px]    
            bg-gradient-to-tr from-cyan-400 to-blue-700 font-semibold
              dark:hover:bg-dark-active-bg     "
            >
              <div
                className="mx-auto flex h-[36px] w-[96px] items-center justify-center rounded-[5px] 
             bg-white from-cyan-400 to-blue-700 
             text-sm text-slate-900 hover:bg-gradient-to-tr 
             hover:text-white dark:bg-[#1f2937] dark:text-white"
              >
                My Blog
              </div>
              
            </button> */}
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
            <button
              className=" flex  w-fit items-center justify-center rounded-[7px] bg-gradient-to-tr
             from-cyan-400   via-blue-500 to-purple-600 p-[2px] font-semibold
              dark:hover:bg-dark-active-bg     "
            >
              <div
                className="dark:bg-dark-additional-bg flex w-fit items-center  justify-center  rounded-[5px] bg-white 
             px-5 py-2 text-sm text-slate-900 hover:bg-transparent 
             hover:text-white dark:text-white dark:hover:bg-transparent"
              >
                My Blog
              </div>
            </button>
          </Link>

          <Link
            className=" link-stand text-base "
            to={`/about`}
            target="_blank"
            rel="noopener noreferrer"
          >
            About this project
          </Link>
          <SearchForm
            type="wide"
            change={(v) => setSearchTerm(v)}
            handleSubmit={handleSubmit}
            searchTerm={searchTerm}
          />
          <button
            className="   h-[40px] w-[40px] rounded-full   
            bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 text-center
              dark:hover:bg-dark-active-bg  sm:inline    "
            onClick={() => dispatch(toggleTheme())}
          >
            <div
              className="mx-auto flex h-[36px] w-[36px] items-center justify-center rounded-full
             bg-white from-cyan-400 via-blue-500 to-purple-600
             text-slate-900 hover:bg-gradient-to-tr hover:text-white 
             dark:bg-[#1f2937] dark:text-white "
            >
              {theme === "light" ? (
                <FaMoon className="mx-auto " />
              ) : (
                <FaSun className="mx-auto" />
              )}
            </div>
          </button>
          {/*    <button
            className=" w-[40px] h-[40px] sm:inline rounded-full border 
            hover:bg-gray-100 dark:hover:bg-dark-active-bg border-main-border text-center 
            outline-main-border  outline-1 hover:outline "
            color="gray"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? (
              <FaMoon className="mx-auto" />
            ) : (
              <FaSun className="mx-auto" />
            )}
          </button> */}
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
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
          )}
        </div>
        <SearchForm
          type="narrow"
          change={(v) => setSearchTerm(v)}
          handleSubmit={handleSubmit}
          searchTerm={searchTerm}
        />

        {/*  <form
          onSubmit={handleSubmit}
          className="relative  mx-auto mt-1 sm:hidden"
        >
          <TextInput
            type="text"
            placeholder="Search..."
          
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px] py-1.5"
          />
          <p
            onClick={handleSubmit}
            className="absolute right-[-21px] top-[10px] h-10 w-12 cursor-pointer border-none text-xl"
          >
            <AiOutlineSearch />
          </p>
        </form> */}
      </div>
    </Navbar>
  );
}
