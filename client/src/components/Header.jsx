import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  //console.log(" currentUser from header: ", currentUser)

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
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    urlParams.set("page", "");
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="sm:border-b border-gray-500">
      <div className="flex flex-col w-full">
        <div className="flex w-full items-center justify-between ">
          {/* <Navbar className="m-auto max-w-6xl max-w-[1200px]  border border-gray-400  rounded"></Navbar> */}
          <Link className="" to={`/`}>
            <Button
              outline
              gradientDuoTone="purpleToBlue"
              className=" font-semibold w-[100px]"
            >
              <h2> My Blog</h2>
            </Button>
          </Link>
          <Link
            className="text-blue-500 text-base hover:text-blue-800"
            to={`/about`}
            target="_blank"
            rel="noopener noreferrer"
          >
            About this project
          </Link>
          <form onSubmit={handleSubmit} className="relative hidden sm:inline">
            {/* <TextInput */}
            <input
              type="text"
              placeholder="Search..."
              /*  rightIcon={AiOutlineSearch} */
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px] border border-teal-500 dark:bg-dark-active-bg rounded-lg"
            />
            <p
              onClick={handleSubmit}
              className="cursor-pointer border-none w-12 h-10 absolute text-xl top-[12px] right-[-21px]"
            >
              <AiOutlineSearch />
            </p>
          </form>

          <button
            className=" w-[40px] h-[40px] sm:inline rounded-full border 
            hover:bg-gray-100 dark:hover:bg-dark-active-bg border-teal-500 text-center 
            outline-teal-500  outline-1 hover:outline "
            color="gray"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? (
              <FaMoon className="mx-auto" />
            ) : (
              <FaSun className="mx-auto" />
            )}
          </button>
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              className="block text-lg"
              label={
                /*       <Avatar alt="user" img={currentUser.profilePicture} rounded /> */
                <img
                  className="w-10 h-10 object-cover rounded-full"
                  src={currentUser.profilePicture}
                  alt={"user"}
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
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
        <form
          onSubmit={handleSubmit}
          className="relative  sm:hidden mx-auto mt-1"
        >
          <TextInput
            type="text"
            placeholder="Search..."
            /*  rightIcon={AiOutlineSearch} */
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
          <p
            onClick={handleSubmit}
            className="cursor-pointer border-none w-12 h-10 absolute text-xl top-[12px] right-[-21px]"
          >
            <AiOutlineSearch />
          </p>
        </form>
      </div>
    </Navbar>
  );
}
