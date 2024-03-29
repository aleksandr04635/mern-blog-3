import { Button, Select, TextInput, Spinner, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostList from "../components/PostList";
import { Helmet } from "react-helmet-async";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
  });

  console.log("sidebarData in Search.jsx: ", sidebarData);

  useEffect(() => {
    console.log("USEEFFECT RUN. location in Search.jsx: ", location);
    //console.log("location: ", location);
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");

    if (searchTermFromUrl || sortFromUrl) {
      console.log(
        "Setting setSidebarData from URL: ",
        searchTermFromUrl,
        sortFromUrl,
      );
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
      });
    }

    /*  if (pageSizeFromUrl) {
        //if (searchTermFromUrl || sortFromUrl || pageSizeFromUrl) {
        console.log("Setting pageSize from URL: ", pageSizeFromUrl);
        setSidebarData({
          ...sidebarData,
          searchTerm: searchTermFromUrl,
          sort: sortFromUrl,
          pageSize: pageSizeFromUrl,
        });
        setPageSize(pageSizeFromUrl);
      } else {
        console.log("no pageSizeFromUrl: ");
      }
      if (searchTermFromUrl) {
        console.log("Setting searchTermFromUrl from URL: ", searchTermFromUrl);
        setSidebarData({
          ...sidebarData,
          searchTerm: searchTermFromUrl,
        });
      } else {
        console.log("no searchTermFromUrl: ");
      }
      if (sortFromUrl) {
        console.log("Setting sortFromUrl from URL: ", sortFromUrl);
        setSidebarData({
          ...sidebarData,
          sort: sortFromUrl,
        });
      } else {
        console.log("no sortFromUrl: ");
      } */

    //console.log("sidebarData: ", sidebarData);
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("page", "");
    let searchQuery2 = urlParams.toString();
    console.log("APPLIED QUERRY FROM FORM: ", searchQuery2);
    navigate(`/search?${searchQuery2}`);
  };

  //xl:min-h-screen
  //absolute bottom-0 left-0 right-0 top-0
  //<div className="h-full bg-red-500 ">
  // xl:h-full
  //xl:min-h-[calc(100vh_-_125px)]
  return (
    <div className="flex flex-col  xl:h-full xl:flex-row ">
      <Helmet defaultTitle="My Blog" titleTemplate="%s | My Blog">
        <title>{`Searching for "${sidebarData.searchTerm}" `}</title>
        <meta
          name="description"
          content={`Searching for ${sidebarData.searchTerm} `}
        />
      </Helmet>
      <div
        className="w-full border-layout-border bg-white px-3 py-1 dark:bg-dark-additional-bg/40   
       xl:min-h-[calc(100vh_-_125px)]
        xl:w-[300px] xl:flex-none xl:border-r xl:py-3"
      >
        <form className="flex flex-col gap-1 xl:gap-8" onSubmit={handleSubmit}>
          <div className="  flex items-center justify-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            {/*  <TextInput
              placeholder="Search..."
              id="searchTerm2"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            /> */}
            <input
              type="text"
              placeholder="Search..."
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
              className="w-full max-w-[500px] rounded-lg
       border border-main-border py-1.5 focus:border-main-border focus:ring-main-border dark:bg-dark-active-bg"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <label className="font-semibold">Sort:</label>
            {/*  <Select
              onChange={handleChange}
              value={sidebarData.sort || "desc"}
              id="sort2"
            >
              <option value="desc">Latest on top</option>
              <option value="asc">Oldest on top</option>
            </Select> */}
            <select
              onChange={handleChange}
              value={sidebarData.sort || "desc"}
              id="sort"
              className="flex appearance-none   rounded-lg 
         border border-main-border  bg-transparent 
         pb-1.5 pl-1  pt-1.5 
        text-center outline-1 outline-main-border     hover:bg-active-bg
          hover:outline hover:ring-main-border  focus:border-main-border 
          focus:ring-main-border dark:bg-slate-900  dark:hover:bg-dark-active-bg [&:not([size])]:pr-7"
            >
              {/* [&:not([size])]:pr-5  */}
              <option value="desc">Latest on top</option>
              <option value="asc">Oldest on top</option>
            </select>
          </div>
          <Button
            type="submit"
            outline
            gradientDuoTone="purpleToBlue"
            className="mx-auto min-w-[200px] max-w-[300px]"
          >
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="p-3 xl:h-full">
        <PostList />
      </div>
    </div>
  );
}
