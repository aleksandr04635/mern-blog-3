import { formatDistanceToNow, formatISO9075 } from "date-fns";
import moment from "moment";

export default function DateTime({ crTime, upTime, variant }) {
  const time =
    "created\u00A0" + formatISO9075(new Date(crTime)).split(" ").join("\u00A0");
  //const ago = moment(time).fromNow().split(" ").join("\u00A0");
  /*   const ago =
  "updated\u00A0" +
  formatDistanceToNow(upTime).split(" ").join("\u00A0") +
  "\u00A0ago";
  last\u00A0 */
  const ago =
    "last\u00A0change\u00A0" +
    moment(upTime).fromNow().split(" ").join("\u00A0");

  return (
    <span
      className={
        variant == "post"
          ? "flex w-full flex-col justify-between gap-1 sm:w-fit sm:flex-row sm:gap-5 md:flex-col md:gap-1 xl:flex-row xl:gap-5"
          : "flex flex-col gap-1 text-xs text-additional-text dark:text-dark-additional-text sm:flex-row sm:gap-2 "
      }
    >
      <span>{time}</span>
      <span>{ago}</span>
    </span>
  );
}
//justify-between
//"additional-text": "#374151",
//"dark-additional-text": "#E5E7EB",
