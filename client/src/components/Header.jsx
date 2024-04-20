import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import MyButton from "./MyButton";
import { customDropdownTheme } from "../../customFlowbiteThemes";

function SearchFormForHeader({ type }) {
  const { pageSize } = useSelector((state) => state.pageSize);
  const navigate = useNavigate();
  const location = useLocation();
  //console.log(" location from SearchForm: ", location);
  const [searchTerm, setSearchTerm] = useState("");
  //console.log(" searchTerm from SearchForm: ", searchTerm);

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

  /*   <p
  onClick={handleSubmit}
  className="absolute right-[-21px] top-[10px] h-10 w-12 cursor-pointer border-none text-xl"
>
  <AiOutlineSearch />
</p> */

  //overflow-hidden
  return (
    <form
      onSubmit={handleSubmit}
      className={
        "w-full   md:w-[300px] " +
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
       border-main-border py-1.5 focus:border-main-border focus:ring-1 focus:ring-main-border dark:bg-dark-additional-bg/40  
        md:w-[300px]"
      />
      {/* dark:bg-dark-active-bg */}
      <p
        onClick={handleSubmit}
        className="absolute right-[-1px] top-[10px] h-6 w-7 cursor-pointer border-none text-xl"
      >
        <AiOutlineSearch />
      </p>
    </form>
  );
}

function SingInButton() {
  const location = useLocation();
  //console.log(" location from SingInButton: ", location);
  const [encodedCallbackUrl, setEncodedCallbackUrl] = useState("");
  //console.log(" encodedCallbackUrl from Header2: ", encodedCallbackUrl);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const callbackUrlFromUrl = urlParams.get("callbackUrl");
    if (callbackUrlFromUrl) {
      console.log(" callbackUrlFromUrl from Header: ", callbackUrlFromUrl);
      setEncodedCallbackUrl(encodeURIComponent(callbackUrlFromUrl));
    } else {
      let callbackUrl = location.pathname;
      if (location.search) {
        callbackUrl += location.search;
      }
      console.log(" callbackUrl from Header: ", callbackUrl);
      //const encodedCallbackUrl = encodeURIComponent(callbackUrl);
      setEncodedCallbackUrl(encodeURIComponent(callbackUrl));
    }
    //console.log(" encodedCallbackUrl from Header1: ", encodedCallbackUrl);
  }, [location]);

  return (
    <Link className="" to={`/sign-in?callbackUrl=${encodedCallbackUrl}`}>
      <MyButton>Sign In</MyButton>
    </Link>
  );
}

export default function Header() {
  const dispatch = useDispatch();
  const { pageSize } = useSelector((state) => state.pageSize);
  const { currentUser } = useSelector((state) => state.user);

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
      className="grow-0 border-b
      border-layout-border bg-white/95 pb-1 pl-1 pr-2 pt-1 dark:border-layout-border
       dark:bg-dark-additional-bg/40
     md:px-5 md:pb-2.5 md:pt-2.5"
    >
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between space-x-1 ">
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
              theme={customDropdownTheme}
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
              {/*  <Dropdown.Divider /> */}
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <SingInButton />
          )}
        </div>
        <SearchFormForHeader type="narrow-scr" />
      </div>
    </nav>
  );
}
