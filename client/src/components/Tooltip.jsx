import { useRef, useLayoutEffect, useState, useEffect } from "react";

export default function Tooltip({
  message,
  children,
  style = "norm",
  position = "bottom",
}) {
  //const tooltipRef = useRef(null);
  const groupRef = useRef(null);

  const [tooltipHeight, setTooltipHeight] = useState(0);
  const [groupHeight, setGroupHeight] = useState(0);
  const [groupBot, setGroupBot] = useState(0);

  //console.log("groupRef.current.scrollTop: " + groupRef?.current?.scrollTop);
  //console.log("document.scrollTop: " + document.scrollTop);
  /*   window.addEventListener("scroll", (event) => {
    let scroll = window.scrollY;
    console.log("scroll", scroll);
  }); */

  /*   useEffect(() => {
    if (groupRef?.current) {
      const { bottom, height } = groupRef?.current.getBoundingClientRect();
      setGroupHeight(height);
      setGroupBot(bottom);
      console.log("bottom, height  useEffect: ", bottom, height);
      console.log("window.scrollY  useEffect: ", window.scrollY);
    }
  }, [window.scrollY]); */

  const [scrollYPosition, setScrollYPosition] = useState(0);
  const handleScroll = () => {
    const newScrollYPosition = window.scrollY;
    setScrollYPosition(newScrollYPosition);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Now the vertical position is available with `scrollYPosition`
  // console.log("scrollYPosition", scrollYPosition);
  // console.log("window.innerHeight", window.innerHeight);
  /*   console.log(
    "document.documentElement.clientHeight",
    document.documentElement.clientHeight
  ); */

  let calculatedPosition =
    groupRef?.current?.getBoundingClientRect().bottom > window.innerHeight - 40
      ? "top"
      : position;

  let positionStyleString;
  switch (calculatedPosition) {
    case "top":
      positionStyleString = " top-[-33px] left-[-10px]";
      break;
    case "bottom":
      positionStyleString = " top-8 left-[-10px]";
      break;
    case "right":
      positionStyleString = "bottom-[1px] left-[90px]";
      break;
    default:
      positionStyleString = "";
  }
  let colorStyleString;
  switch (style) {
    case "warning":
      colorStyleString = "text-orange-600";
      break;
    default:
      colorStyleString = "text-blue-800 dark:text-blue-200";
  }

  const mes = message.split(" ").join("\u00A0");
  return (
    <div ref={groupRef} className="group relative flex">
      {children}
      <span
        /* ref={tooltipRef} */
        className={
          `absolute hidden bg-white dark:bg-dark-active-bg group-hover:block z-10 border rounded-md 
       px-2 py-1 text-sm  ` +
          colorStyleString +
          positionStyleString
        }
      >
        {
          mes /* +
          " bottom " +
          groupRef?.current?.getBoundingClientRect().bottom +
          " window.scrollY " +
          window.scrollY */
        }
      </span>
    </div>
  );
}
//transition-all
//scale-0  scale-100
//  <button className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
//\u00A0 character (unicode equivalent of &nbsp;).
/* 
//Usage
<Tooltip
message={"You can upvote a post only after reading it"}
style={"warning"}
>
<></>
</Tooltip> */
