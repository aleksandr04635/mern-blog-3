import { changePageSize } from "../redux/pageSize/pageSizeSlice";
import { useSelector, useDispatch } from "react-redux";

export default function PageSizeControl() {
  const dispatch = useDispatch();
  const { pageSize } = useSelector((state) => state.pageSize);

  return (
    <div className="mr-0.5 flex items-center  gap-1  ">
      <label htmlFor="pageSize" className="text-sm">
        page&nbsp;size:{" "}
      </label>
      <select
        /*  size="4" */
        onChange={(e) => {
          dispatch(changePageSize(+e.target.value));
        }}
        value={pageSize || import.meta.env.VITE_FIREBASE_API_KEY}
        id="pageSize"
        className="flex appearance-none   rounded-lg 
         border border-main-border  bg-transparent 
         pb-0 pl-1  pt-0 
        text-center outline-1 outline-main-border     hover:bg-active-bg
          hover:outline hover:ring-main-border  focus:border-main-border 
          focus:ring-main-border dark:bg-dark-additional-bg/60  dark:hover:bg-dark-active-bg [&:not([size])]:pr-7"
      >
        {/* [&:not([size])]:pr-5  */}
        <option className="" value="2">
          2
        </option>
        <option className="" value="3">
          3
        </option>
        <option className="" value="5">
          5
        </option>
        <option className="" value="10">
          10
        </option>
      </select>
    </div>
  );
}
