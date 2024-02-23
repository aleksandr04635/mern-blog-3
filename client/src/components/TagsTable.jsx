import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function TagsTable() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/post/counttags`);
        //const res = await fetch(`/api/post/getposts`);
        const data = await res.json();
        if (res.ok) {
          setTags(data);
          console.log("fetched tags :", data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="table-auto   ">
      {tags && tags.length > 0 ? (
        <>
          <p className="py-1 px-1">The most popular tags:</p>
          <Table hoverable className="shadow-md">
            <Table.Head className="font-light normal-case">
              <Table.HeadCell>Tag name</Table.HeadCell>
              <Table.HeadCell>Number of posts with this tag</Table.HeadCell>
            </Table.Head>
            {tags.slice(0, 7).map((tag, i) => (
              <Table.Body className="" key={tag.slug}>
                <Table.Row className=" bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="max-w-[150px]">
                    {/*    {tag.slug} */}
                    <Link
                      key={i}
                      to={`/search?tag=${tag.slug}`}
                      className="dark:hover:bg-stone-700 hover:bg-stone-200 text-sm border rounded  px-2 py-1"
                    >
                      {tag.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="w-[150px]">{tag.count}</Table.Cell>
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
}
