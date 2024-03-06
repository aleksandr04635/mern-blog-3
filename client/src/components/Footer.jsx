import { Footer } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";
export default function FooterCom() {
  const location = useLocation();
  console.log(" window.location.origin: ", window.location.origin);

  return (
    <Footer
      container
      className=" rounded-none sm:border-t border-gray-500 m-auto  "
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <Link
            className="link-stand"
            to={window.location.origin}
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
