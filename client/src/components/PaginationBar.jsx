import { Link } from "react-router-dom";

export default function PaginationBar({ currentPage, totalPages }) {
  //console.log("currentPage: ", currentPage);
  //console.log("totalPages: ", totalPages);
  //const maxPage = Math.min(totalPages, Math.max(currentPage + 4, 10));
  //const minPage = Math.max(1, Math.min(currentPage - 5, maxPage - 9));
  const maxPage = Math.min(totalPages, Math.max(currentPage + 3, 6));
  const minPage = Math.max(1, Math.min(currentPage - 3, maxPage - 5));
  /* 
  const urlParams = new URLSearchParams(location.search);
        urlParams.set("sort", sidebarData.sort);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
 */

  const cName = (n) => {
    let cn = "A" + n;
    if (n == +currentPage) {
      cn = "A";
    }

    return cn;
  };

  const numberedPageItems = [];
  //for (let page = minPage; page <= maxPage; page++) {
  for (let page = maxPage; page >= minPage; page--) {
    let urlParams = new URLSearchParams(location.search);
    urlParams.set("page", page);
    let searchQuery = urlParams.toString();
    numberedPageItems.push(
      +currentPage === page ? (
        <div className={cName(page)}>{page}</div>
      ) : (
        <div className={cName(page)}>
          <Link to={`/search?${searchQuery}`} key={page} className="">
            {page}
          </Link>
        </div>
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
          <div className={cName(totalPages)}>
            <Link to={`/search?${searchQueryLast}`} key={totalPages}>
              {totalPages}
            </Link>
          </div>
        )}
        {maxPage < totalPages - 1 && <div className=" ">...</div>}
        {numberedPageItems}
        {minPage > 2 && <div className=" ">...</div>}
        {minPage > 1 && (
          <div className={cName(1)}>
            <Link to={`/search?${searchQueryFirst}`} key={1}>
              {1}
            </Link>
          </div>
        )}
      </div>
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
