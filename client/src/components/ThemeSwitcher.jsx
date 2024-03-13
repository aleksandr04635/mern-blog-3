import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  //const [sw, setSw] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    if (mq.matches) {
      dispatch(toggleTheme("dark"));
    }
    // () => dispatch(toggleTheme())
    // This callback will fire if the perferred color scheme changes without a reload
    // mq.addEventListener("change", (evt) => setIsDark(evt.matches));
    mq.addEventListener("change", (evt) => {
      dispatch(toggleTheme(evt.matches ? "dark" : "light"));
      //console.log("switch", new Date());
      //setSw(!sw);
      //console.log("sw", sw);
    });
  }, [dispatch]);

  return (
    <button
      className="   flex h-[40px] w-[40px]   items-center   justify-center rounded-full
    bg-gradient-to-bl from-cyan-400 via-blue-500 to-purple-600 p-[2px]
      text-center  dark:hover:bg-dark-active-bg  sm:inline  "
      onClick={() =>
        dispatch(toggleTheme(theme === "light" ? "dark" : "light"))
      }
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
    </button>
  );
}
