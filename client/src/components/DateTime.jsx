import { formatDistanceToNow, formatISO9075 } from "date-fns";
import moment from "moment";

export default function DateTime({ time, variant }) {
  const ta = formatISO9075(new Date(time)).split(" ").join("\u00A0");
  //const tb = moment(time).fromNow().split(" ").join("\u00A0");
  const tb = formatDistanceToNow(time).split(" ").join("\u00A0") + "\u00A0ago";

  return (
    <span
      className={
        variant == "post"
          ? "w-full sm:w-fit flex flox-row gap-5 justify-between"
          : "flex flex-row gap-4 text-gray-500 text-xs"
      }
    >
      <span>{ta}</span>
      <span> {tb}</span>
    </span>
  );
}
//justify-between
