import { changePageSize } from "../redux/pageSize/pageSizeSlice";
import { useSelector, useDispatch } from "react-redux";

export default function PageSizeControl() {
  const dispatch = useDispatch();
  const { pageSize } = useSelector((state) => state.pageSize);

  return (
    <div className="flex items-center gap-1    ">
      <label className="text-sm">page size:</label>
      <select
        onChange={(e) => {
          dispatch(changePageSize(+e.target.value));
        }}
        value={pageSize || import.meta.env.VITE_FIREBASE_API_KEY}
        id="pageSize"
        className="px-2 py-0 border rounded-lg border-teal-500 outline-teal-500  outline-1 
        hover:ring-teal-500 focus:ring-teal-500 hover:outline     focus:border-teal-500
          dark:bg-slate-900 dark:hover:bg-dark-active-bg  hover:bg-stone-100 
           "
      >
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="10">10</option>
      </select>
    </div>
  );
}
