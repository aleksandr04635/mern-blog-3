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
  //dark:bg-transparent

  //absolute bottom-0
  return (
    <Footer
      container
      className="m-auto mx-0 h-16  grow-0 rounded-none border-t
      border-layout-border bg-white/90 dark:bg-dark-additional-bg/40"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex w-full  flex-col items-center justify-between sm:flex-row">
          <Link
            className="link-stand"
            to={window.location.origin + `?pageSize=${pageSize}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            &copy; {new Date().getFullYear()} My blog
          </Link>

          <Link
            className="link-stand text-base"
            to={`https://oleksandrs-resume.vercel.app`}
            target="_blank"
            rel="noopener noreferrer"
          >
            My&nbsp;CV&nbsp;and&nbsp;contacts
          </Link>

          <Link
            className="link-stand"
            target="_blank"
            rel="noopener noreferrer"
            to={"https://github.com/aleksandr04635"}
          >
            <BsGithub className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </Footer>
  );
}
