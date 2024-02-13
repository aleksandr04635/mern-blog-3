import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function PaginationBar({ currentPage, totalPages }) {
  const location = useLocation();
  //console.log("currentPage: ", currentPage);
  //console.log("totalPages: ", totalPages);
  if (totalPages <= 1) {
    return (
      <>
        <span></span>
      </>
    );
  }

  const cName = (n) => {
    let cn = "  border border-teal-500 px-2 ";
    if (n == currentPage) {
      cn += " dark:bg-cyan-900 bg-cyan-50";
    }
    if (n != currentPage) {
      cn += " dark:bg-slate-900 dark:hover:bg-stone-700 hover:bg-stone-100 ";
    }
    if (n == totalPages) {
      cn += " rounded-l-lg ";
    }
    if (n == 1) {
      cn += " rounded-r-lg ";
    }
    return cn;
  };

  //const maxPage = Math.min(totalPages, Math.max(currentPage + 4, 10));
  //const minPage = Math.max(1, Math.min(currentPage - 5, maxPage - 9));
  const maxPage = Math.min(totalPages, Math.max(currentPage + 3, 6));
  const minPage = Math.max(1, Math.min(currentPage - 3, maxPage - 5));
  const numberedPageItems = [];
  //for (let page = minPage; page <= maxPage; page++) {
  for (let page = maxPage; page >= minPage; page--) {
    let urlParams = new URLSearchParams(location.search);
    urlParams.set("page", page);
    let searchQuery = urlParams.toString();
    numberedPageItems.push(
      currentPage === page ? (
        <div key={page} className={cName(page)}>
          {page}
        </div>
      ) : (
        <Link
          key={page}
          to={`${location.pathname}?${searchQuery}`}
          className=""
        >
          <div className={cName(page)}>{page}</div>
        </Link>
      )
    );
  }

  let urlParamsFirst = new URLSearchParams(location.search);
  urlParamsFirst.set("page", 1);
  let searchQueryFirst = urlParamsFirst.toString();
  let urlParamsLast = new URLSearchParams(location.search);
  urlParamsLast.set("page", totalPages);
  let searchQueryLast = urlParamsLast.toString();

  return (
    <>
      {/* <div className=" hidden sm:block"> */}
      <div className="flex flex-row">
        {maxPage < totalPages && (
          <Link to={`${location.pathname}?${searchQueryLast}`} key={totalPages}>
            <div className={cName(totalPages)}>{totalPages}</div>
          </Link>
        )}
        {maxPage < totalPages - 1 && <div className="px-2 ">...</div>}
        {numberedPageItems}
        {minPage > 2 && <div className="px-2 ">...</div>}
        {minPage > 1 && (
          <Link to={`${location.pathname}?${searchQueryFirst}`} key={1}>
            <div className={cName(1)}>{1}</div>
          </Link>
        )}
      </div>
      {/*      <p>currentPage:{currentPage}</p>
      <p>totalPages:{totalPages}</p>
      <p>maxPage:{maxPage}</p>
      <p>minPage:{minPage}</p> */}
      {/*       <div className="flex flex-row">
        {minPage > 1 && (
          <div className={cName(1)}>
            <Link to={`/search?${searchQueryFirst}`} key={1}>
              {1}
            </Link>
          </div>
        )}
        {minPage > 2 && <div className=" ">...</div>}
        {numberedPageItems}
        {maxPage < totalPages - 1 && <div className=" ">...</div>}
        {maxPage < totalPages && (
          <div className={cName(totalPages)}>
            <Link to={`/search?${searchQueryLast}`} key={totalPages}>
              {totalPages}
            </Link>
          </div>
        )}
      </div> */}
      {/*     <div className=" block sm:hidden"> */}
      {/*       <div className="block sm:hidden flex ">
        {currentPage > 1 && (
          <Link to={"?page=" + (+currentPage - 1)} className=" ">
            «
          </Link>
        )}
        <div className=" ">Page {currentPage}</div>
        {currentPage < totalPages && (
          <Link to={"?page=" + (+currentPage + 1)} className=" ">
            »
          </Link>
        )} 
      </div>*/}
    </>
  );
}
