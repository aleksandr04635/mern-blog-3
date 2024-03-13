import { formatDistanceToNow, formatISO9075 } from "date-fns";
import moment from "moment";

export default function DateTime({ crTime, upTime, variant }) {
  const ta =
    "created\u00A0" + formatISO9075(new Date(crTime)).split(" ").join("\u00A0");
  //const tb = moment(time).fromNow().split(" ").join("\u00A0");
  /*   const tb =
  "updated\u00A0" +
  formatDistanceToNow(upTime).split(" ").join("\u00A0") +
  "\u00A0ago";
  last\u00A0 */
  const tb =
    "last\u00A0change\u00A0" +
    moment(upTime).fromNow().split(" ").join("\u00A0");

  return (
    <span
      className={
        variant == "post"
          ? "flox-row flex w-full justify-between gap-5 sm:w-fit"
          : "text-additional-text dark:text-dark-additional-text flex flex-row gap-2 text-xs"
      }
    >
      <span>{ta}</span>
      <span>{tb}</span>
    </span>
  );
}
//justify-between
//"additional-text": "#374151",
//"dark-additional-text": "#E5E7EB",
