export default function Tooltip({
  message,
  children,
  style = "norm",
  position = "bottom",
}) {
  const mes = message.split(" ").join("\u00A0");
  let stPos;
  switch (position) {
    case "bottom":
      stPos = " top-8";
      break;
    case "right":
      stPos = "bottom-[1px] left-[90px]";
      break;
    default:
      stPos = "";
  }
  let stCol;
  switch (style) {
    case "warning":
      stCol = "text-orange-600";
      break;
    default:
      stCol = "text-blue-800 dark:text-blue-200";
  }

  return (
    <div className="group relative flex">
      {children}
      <span
        className={
          `absolute scale-0 bg-white dark:bg-dark-active-bg group-hover:scale-100 z-10 border rounded-md 
       px-2 py-1 text-sm  ` +
          stCol +
          stPos
        }
      >
        {mes}
      </span>
    </div>
  );
}
//transition-all
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
