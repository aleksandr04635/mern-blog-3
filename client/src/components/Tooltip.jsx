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
      const { bottom, height } = groupRef.current.getBoundingClientRect();
      setGroupHeight(height);
      setGroupBot(bottom);
      console.log("bottom, height  useEffect: ", bottom, height);
      console.log("window.scrollY  useEffect: ", window.scrollY);
    }
  }, [window.scrollY]); */

  //REALLY USEFUL
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
  /*   console.log(
    "document.documentElement.clientHeight",
    document.documentElement.clientHeight
  ); */
  //console.log("window.innerHeight: ", window.innerHeight);

  let calculatedPosition =
    groupRef?.current?.getBoundingClientRect().bottom > window.innerHeight - 45
      ? "top"
      : position;

  let positionStyleString;
  switch (calculatedPosition) {
    case "top":
      positionStyleString = " top-[-33px] left-[-10px]";
      break;
    case "bottom":
      positionStyleString = " top-6 left-[-10px]";
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
      colorStyleString = "text-orange-600  dark:text-orange-300";
      break;
    default:
      colorStyleString = "text-blue-800 dark:text-blue-200";
  }

  const mes = message.split(" ").join("\u00A0");
  return (
    <div ref={groupRef} className="group relative flex">
      {/*    <button
        onClick={() => {
          console.log("scrollYPosition: ", scrollYPosition);
          console.log("window.innerHeight: ", window.innerHeight);
          console.log(
            "document.documentElement.clientHeight: ",
            document.documentElement.clientHeight,
          );
          console.log(
            "groupRef?.current?.getBoundingClientRect().bottom: ",
            groupRef?.current?.getBoundingClientRect().bottom,
          );
        }}
      >
        show
      </button> */}
      {children}
      {!!mes && (
        <span
          /* ref={tooltipRef} */
          className={
            `absolute z-10 hidden rounded-md border border-secondary-border bg-white px-2 py-1 text-sm 
       font-medium group-hover:block dark:bg-dark-active-bg  ` +
            colorStyleString +
            positionStyleString
          }
        >
          {mes}
        </span>
      )}
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
