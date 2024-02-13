import { Button, Select, TextInput, Spinner, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostList from "../components/PostList";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
  });

  console.log("sidebarData: ", sidebarData);

  useEffect(() => {
    console.log("USEEFFECT RUN. location.search: ", location.search);
    console.log("location: ", location);
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");

    if (searchTermFromUrl || sortFromUrl) {
      console.log(
        "Setting setSidebarData from URL: ",
        searchTermFromUrl,
        sortFromUrl
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

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-3 w-full bg-slate-50 sm:flex-none sm:w-[300px] md:border-r sm:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex   items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.sort || "desc"}
              id="sort"
            >
              <option value="desc">Latest on top</option>
              <option value="asc">Oldest on top</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToBlue">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="p-3">
        <PostList />
      </div>
    </div>
  );
}
