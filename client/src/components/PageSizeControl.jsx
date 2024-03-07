import { changePageSize } from "../redux/pageSize/pageSizeSlice";
import { useSelector, useDispatch } from "react-redux";

export default function PageSizeControl() {
  const dispatch = useDispatch();
  const { pageSize } = useSelector((state) => state.pageSize);

  return (
    <div className="flex items-center gap-1    ">
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
         border border-teal-500  bg-transparent 
         pb-0 pl-2  pt-0 
        outline-1 outline-teal-500 hover:bg-stone-50     hover:outline
          hover:ring-teal-500 focus:border-teal-500  focus:ring-teal-500 
          dark:bg-slate-900 dark:hover:bg-dark-active-bg  "
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
