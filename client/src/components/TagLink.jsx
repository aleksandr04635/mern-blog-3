import { Link } from "react-router-dom";

export default function TagLink({ tag }) {
  return (
    <Link
      to={`/search?tag=${tag.slug}`}
      className="dark:hover:bg-dark-active-bg hover:bg-stone-100 font-normal text-sm border rounded  
      px-2 py-1 border-secondary-border
      outline-secondary-border  outline-1 hover:outline"
    >
      {tag?.name?.split(" ").join("\u00A0")}
    </Link>
  );
}
//      key={tag._id}
