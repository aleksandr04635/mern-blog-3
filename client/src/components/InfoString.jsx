import DateTime from "./DateTime";

export default function InfoString({ post }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center  px-2  border-slate-500  w-full text-sm">
      <DateTime
        crTime={post.createdAt}
        upTime={post.updatedAt}
        variant={"post"}
      />
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
