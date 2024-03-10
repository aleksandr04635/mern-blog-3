import PageSizeControl from "./PageSizeControl";
import PaginationBar from "./PaginationBar";

export default function ControlBar({ page, totalPages }) {
  return (
    <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
      <PaginationBar currentPage={page} totalPages={totalPages} />
      <PageSizeControl />
    </div>
  );
}
