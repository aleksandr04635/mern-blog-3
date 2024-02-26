import TagLink from "./TagLink";

export default function TagLinksList({ post }) {
  return (
    <div className="flex flex-wrap gap-1 px-2 py-1 ">
      {post.tags?.map((t, i) => (
        <TagLink key={i} tag={t} />
      ))}
    </div>
  );
}
//      key={tag._id}
