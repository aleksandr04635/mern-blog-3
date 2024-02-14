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
  const [pageSize, setPageSize] = useState(
    import.meta.env.VITE_DEFAULT_PAGE_SIZE
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    console.log("urlParams in header: ", urlParams);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
    const pageSizeFromUrl = urlParams.get("pageSize");
    if (pageSizeFromUrl) {
      console.log("Setting pageSize from URL in header: ", pageSizeFromUrl);
      setPageSize(pageSizeFromUrl);
    }
  }, [location]);
  // }, [location.search]);

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

  //console.log(" currentUser from header: ", currentUser);

  console.log("pageSize from header: ", pageSize);
  //let urlParams2 = new URLSearchParams(location.search);
  let urlParams2 = new URLSearchParams();
  urlParams2.set("pageSize", pageSize);
  let searchQuery2 = urlParams2.toString();

  return (
    <Navbar className="sm:border-b border-gray-500">
      <div className="flex flex-col w-full">
        <div className="flex w-full justify-between ">
          {/* <Navbar className="m-auto max-w-6xl max-w-[1200px]  border border-gray-400  rounded"></Navbar> */}
          {/* my */}
          {/*       <Link
        to="/"
        className="hover:bg-gray-300 self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white border rounded p-2"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Sahand's
        </span>
        Blog
      </Link> */}
          {/*           <Button
            outline
            onClick={() => {
              navigate(`/`);
            }}
            gradientDuoTone="purpleToBlue"
            className="font-semibold w-[100px]"
          >
            <h2> My Blog</h2>
          </Button> 
          active:outline-none
          */}
          <Link className="" to={`/?${searchQuery2}`}>
            <Button
              outline
              gradientDuoTone="purpleToBlue"
              className=" font-semibold w-[100px]"
            >
              <h2> My Blog</h2>
            </Button>
          </Link>
          <form onSubmit={handleSubmit} className="relative hidden sm:inline">
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

          <button
            className=" w-[40px] h-[40px] sm:inline rounded-full border border-gray-300 text-center"
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
