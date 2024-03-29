export default function MyButton({
  style = "standard",
  children,
  className,
  ...props
}) {
  let colorStyleString;
  switch (style) {
    case "danger":
      colorStyleString =
        " from-amber-400 via-orange-500 to-red-600  disabled:from-amber-400/40 disabled:via-orange-500/40 disabled:to-red-600/40 ";
      break;
    case "attention":
      colorStyleString =
        " from-lime-300 via-amber-400 to-orange-500 disabled:from-lime-300/40 disabled:via-amber-400/40 disabled:to-orange-500/40 ";
      break;
    default:
      colorStyleString =
        " from-cyan-400 via-blue-500 to-purple-600 disabled:from-cyan-400/40 disabled:via-blue-500/40 disabled:to-purple-600/40 ";
  }

  return (
    <button
      {...props}
      className={`${colorStyleString} flex
        w-fit items-center justify-center rounded-[7px] bg-gradient-to-bl  p-[2px] 
       disabled:cursor-not-allowed
    dark:hover:bg-dark-active-bg  
     [&_div]:disabled:text-gray-400
    [&_div]:dark:disabled:text-gray-400 
    [&_div]:[&:not(:disabled)]:hover:bg-transparent 
    [&_div]:[&:not(:disabled)]:hover:text-white
    [&_div]:[&:not(:disabled)]:dark:hover:bg-transparent 
      ${className}`}
      /*  https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants */
    >
      <div
        className="flex w-full items-center justify-center  rounded-[5px]  bg-white px-2 py-1 text-sm 
   text-slate-900 dark:bg-dark-additional-bg dark:text-white sm:px-5 sm:py-2 
    "
      >
        {children}
      </div>
    </button>
  );
  /*  <span className={` ${className}`}>      {children}</span>;   
 disabled:[&_div]:    [&:not(:disabled)] */
}

{
  /* <button
      {...props}
      className={` flex  w-fit items-center justify-center rounded-[7px] bg-gradient-to-bl
   from-cyan-400   via-blue-500 to-purple-600 p-[2px]
    disabled:cursor-not-allowed  dark:hover:bg-dark-active-bg  ${className}`}
    >
      <div
        className="flex w-full items-center justify-center  rounded-[5px]  bg-white px-5 
   py-2 text-sm text-slate-900 dark:bg-dark-additional-bg dark:text-white 
   hover:bg-transparent hover:text-white dark:hover:bg-transparent"
      >
        {children}
      </div>
    </button> */
}
