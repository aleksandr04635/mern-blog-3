import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export default function TagLink({ tag }) {
  const { pageSize } = useSelector((state) => state.pageSize);

  return (
    <Link
      to={`/search?tag=${tag.slug}&pageSize=${pageSize}`}
      className="hover:bg-active-bg rounded border border-secondary-border px-2 py-1  
      text-sm font-normal outline-1
      outline-secondary-border  hover:outline dark:hover:bg-dark-active-bg"
    >
      {tag?.name?.split(" ").join("\u00A0")}
    </Link>
  );
}
//      key={tag._id}
