import { Spinner } from "flowbite-react";

export default function Loading({ className }) {
  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <Spinner className="fill-main-border dark:fill-cyan-400" size="xl" />
      <p className="pl-3 text-xl text-main-border dark:text-cyan-400">
        Loading...
      </p>
    </div>
  );
}

{
  /* <button
className={` flex  w-fit items-center justify-center rounded-[7px] bg-gradient-to-bl
from-cyan-400   via-blue-500 to-purple-600 p-[2px]
dark:hover:bg-dark-active-bg    ${className}`}
>
<div
  className="flex w-fit items-center justify-center  rounded-[5px]  bg-white px-5 
py-2 text-sm text-slate-900 hover:bg-transparent hover:text-white 
dark:bg-dark-additional-bg dark:text-white dark:hover:bg-transparent"
>
  {children}
</div>
</button> */
}
