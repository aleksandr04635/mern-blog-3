import { formatDistanceToNow, formatISO9075 } from "date-fns";
import moment from "moment";

export default function DateTime({ crTime, upTime, variant }) {
  const ta = formatISO9075(new Date(crTime)).split(" ").join("\u00A0");
  //const tb = moment(time).fromNow().split(" ").join("\u00A0");
  /*   const tb =
  "updated\u00A0" +
  formatDistanceToNow(upTime).split(" ").join("\u00A0") +
  "\u00A0ago"; */
  const tb =
    "last\u00A0updated\u00A0" +
    moment(upTime).fromNow().split(" ").join("\u00A0");

  return (
    <span
      className={
        variant == "post"
          ? "w-full sm:w-fit flex flox-row gap-5 justify-between"
          : "flex flex-row gap-2 text-gray-500 text-xs"
      }
    >
      <span>{ta}</span>
      <span>{tb}</span>
    </span>
  );
}
//justify-between
