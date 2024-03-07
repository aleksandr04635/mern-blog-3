import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { HiMiniArrowSmallLeft } from "react-icons/hi2";
import { HiMiniArrowSmallRight } from "react-icons/hi2";

export default function PaginationBar({ currentPage, totalPages }) {
  const location = useLocation();
  const { pageSize: pageSizeStore } = useSelector((state) => state.pageSize);
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
    let cn =
      "  border border-teal-500 px-2 dark:text-white outline-teal-500  outline-1 hover:outline";
    if (n == currentPage) {
      cn += " dark:bg-dark-active-bg bg-active-bg";
    }
    if (n != currentPage) {
      cn +=
        " dark:bg-slate-900 dark:hover:bg-dark-active-bg hover:bg-active-bg ";
    }
    if (n == totalPages) {
      cn += " rounded-l-lg ";
    }
    if (n == 1) {
      cn += " rounded-r-lg ";
    }
    if (n == totalPages + 1) {
      cn += " rounded-l-lg px-1 sm:px-5 mr-2 sm:mr-5";
      /*   if (currentPage == totalPages) {
        cn += " invisible cursor-default";
      } */
    }
    if (n == 0) {
      cn += " rounded-r-lg px-1 sm:px-5 ml-2 sm:ml-5";
    }
    return cn;
  };

  const makeQuery = (page) => {
    let urlParams = new URLSearchParams(location.search);
    urlParams.set("page", page);
    urlParams.set("pageSize", pageSizeStore);
    return location.pathname + "?" + urlParams.toString();
  };

  //const maxPage = Math.min(totalPages, Math.max(currentPage + 4, 10));
  //const minPage = Math.max(1, Math.min(currentPage - 5, maxPage - 9));
  const maxPage = Math.min(totalPages, Math.max(currentPage + 3, 6));
  const minPage = Math.max(1, Math.min(currentPage - 3, maxPage - 5));
  const numberedPageItems = [];
  //for (let page = minPage; page <= maxPage; page++) {
  for (let page = maxPage; page >= minPage; page--) {
    numberedPageItems.push(
      currentPage === page ? (
        <div key={page} className={cName(page)}>
          {page}
        </div>
      ) : (
        <Link key={page} to={`${makeQuery(page)}`} className="">
          <div className={cName(page)}>{page}</div>
        </Link>
      ),
    );
  }

  return (
    <>
      {/* <div className=" hidden sm:block"> */}
      <div className="ml-0.5 flex flex-row">
        {currentPage < totalPages && (
          <Link to={`${makeQuery(currentPage + 1)}`} key={totalPages + 1}>
            <div className={cName(totalPages + 1)}>
              <HiMiniArrowSmallLeft className="text-2xl" />
            </div>
          </Link>
        )}
        {maxPage < totalPages && (
          <Link to={`${makeQuery(totalPages)}`} key={totalPages}>
            <div className={cName(totalPages)}>{totalPages}</div>
          </Link>
        )}
        {maxPage < totalPages - 1 && <div className="px-2 ">...</div>}
        {numberedPageItems}
        {minPage > 2 && <div className="px-2 ">...</div>}
        {minPage > 1 && (
          <Link to={`${makeQuery(1)}`} key={1}>
            <div className={cName(1)}>{1}</div>
          </Link>
        )}
        {currentPage > 1 && (
          <Link to={`${makeQuery(currentPage - 1)}`} key={0}>
            <div className={cName(0)}>
              <HiMiniArrowSmallRight className="text-2xl" />
            </div>
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
