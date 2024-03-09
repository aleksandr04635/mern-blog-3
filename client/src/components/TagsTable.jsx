import { Table, Button } from "flowbite-react";
import TagLink from "./TagLink";

//import { changePageSize } from "../redux/pageSize/pageSizeSlice";
import { useGetTagsQuery } from "../redux/apiSlice";

export default function TagsTable(reloadSwitch) {
  // const [tags, setTags] = useState([]);

  /*   const rest = await fetch(`/api/tag/get-all-tags`);
  const datat = await rest.json();
  console.log("datat from fetch: ", datat);
  if (!rest.ok) {
    console.log(datat.message);
    setPublishError(datat.message);
    return;
  }
  if (rest.ok) {
    setAllTagsInDB(datat.tags);
    setLoading(false);
  } */

  const {
    data: tags,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetTagsQuery(
    {},
    { refetchOnMountOrArgChange: true, refetchOnFocus: true },
  );
  if (isLoading) {
    // console.log("isLoading in TagsTable : ", isLoading);
  } else if (isSuccess) {
    //console.log("tags in TagsTable : ", tags);
  } else if (isError) {
    console.log("error in TagsTable : ", error);
  }

  /*   useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/tag/get-all-tags`);
        const data = await res.json();
        if (res.ok) {
          setTags(data);
          console.log("fetched tags in TagsTable:", data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchComments();
  }, [reloadSwitch]); */

  return (
    <div className=" px-1  ">
      {/*     <button onClick={refetch}>Refetch Posts</button> */}
      {tags && tags.length > 0 ? (
        <>
          <p className="py-1 ">The most popular tags:</p>
          <div className="border-main-border overflow-hidden rounded-lg border">
            <Table
              hoverable
              className="mx-auto w-full  rounded-b-lg  shadow-md "
            >
              <Table.Head className="font-light normal-case dark:bg-[#1f2937]">
                <Table.HeadCell className=" dark:bg-dark-active-bg">
                  Tag
                </Table.HeadCell>
                <Table.HeadCell className=" dark:bg-dark-active-bg">
                  Posts
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="text-gray-800 dark:text-white">
                {tags.slice(0, 10).map((tag, i) => (
                  <Table.Row
                    key={i}
                    className="bg-white py-1 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="max-w-[150px] overflow-hidden py-1 pl-2">
                      <TagLink tag={tag} />
                    </Table.Cell>
                    <Table.Cell className="w-[60px] py-1 text-center">
                      {tag.number_of_posts}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </>
      ) : (
        <p>You have no tags yet!</p>
      )}
    </div>
  );
}

/*   return (
    <div className="table-auto px-1  ">
      {tags && tags.length > 0 ? (
        <>
          <p className="py-1 ">The most popular tags:</p>
          <Table hoverable className="shadow-md w-full mx-auto">
            <Table.Head className="font-light normal-case">
              <Table.HeadCell>Tag</Table.HeadCell>
              <Table.HeadCell>Number of posts with this tag</Table.HeadCell>
            </Table.Head>
            {tags.slice(0, 10).map((tag, i) => (
              <Table.Body className="" key={i}>
                <Table.Row className="py-1 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="pl-2 py-1 max-w-[150px]">
                    <TagLink tag={tag} />
                    
                    <Link
                      key={tag._id}
                      to={`/search?tag=${tag.slug}`}
                      className="dark:hover:bg-stone-700 hover:bg-stone-200  text-sm border rounded  px-2 py-1"
                    >
                      {tag.name.split(" ").join("\u00A0")}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="w-[150px] py-1">
                    {tag.number_of_posts}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>You have no tags yet!</p>
      )}
    </div>
  );
} */
