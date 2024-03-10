import { Footer } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";

export default function FooterCom() {
  const { pageSize } = useSelector((state) => state.pageSize);
  const location = useLocation();
  //console.log(" window.location.origin: ", window.location.origin);

  return (
    <Footer
      container
      className=" m-auto rounded-none border-t border-gray-500  "
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex w-full items-center justify-between">
          <Link
            className="link-stand"
            to={window.location.origin + `?pageSize=${pageSize}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            &copy; {new Date().getFullYear()} My blog
          </Link>
          <Link
            className="link-stand"
            target="_blank"
            rel="noopener noreferrer"
            to={"https://github.com/aleksandr04635"}
          >
            <BsGithub />
          </Link>
        </div>
      </div>
    </Footer>
  );
}
