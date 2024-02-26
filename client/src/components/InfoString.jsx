import { formatISO9075 } from "date-fns";
import moment from "moment";

export default function InfoString({ post }) {
  const ta = formatISO9075(new Date(post.createdAt)).split(" ").join("\u00A0");
  const tb = moment(post.createdAt).fromNow().split(" ").join("\u00A0");

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center  px-2  border-slate-500  w-full text-sm">
      <span className="w-full sm:w-fit flex flox-row gap-5 justify-between">
        <span>{ta}</span>
        <span> {tb}</span>
      </span>
      <span className="w-full sm:w-fit flex flox-row gap-5 justify-between">
        <span>
          importance:&nbsp;
          <span className="font-semibold">{post.importance}</span>
        </span>
        <span className="italic">
          {(post.content.length / 1000).toFixed(0)}&nbsp;mins&nbsp;read
        </span>
      </span>
    </div>
  );
}
//justify-between
